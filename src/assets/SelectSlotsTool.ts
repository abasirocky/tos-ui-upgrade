/**
 * Adds slot selection functionality to MapBox
 */

import mapboxgl, { GeoJSONSource } from "mapbox-gl";
import SelectionInterface from "../types/Selection";
import * as turf from "@turf/turf";
import { SlotFeatureDictionary } from "@/types/Slots";

export default class SelectSlotsTool {
  enabled = false;

  // Variable to hold the starting xy coordinates
  // when `mousedown` occured.
  start!: mapboxgl.Point;

  // Variable to hold the current xy coordinates
  // when `mousemove` or `mouseup` occurs.
  current!: mapboxgl.Point;

  // Variable for the draw box element.
  box!: HTMLDivElement | null;

  // Variable that will container de ID's of the selected features
  selectedFeatures: Array<mapboxgl.MapboxGeoJSONFeature> = [];

  // Status of deselection mode (Alt pressed)
  deselectMode = false;

  // Reference to the Mapbox Map object
  map: mapboxgl.Map;

  // Reference to the canvas element
  canvas: HTMLElement;

  slotsDict: SlotFeatureDictionary;

  // Event wrapper funcions so that events can be removed
  // dynamically.
  mouseDownEventListener = event => {
    this.onMouseDown(event);
  };

  mouseMoveEventListener = event => {
    this.onMouseMove(event);
  };

  mouseUpEventListener = event => {
    this.onMouseUp(event);
  };

  keyDownEventListener = event => {
    this.onKeyDown(event);
  };

  constructor(map: mapboxgl.Map, slotsDict: SlotFeatureDictionary) {
    this.map = map;

    this.slotsDict = slotsDict;
    this.canvas = this.map.getCanvasContainer();

    this.map.addSource("selected_slots", {
      type: "geojson",
      data: {
        type: "FeatureCollection",
        features: []
      }
    });

    this.map.addLayer(
      {
        id: "slots-highlighted",
        type: "fill",
        source: "selected_slots",
        paint: {
          "fill-color": "#fff240",
          "fill-outline-color": "#807b38",
          "fill-opacity": 0.75
        }
      },
      "previewareas"
    ); // Place polygon under these labels.
  }

  /**
   * Update the data source with the selected features
   */
  update() {
    //Get preview slots source
    const source: GeoJSONSource = this.map.getSource(
      "selected_slots"
    ) as GeoJSONSource;

    //Set preview area data
    source.setData(
      turf.featureCollection(
        this.selectedFeatures
      ) as GeoJSON.FeatureCollection<GeoJSON.Geometry>
    );
  }

  /**
   * Enable or disable the slot selection mode
   */
  setEnabled(enabled: boolean, preselectedItems?: Array<SelectionInterface>) {
    this.enabled = enabled;

    this.clearSelection();

    if (enabled) {
      // disable map rotation using right click + drag
      this.map.dragRotate.disable();

      // disable map rotation using touch rotation gesture
      this.map.touchZoomRotate.disableRotation();

      //Preselect items if needed
      if (preselectedItems != null) {
        this.selectItems(preselectedItems);
      }

      this.canvas.addEventListener(
        "mousedown",
        this.mouseDownEventListener,
        true
      );
    } else {
      this.canvas.removeEventListener(
        "mousedown",
        this.mouseDownEventListener,
        true
      );

      // disable map rotation using right click + drag
      this.map.dragRotate.enable();

      // disable map rotation using touch rotation gesture
      this.map.touchZoomRotate.enableRotation();
    }
  }

  highlight(selectedItems: Array<SelectionInterface> | null) {
    if (selectedItems != null) {
      this.selectItems(selectedItems);
    } else {
      this.clearSelection();
    }
  }
  /**
   * Will return an array of SelectionInterface objects that reflect
   * the slots that area selected.
   */
  getSelectedSlots(): SelectionInterface[] {
    const slots: SelectionInterface[] = [];

    this.selectedFeatures.forEach(feature => {
      if (feature.properties && feature.properties.code != null) {
        slots.push({
          Area: feature.properties.code,
          Row: feature.properties.row,
          Bay: feature.properties.bay
        });
      }
    });
    return slots;
  }
  /**
   * Deselect all selected features
   */
  clearSelection() {
    this.selectedFeatures = [];
    this.update();
  }
  /**
   * Selects the slots that are part of the selected items structure
   */
  selectItems(selectedItems: Array<SelectionInterface>) {
    this.selectedFeatures = [];

    selectedItems.forEach(item => {
      if (item.Row == null && item.Bay == null) {
        // Check if the area is structured or not
        const areaFeatures = this.map.querySourceFeatures("areas", {
          sourceLayer: "areas",
          filter: [
            "all",
            ["==", "code", item.Area],
            ["==", "structure", "NONE"]
          ]
        });

        if (areaFeatures.length >= 1) {
          // Due to the vector tiles areas can be returned as parts therefore we
          // have to union these features.
          //@ts-ignore
          this.selectedFeatures.push(turf.union(...areaFeatures));
        } else {
          // This area is structured so add all the slot of a single area
          const features = this.slotsDict.getAreaFeatures(item.Area);
          this.selectedFeatures.push(...features);
        }
      } else if (item.Bay == null && item.Row != null) {
        // Select an entire row
        const features = this.slotsDict.getRowFeatures(item.Area, item.Row);
        this.selectedFeatures.push(...features);
      } else if (item.Row == null && item.Bay != null) {
        // Select an entire bay
        const features = this.slotsDict.getBayFeatures(item.Area, item.Bay);
        this.selectedFeatures.push(...features);
      } else {
        // Add a single slot
        const feature = this.slotsDict.getFeature(
          item.Area,
          item.Bay,
          item.Row
        );
        if (feature != null) {
          this.selectedFeatures.push(feature);
        }
      }
    });

    this.update();
  }

