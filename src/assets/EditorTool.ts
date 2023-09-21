/**
 * Adds editing functionality to MapBox
 */

import MapboxDraw from "@mapbox/mapbox-gl-draw";
import DrawRectangle from "./DrawRectangleMode";
import DirectModeOverride from "./DirectModeOverride";
import * as turf from "@turf/turf";
import YardViewObject, { GeometryType } from "@/types/YardViewObject";

import {
  CircleMode,
  DragCircleMode,
  SimpleSelectMode
} from "mapbox-gl-draw-circle";

export interface EditObject {
  yardviewObject: YardViewObject;
  overrideShape: GeometryType;
  changes: number;
  fid: string | null;
}

export default class EditorTool {
  //public editObject!: EditObject | null;
  public editObject: EditObject | null = null;
  private map: mapboxgl.Map;
  private draw: MapboxDraw;

  constructor(map) {
    this.map = map;

    // custom modes not part of the default set of modes
    const modes = MapboxDraw.modes;
    modes.draw_rectangle = DrawRectangle;
    modes.draw_circle = CircleMode;
    modes.drag_circle = DragCircleMode;
    // modes.direct_select = DirectMode;
    modes.direct_select = DirectModeOverride;
    modes.simple_select = SimpleSelectMode;

    // create the Drawing control
    this.draw = new MapboxDraw({
      displayControlsDefault: false,
      userProperties: true,
      controls: {},
      modes: modes
    });

    // Cancel edit mode when pressing ESC (keyCode 27) or delete (keyCode 46)
    document.addEventListener("keyup", e => {
      if (!this.active()) {
        return;
      }
      if (e.keyCode === 27) {
        this.pressedEscape();
      } else if (e.keyCode === 46) {
        this.pressedDelete();
      } else if (e.keyCode === 33) {
        
        this.rotate(+5);
      } else if (e.keyCode === 34) {
        
        this.rotate(-5);
      } else if (e.keyCode === 82) {
        if (e.shiftKey) {
          
          this.rotate(-1);
        } else {
          
          this.rotate(1);
        }
      }
    });

    //Add the drawing handlers
    this.map.on("draw.create", e => this.drawUpdateArea(e));
    this.map.on("draw.delete", e => this.drawUpdateArea(e));
    this.map.on("draw.update", e => this.drawUpdateArea(e));
    this.map.on("draw.modechange", e => this.drawModeChange(e));
    this.map.on("draw.selectionchange", e => this.drawSelectionChange(e));
  }

  active() {
    return this.editObject != null;
  }

  design(yvObjectJSON: string, yvOverrideShape: GeometryType) {
    const yvObject: YardViewObject = JSON.parse(yvObjectJSON) as YardViewObject;

    

    this.editObject = Object.assign(
      {},
      {
        yardviewObject: yvObject,
        overrideShape: yvOverrideShape,
        changes: 0,
        fid: null
      }
    );
    // this.editObject = {
    //   yardviewObject: yvObject,
    //   overrideShape: yvOverrideShape,
    //   changes: 0,
    //   fid: null
    // };

    let yvShape = yvObject.GeoShape;
    if (yvOverrideShape == "POINT") {
      yvShape = "POINT";
    }

    this.map.addControl(this.draw);

    switch (yvShape) {
      case "POINT":
        this.editPoint(yvObject);
        break;
      case "RECTANGLE":
        this.editRectangle(yvObject);
        break;
      case "CIRCLE":
        this.editCircle(yvObject);
        break;
      case "POLYLINE":
        this.editLine(yvObject);
        break;
      case "POLYGON":
        this.editPolygon(yvObject);
        break;
    }
  }

  private pressedEscape() {
    if ("appInterface" in window && this.editObject) {
      // eslint-disable-next-line
      window["appInterface"].design_Completed(
        JSON.stringify(this.editObject.yardviewObject)
      );

      this.draw.deleteAll();
      this.map.removeControl(this.draw);
      this.editObject = null;
    }
  }

  private pressedDelete() {
    if (
      this.editObject != null &&
      this.draw.getMode() == "direct_select" &&
      this.editObject.yardviewObject.GeoShape == "POLYGON"
    ) {
      const feat = this.draw.get(this.editObject.fid);
      const selPoints = this.draw.getSelectedPoints().features;
      if (feat.geometry.coordinates[0].length - 1 - selPoints.length >= 3) {
        this.draw.trash();
      }
    }
  }

  private rotate(angle: number) {
    if (this.editObject != null && this.draw.getMode() == "direct_select") {
      const feat = this.draw.get(this.editObject.fid);
      if (feat.properties.isRectangle) {
        const areaRect: turf.Polygon = feat.geometry as turf.Polygon;
        //

        const rotatedPoly = turf.transformRotate(areaRect, angle, {});

        const newFeature = {
          id: this.editObject.fid,
          type: "Feature",
          properties: feat.properties,
          geometry: {
            type: feat.geometry.type,
            coordinates: rotatedPoly.coordinates
          }
        };

        this.draw.add(newFeature);
      }
    }
  }

  private editPoint(yvObject: YardViewObject) {
    if (this.editObject == null) {
      return;
    }

    const geometryCoordinates = this.convertFromYardviewCoordinates(
      yvObject.GeoShapePoints,
      false
    );

    if (!geometryCoordinates) {
      // new point
      this.map.getCanvas().style.cursor = "pointer";
      this.draw.changeMode("draw_point");
    } else {
      const feature = {
        type: "Point",
        coordinates: geometryCoordinates[0]
      };
      const featureIds = this.draw.add(feature);
      this.editObject.fid = featureIds[0];

      this.map.easeTo({ center: geometryCoordinates[0], zoom: 18 });

      this.draw.changeMode("simple_select", {
        featureId: this.editObject.fid
      });
    }
  }

  private editPolygon(yvObject: YardViewObject) {
    if (this.editObject == null) {
      return;
    }

    const geometryCoordinates = this.convertFromYardviewCoordinates(
      yvObject.GeoShapePoints,
      true
    );

    if (!geometryCoordinates) {
      // new polygon
      this.map.getCanvas().style.cursor = "pointer";
      this.draw.changeMode("draw_polygon");

      this.map.getCanvas().style.cursor = "crosshair";
    } else {
      const feature = {
        type: "Polygon",
        coordinates: [geometryCoordinates]
      };

      const featureIds = this.draw.add(feature);
      this.editObject.fid = featureIds[0];

      // const polygon = turf.polygon([geometryCoordinates]);
      // const bbox = turf.bbox(polygon) as mapboxgl.LngLatBoundsLike;

      // this.map.fitBounds(bbox, {
      //   padding: { top: 200, bottom: 200, left: 200, right: 200 }
      // });

      const polygon = turf.polygon([geometryCoordinates]);
      const center = turf.center(polygon);

      //@ts-ignore
      const centerpoint = center.geometry.coordinates;
      this.map.easeTo({ center: [centerpoint[0], centerpoint[1]], zoom: 15 });

      this.draw.changeMode("direct_select", {
        featureId: this.editObject.fid
      });
    }
  }

  private editLine(yvObject: YardViewObject) {
    if (this.editObject == null) {
      return;
    }

    const geometryCoordinates = this.convertFromYardviewCoordinates(
      yvObject.GeoShapePoints,
      false
    );

    if (!geometryCoordinates) {
      // new polygon
      this.map.getCanvas().style.cursor = "pointer";
      this.draw.changeMode("draw_line_string");
      this.map.getCanvas().style.cursor = "crosshair";
    } else {
      const feature = {
        type: "LineString",
        coordinates: geometryCoordinates
      };

      const featureIds = this.draw.add(feature);
      this.editObject.fid = featureIds[0];

      const line = turf.lineString(geometryCoordinates);
      // const bbox = turf.bbox(line) as mapboxgl.LngLatBoundsLike;

      // this.map.fitBounds(bbox, {
      //   padding: { top: 200, bottom: 200, left: 200, right: 200 }
      // });

      // const polygon = turf.polygon([geometryCoordinates]);
      const center = turf.center(line);

      //@ts-ignore
      const centerpoint = center.geometry.coordinates;
      this.map.easeTo({ center: [centerpoint[0], centerpoint[1]], zoom: 15 });

      this.draw.changeMode("direct_select", {
        featureId: this.editObject.fid
      });
    }
  }

  private editRectangle(yvObject: YardViewObject) {
    if (this.editObject == null) {
      return;
    }

    const geometryCoordinates = this.convertFromYardviewCoordinates(
      yvObject.GeoShapePoints,
      true
    );

    if (!geometryCoordinates) {
      // new polygon
      this.map.getCanvas().style.cursor = "pointer";
      this.draw.changeMode("draw_rectangle");
      this.map.getCanvas().style.cursor = "crosshair";
    } else {
      const feature = {
        type: "Polygon",
        coordinates: [geometryCoordinates]
      };

      const featureIds = this.draw.add(feature);
      this.editObject.fid = featureIds[0];
      this.draw.setFeatureProperty(this.editObject.fid, "isRectangle", true);

      const polygon = turf.polygon([geometryCoordinates]);
      const center = turf.center(polygon);

      //@ts-ignore
      const centerpoint = center.geometry.coordinates;
      this.map.easeTo({ center: [centerpoint[0], centerpoint[1]], zoom: 15 });

      this.draw.changeMode("direct_select", {
        featureId: this.editObject.fid
      });
    }
  }