  onMouseDown(e: MouseEvent) {
    // if (e.ctrlKey) {
    //   // Rotate mode is active so do not start the selection logic
    //   return;
    // }

    if (!e.ctrlKey && !e.shiftKey && !e.altKey) {
      return;
    }

    // Disable default drag zooming when the shift key is held down.
    this.map.dragPan.disable();

    // Add the event listeners
    document.addEventListener("mousemove", this.mouseMoveEventListener);
    document.addEventListener("mouseup", this.mouseUpEventListener);
    document.addEventListener("keydown", this.keyDownEventListener);

    // Capture the first xy coordinates
    this.start = this.mousePos(e);
  }

  onMouseMove(e: MouseEvent) {
    // Capture the ongoing xy coordinates
    const current = this.mousePos(e);

    // Append the box element if it doesnt exist
    if (!this.box) {
      this.box = document.createElement("div");
      this.box.classList.add("boxdraw");
      this.canvas.appendChild(this.box);
    }

    const minX = Math.min(this.start.x, current.x),
      maxX = Math.max(this.start.x, current.x),
      minY = Math.min(this.start.y, current.y),
      maxY = Math.max(this.start.y, current.y);

    // Adjust width and xy position of the box element ongoing
    const pos = "translate(" + minX + "px," + minY + "px)";
    this.box.style.transform = pos;
    this.box.style.width = maxX - minX + "px";
    this.box.style.height = maxY - minY + "px";
  }

  // Return the xy coordinates of the mouse position
  mousePos(e: MouseEvent): mapboxgl.Point {
    const rect = this.canvas.getBoundingClientRect();
    return new mapboxgl.Point(
      e.clientX - rect.left - this.canvas.clientLeft,
      e.clientY - rect.top - this.canvas.clientTop
    );
  }

  onMouseUp(e) {
    // Enabled deselect mode van the alt key pressed
    this.deselectMode = e.altKey;

    if (!e.shiftKey && !this.deselectMode) {
      this.selectedFeatures = [];
    }

    // Capture xy coordinates
    this.finish([this.start, this.mousePos(e)]);
  }

  onKeyDown(e: KeyboardEvent) {
    // If the ESC key is pressed
    if (e.keyCode === 27) this.finish();
  }

  finish(bbox?: [mapboxgl.PointLike, mapboxgl.PointLike]) {
    // Remove these events now that finish has been called.
    document.removeEventListener("mousemove", this.mouseMoveEventListener);
    document.removeEventListener("mouseup", this.mouseUpEventListener);
    document.removeEventListener("keydown", this.keyDownEventListener);

    if (this.box && this.box.parentNode) {
      this.box.parentNode.removeChild(this.box);
      this.box = null;
    }

    // If bbox exists. use this value as the argument for `queryRenderedFeatures`
    if (bbox) {
      //Extract the features that are within the bounding box
      const features: Array<mapboxgl.MapboxGeoJSONFeature> = this.map.queryRenderedFeatures(
        bbox,
        {
          layers: ["slots", "areas"]
        }
      );

      if (this.deselectMode) {
        // Run through the newly selected features and put all the ID's of
        // features in a seperate list so that it can be used to filter
        // the actual selected filters
        const filter = features.reduce(function(selected, feature) {
          if (feature.properties != null && feature.properties.fid != null) {
            selected.push(feature.properties.fid);
          }
          return selected;
        }, [] as string[]);

        // In deselection mode so remove the features from the selected list
        this.selectedFeatures = this.selectedFeatures.filter(
          item =>
            item.properties != null &&
            filter.indexOf(item.properties.fid) === -1
        );
      } else {
        const selectedFeatures = features.filter(
          feature =>
            feature.properties != null &&
            (feature.properties.structure == "NONE" ||
              feature.properties.row != null)
        );

        // Due to the vector tiles areas can be returned as parts therefore we
        // have to union these features.
        const combinedFeatures: mapboxgl.MapboxGeoJSONFeature[] = [];
        selectedFeatures.forEach(feature => {
          if (feature.properties != null && feature.properties.row != null) {
            combinedFeatures.push(feature);
          } else if (feature.properties != null) {
            if (
              !combinedFeatures.find(
                f =>
                  f.properties != null &&
                  feature.properties != null &&
                  f.properties.code === feature.properties.code
              )
            ) {
              const siblings = selectedFeatures.filter(
                f =>
                  f.properties != null &&
                  feature.properties != null &&
                  f.properties.code === feature.properties.code
              );
              if (siblings.length > 1) {
                //@ts-ignore
                combinedFeatures.push(turf.union(...siblings));
              } else {
                combinedFeatures.push(feature);
              }
            }
          }
        });

        //Add the newly selected features to the selected features array
        this.selectedFeatures.push(...combinedFeatures);
      }

      this.update();
    }

    this.map.dragPan.enable();
  }
}