  private editCircle(yvObject: YardViewObject) {
    if (this.editObject == null) {
      return;
    }

    if (!yvObject.GeoRadius) {
      this.map.getCanvas().style.cursor = "pointer";
      this.draw.changeMode("drag_circle", {
        initialRadiusInKm: 0.1
      });
      this.map.getCanvas().style.cursor = "crosshair";
    } else {
      const center = [
        yvObject.GeoPointLongitude,
        yvObject.GeoPointLatitude
      ] as turf.Coord;

      const circle = turf.circle(center, yvObject.GeoRadius / 1000);
      circle.type = "Feature";
      circle.properties = {
        isCircle: true,
        center: center,
        radiusInKm: yvObject.GeoRadius / 1000
      };

      const featureIds = this.draw.add(circle);
      this.editObject.fid = featureIds[0];

      //      const bbox = turf.bbox(circle) as mapboxgl.LngLatBoundsLike;

      // this.map.fitBounds(bbox, {
      //   padding: { top: 200, bottom: 200, left: 200, right: 200 }
      // });

      //@ts-ignore
      this.map.easeTo({
        center: [Number(yvObject.GeoPointLongitude), Number(yvObject.GeoPointLatitude)],
        zoom: 15
      });

      this.draw.changeMode("direct_select", {
        featureId: this.editObject.fid
      });
    }
  }

  private drawUpdateArea(e) {
    if (this.editObject == null) {
      return;
    }

    this.editObject.changes++;

    if (e.type == "draw.create") {
      const data = this.draw.getAll();
      this.editObject.fid = data.features[0].id;
    }
  }

  private drawModeChange(e) {
    if (e.mode == "simple_select") {
      this.finishedEditing();
    }
  }

  private drawSelectionChange(e) {
    if (e.features.length == 0 /* && this.editObject.changes > 0 */) {
      this.finishedEditing();
    }
  }

  private finishedEditing() {
    this.map.getCanvas().style.cursor = "";

    const me = this;
    setTimeout(function() {
      if (!me.editObject) {
        return;
      }
      if ("appInterface" in window) {
        const feat = me.draw.get(me.editObject.fid);

        if (me.editObject.overrideShape == "POINT") {
          me.editObject.yardviewObject.GeoShapePoints = me.convertToYardviewCoordinates(
            [feat.geometry.coordinates],
            false
          );
        } else if (me.editObject.yardviewObject.GeoShape == "CIRCLE") {
          me.editObject.yardviewObject.GeoPointLongitude =
            feat.properties.center[0];
          me.editObject.yardviewObject.GeoPointLatitude =
            feat.properties.center[1];
          me.editObject.yardviewObject.GeoRadius =
            feat.properties.radiusInKm * 1000;
        } else if (
          me.editObject.yardviewObject.GeoShape == "POLYGON" ||
          me.editObject.yardviewObject.GeoShape == "RECTANGLE"
        ) {
          me.editObject.yardviewObject.GeoShapePoints = me.convertToYardviewCoordinates(
            feat.geometry.coordinates[0],
            true
          );
        } else if (me.editObject.yardviewObject.GeoShape == "POLYLINE") {
          me.editObject.yardviewObject.GeoShapePoints = me.convertToYardviewCoordinates(
            feat.geometry.coordinates,
            false
          );
        }

        // eslint-disable-next-line
        window["appInterface"].design_Completed(
          JSON.stringify(me.editObject.yardviewObject)
        );
      }
      me.draw.deleteAll();

      me.map.removeControl(me.draw);
      me.editObject = null;
    }, 100);
  }

  private convertToYardviewCoordinates(coords, closedShape) {
    let yvCoords = "";
    let first = true;
    let i;
    let len = coords.length;
    if (closedShape) {
      len--;
    }
    for (i = 0; i < len; i++) {
      if (first) {
        first = false;
      } else {
        yvCoords += ",";
      }
      yvCoords += coords[i][1] + "/" + coords[i][0];
    }
    return yvCoords;
  }

  private convertFromYardviewCoordinates(
    geoShapePoints: string,
    closedShape: boolean
  ): [[number, number]] | null {
    const geometryCoordinates: Array<Array<number>> = [];
    if (!geoShapePoints || 0 === geoShapePoints.length) {
      return null;
    }
    const coordinates = geoShapePoints.split(",");
    coordinates.forEach(coordinate => {
      const latlon = coordinate.split("/");
      geometryCoordinates.push([Number(latlon[1]), Number(latlon[0])]);
    });

    //Polygon requires first and last position to be the same
    if (closedShape) {
      geometryCoordinates.push(geometryCoordinates[0]);
    }

    return geometryCoordinates as [[number, number]];
  }
}
