
<!-- @ts nocheck -->
<template>
  <div
    id="map"
    ref="map"
    :class="selectionMode && 'selection-mode'"
    :style="styleMap"
  >
    <div v-show="designing !== ''" class="help-keys">
      <table>
        <tr v-show="designing === 'RECTANGLE'">
          <td>[r]</td>
          <td>rotate +1&deg;</td>
        </tr>
        <tr v-show="designing === 'RECTANGLE'">
          <td>[r] + [SHIFT]</td>
          <td>rotate -1&deg;</td>
        </tr>
        <tr v-show="designing === 'RECTANGLE'">
          <td>[PgUp]</td>
          <td>rotate +5&deg;</td>
        </tr>
        <tr v-show="designing === 'RECTANGLE'">
          <td>[PdDn]</td>
          <td>rotate -5&deg;</td>
        </tr>
        <tr v-show="designing === 'POLYGON'">
          <td>[DEL]</td>
          <td>delete vertex</td>
        </tr>
        <tr>
          <td>[ESC]</td>
          <td>cancel drawing</td>
        </tr>
      </table>
    </div>
    <div v-show="selectionMode" class="help-keys">
      <table>
        <tr>
          <td>mouse</td>
          <td>pan the map</td>
        </tr>
        <tr>
          <td>mouse + [CTRL]</td>
          <td>select</td>
        </tr>
        <tr>
          <td>mouse + [SHIFT]</td>
          <td>add to selection</td>
        </tr>
        <tr>
          <td>mouse + [ALT]</td>
          <td>remove from selection</td>
        </tr>
      </table>
    </div>
    <div
      v-if="selectionMode"
      id="save-selection"
      class="button"
      @click="saveSelectionClicked"
    >
      Save selection
    </div>
    <div
      v-if="selectionMode"
      id="cancel-selection"
      class="button"
      @click="cancelClicked"
    >
      Cancel
    </div>
  </div>
</template>

<script lang="ts">
// @ts-nocheck

import axios from "axios";
import ApiService from "@/core/services/api.service";
import TerminalControlServices from "terminalcontrolservices";
import mapboxgl, {
  FillPaint,
  GeoJSONSource,
  LinePaint,
  MapboxGeoJSONFeature,
} from "mapbox-gl";
import * as turf from "@turf/turf";

import { Component, Emit, Ref, Vue, Watch, Prop } from "vue-facing-decorator";

// import functions
import {
  GETBerthInit
} from "@/core/services/store/berthplanning.module";



//Import of assets
import SlotParameters from "../assets/SlotParameters";
import SelectSlotsTool from "../assets/SelectSlotsTool";
import EditorTool from "../assets/EditorTool";
import ShipLayer from "../assets/ShipLayer";
import SedanLayer from "../assets/3DLayers/SedanLayer";
import VanLayer from "../assets/3DLayers/VanLayer";
import BikeLayer from "../assets/3DLayers/BikeLayer";
import PickupLayer from "../assets/3DLayers/PickupLayer";

import BusLayer from "../assets/3DLayers/BusLayer";

import HachbackLayer from "../assets/3DLayers/HachbackLayer";
import SuvLayer from "../assets/3DLayers/SuvLayer";
import StationwagonLayer from "../assets/3DLayers/StationwagonLayer";
import MinivanLayer from "../assets/3DLayers/MinivanLayer";
import TruckLayer from "../assets/3DLayers/TruckLayer";

import BerthsLayer from "../assets/BerthsLayer";
// Import of types

import { Occupation, OccupationDictionary } from "@/types/Occupation";
import { SlotFeatureDictionary } from "@/types/Slots";
import ColorScheme from "../types/ColorScheme";
import SelectionInterface from "../types/Selection";
import YardViewObject from "../types/YardViewObject";
import Lane from "@/types/Lane";
import LaneOccupation from "@/types/LaneOccupation";
import { v4 as uuidv4 } from 'uuid';


// @ts-ignore
@Component({
  name: "YardView",
})
export default class YardView extends Vue {
  // $refs!: {
  //   map: HTMLElement;
  // };
  
  @Prop({ default: "" })
  private readonly styleMap!: string;

  @Prop()
  private readonly terminalId!: string;

  @Prop({ default: [] })
  private readonly terminals!: string;

  @Prop({ default: "1" })
  private readonly terminal!: string;

  @Ref("map") readonly mapElement!: HTMLElement;




  
  private isPageRefreshing: boolean
  private sessionId!: string;
  private useRoro3dModel!: boolean;

  private map: mapboxgl.Map;
  private areas: Array<turf.Feature> = [];
  private slots: Array<turf.Feature> = [];
  private stacks: Array<turf.Feature> = [];
  private object3dlabelsFeatures: Array<turf.Feature> = [];
  private containers: Array<turf.Feature> = [];
  private tcServices: TerminalControlServices;
  private vechiles: Array<turf.Feature> = [];
  private areaObjects: Array<YardViewObject> = [];
  private occupationObjectList: OccupationDictionary | null = null;
  private roro3DModelList: Array<string> = [];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private bolards: Array<any> = [];
  private OccupationRoroLaneList: Array<LaneOccupation> = [];
  private showCancelButton = false;
  private showSaveSelectionButton = false;
  private selectionMode = false;
  private previewMode = false;
  private previewObject!: string | null;
  private editor: EditorTool | null = null;

  private selectSlotsTool: SelectSlotsTool | null = null;
  private slotsDict: SlotFeatureDictionary = new SlotFeatureDictionary();

  private apiUrl: string = null;

  private terminalId;
  private terminals
  private terminal
  private berthTimeout = 0;
  private BerthData: BerthManagment.RootObject = null;

  pageurl!: string;
  renderQuality!: string; //"High" | "Low" | "Medium";
  @Emit("clickobject")
  clickobject(props: any) {
    return props;
  }
  @Emit("loadcomplete")
  loadcomplete(mode) {
    return mode;
  }

  get designing() {
    if (!(this.editor && this.editor.editObject)) return "";
    return this.editor.editObject.yardviewObject.GeoShape;
  }

  constructor() {
    super();

    this.isPageRefreshing = this.$store.state.berthMonitoring.isPageRefreshing 
    this.renderQuality = "High";
    this.sessionId = this.readQueryStringParams();
    

     //this.sessionId = this.getSessionId();

    //const path = window["appInterface"].getWebServicesBaseUrl();
    //
    //let webserviceurl = "http://localhost:59003";
    let webserviceurl = "http://185.73.203.108:59003";

    //let webserviceurl ="http://development-cluster.phaeros.com/yardview-webservices" ;
    this.tcServices = new TerminalControlServices(webserviceurl);
    //this.tcServices = new TerminalControlServices(this.apiUrl);
    // Instantiate the Terminal Control API component
  }
  getSessionId(): string {
    let sessionId = "";

     
    this.useRoro3dModel = false;

    window.location.href.replace(
      /[?&]+([^=&]+)=([^&]*)/gi,
      //@ts-ignore
      (m: string, key: string, value: string) => {
        if (key.toLowerCase() == "sessionid") {
          sessionId = value;
        }
        if (key.toLowerCase() == "useroro3dmodel") {
          this.useRoro3dModel = Number(value) === 1;
        }
      }
    );

    //For testing purposes only
    if (!sessionId) {
      //  sessionId = "130b02a0-920b-4616-9143-e28369e553dc";
      sessionId = "xxx";

      //sessionId = "4809fea4-d3e0-431d-b633-bfec73ab59e9";
      //console.error("No session Id found!");
    }

    return sessionId;
  }

  // getInit() {
  //     this.$store.dispatch(GETBerthInit).then(() => {
  //       const errors = this.getBerthChartErrors;
  //       if (errors.length > 0) {
  //         this.showErrors(errors);
  //       } else {
  //         var model = this.getBerthChartInit;
  //         this.terminals = model.ports;

  //         if (this.terminals.length > 0) {
  //           if (this.standalone) {
  //             this.terminal = [this.terminals[0].id];
  //             this.terminalId = this.terminals[0].id;
  //           }
  //         }
  //         this.Refresh_Click();
  //       }
  //     });
  //   }


  @Watch("selectionMode")
  onSelectionModeChanged() {
    this.toggleOccupationLayers();
  }

  @Watch("terminalId")
  onTerminalIdChanged(val, oldVal) {
    if (val != oldVal && val !== undefined) {
      this._onMapReloaded()
    }
  }

  @Watch("isPageRefreshing")
  function() {
    console.log('GET_IS_PAGE_REFRESHING', this.isPageRefreshing)
  } 

  @Watch("previewMode")
  onPreviewModeChanged() {
    this.toggleOccupationLayers();
  }
  rePaintMap(terminalId: number, renderQuality: string) {
    this.renderQuality = renderQuality;
    if (this.renderQuality === "Low") {
      this.useRoro3dModel = false;
    }
    this.terminalId = terminalId;
    this.map.remove();

    this.congigMapbox(this.mapElement);
  }

  mapResize() {
    this.map.resize();
  }

  mounted() {
    //this.sessionId=this.getSessionFromBerthViewApi();
    this.sessionId = this.readQueryStringParams();
    // this.getInit();
    //this.readQueryStringParams();
    
    this.congigMapbox(this.mapElement);
  }

  congigMapbox(parentEL: HTMLElement) {
    let firstlocation = { lng: 0, lat: 0, bearing: 0, zoom: 1 };
    if (this.BerthData) {
      firstlocation = this.extractTerminalLocation(this.BerthData.data);
    }

    //Support Right to left
    if (mapboxgl.getRTLTextPluginStatus() !== "loaded") {
      mapboxgl.setRTLTextPlugin(
        "https://api.mapbox.com/mapbox-gl-js/plugins/mapbox-gl-rtl-text/v0.2.3/mapbox-gl-rtl-text.js",
        null,
        true // Lazy load the plugin
      );
    }

    this.map = new mapboxgl.Map({
      container: parentEL,
      style: "json/style.json",
      center: [firstlocation.lng, firstlocation.lat],
      zoom: firstlocation.zoom ? firstlocation.zoom : 14,
      bearing: firstlocation.bearing,
      antialias: false,
    });

    // Disable default box zooming.
    this.map.boxZoom.disable();
    this.editor = new EditorTool(this.map);

    this.areas = [];
    this.slots = [];
    this.stacks = [];
    this.containers = [];
    this.vechiles = [];

    this.map.on("load", () => this._onMapLoaded());
    this.map.on("pitch", () => this._onPitch());
    this.map.on("click", (e) => this.onFeatureClicked(e));
    this.map.on("mousemove", (e) => this._onMouseMove(e));
    this.map.on("rotateend", () => this._onRotated());

    const me = this;

    //@ts-ignore
    window.update = function update() {
      //@ts-ignore
      this.update();
    };

    //@ts-ignore
    window.design = function design(yvObject, yvOverrideShape) {
      if (me.editor != null) {
        me.editor.design(yvObject, yvOverrideShape);
      }
    };

    //@ts-ignore
    window.preview = function preview(yvObject) {
      me.preview(JSON.parse(yvObject));
    };

    //@ts-ignore
    window.refresh = function refresh(includingStructure) {
      me.refresh(includingStructure);
    };

    window["highlightSlots"] = function highlightSlots(selected: string) {
      me.highlightSlots(selected);
    };

    window["selectSlots"] = function selectSlots(selected: string) {
      me.selectSlots(selected);
    };
  }

  generateAnchorageLine(geoShapePoints) {
    const geometryCoordinates: Array<Array<number>> = [];
    const coordinates = geoShapePoints.split(",");
    coordinates.forEach((coordinate) => {
      const latlon = coordinate.split("/");
      geometryCoordinates.push([Number(latlon[1]), Number(latlon[0])]);
    });

    return turf.lineString(geometryCoordinates, {
      code: "",
      objectType: "",
      structure: "POLYLINE",
    });
  }
  getBerths() {
    if (this.terminal == undefined) {
      this.berthTimeout = 200
    }
    this.sessionId = this.readQueryStringParams();
    const url = `system/terminalmonitoring/getterminalmonitoring`;
    const payload = {
      terminalId: typeof(this.terminal) === 'object' ? this.terminal[0] : this.terminal
    }

    this.$store.state.berthMonitoring.isLoading = true
    ApiService
      .post(url, payload)
      .then(({ data }) => {
        this.berthTimeout = 0;
        if (data.isSuccessful) {
          this.BerthData = data;

          console.log('renderBerth', data)
          this.RenderBerth(data);
        } else {
          console.error("error load terminal data:", this.$props.terminal[0]);
        }
      })
      .catch(console.error).finally(() => {
        this.$store.state.berthMonitoring.isLoading = false
      })
  }
  addBolardsLabel(bolards) {
    bolards.forEach((item) => {
      const objCoordLane = turf.destination(item.position, 0, 0);

      const bolard = item.bolard;

      const labelRotation = this.getLabelRotation(0);
      const label = item.bolard.name; //+ "\n" + String(vParameters.berthId);
      const vParameters = {
        origin: objCoordLane,
        vin: bolard.name,
        berthId: item.berthId,
        bolardId: Number(bolard.id),
        //  row: ncount,
      };
      const props = {
        label: label,
        code: label,
        anchor: "top-center",
        offset: [0.0, 1],
        rotate: labelRotation,
      };
      objCoordLane.properties = props;

      //  this.object3dlabelsFeatures.push(objCoordLane);
      this.bolards.push(vParameters);
    });
    this.renderBerthLabels();
  }
  renderBerthLabels() {
    const bolardslotsSource: GeoJSONSource = this.map.getSource(
      "object3dlabels"
    ) as GeoJSONSource;
    bolardslotsSource?.setData(
      turf.featureCollection(
        this.object3dlabelsFeatures
      ) as GeoJSON.FeatureCollection<GeoJSON.Geometry>
    );

    //Set vechiles stacks data
    const rorobox3dSource: GeoJSONSource = this.map.getSource(
      "vechiles"
    ) as GeoJSONSource;
    rorobox3dSource.setData(
      turf.featureCollection(
        this.vechiles
      ) as GeoJSON.FeatureCollection<GeoJSON.Geometry>
    );
  }
  extractTerminalLocation(data: BerthManagment.Data) {
    let target = [0, 0];

    if (
      data.mapLatitude &&
      data.mapLongitude &&
      Number(data.mapLatitude) &&
      Number(data.mapLongitude)
    ) {
      target = [Number(data.mapLongitude), Number(data.mapLatitude)];
    } else {
      if (data.berths.length > 0) {
        const points = this.getBerthCoordinates(data.berths[0]);
        target = [Number(points[0][0]), Number(points[0][1])];
      } else {
        const points = this.getAnchroheLineCoordinates(data.geoAnchorageLine);
        target = [Number(points[0][0]), Number(points[0][1])];
      }
    }
    let bearing = 0;
    if (data.mapBearing) {
      bearing = Number(data.mapBearing);
    }
    return { lng: target[0], lat: target[1], bearing: bearing, zoom: 14 };
  }
  flytoTerminalPosition(data: BerthManagment.Data) {
    const result = this.extractTerminalLocation(data);
    this.map.setPitch(0);
    //24.25185906455384/54.44505079512584
    this.map.flyTo({
      center: [result.lng, result.lat],
      //  center: [54.44505079512584, 24.25185906455384],
      bearing: result.bearing,
      zoom: 15, // this.map.getZoom(),
      essential: true, // this animation is considered essential with respect to prefers-reduced-motion
    });
  }
  RenderBerth(res: BerthManagment.RootObject) {
    
    if (res.isSuccessful) {
      this.flytoTerminalPosition(res.data);
      if (!res.data.berths || res.data.berths.length === 0) {
        this.pagecomplete();
        return;
      }
      const berthGroups = this.getBerthGroups(res.data);

      berthGroups.forEach((item) => {
        item.portUnCode = res.data.portUnCode;
        item.portName = res.data.portName;
        item.name = res.data.name;
        const berhsLayer = new BerthsLayer(item, (bolards) => {
          this.addBolardsLabel(bolards);

          if (item.voyageInBerths)
            this.VoyageInBerthRender(item.voyageInBerths, item);
        });
        this.map.addLayer(berhsLayer as mapboxgl.AnyLayer);
      });
      this.VoyageInAnchoragesRender(res.data);
      this.renderBerthLabels();
      this.pagecomplete();
    } else {
      console.error(res.message.join(","));
    }
  }
  getBerthGroups(data: BerthManagment.Data) {
    const BerthGroups: BerthManagment.Data[] = [];
    let drawBerths: BerthManagment.Data = {} as BerthManagment.Data;

    drawBerths.berths = [];
    drawBerths.berths.push(data.berths[0]);
    let sumlength = data.berths[0].length;
    let berthPoints0 = this.getBerthCoordinates(data.berths[0]);

    for (let i = 1; i < data.berths.length; i++) {
      const berth = data.berths[i];
      const berthPoints = this.getBerthCoordinates(berth);
      if (berthPoints && berthPoints.length > 0) {
        const distance =
          1000 *
          turf.distance(
            [berthPoints0[0][0], berthPoints0[0][1]],
            [berthPoints[0][0], berthPoints[0][1]]
          );
        if (distance - sumlength > 5) {
          berthPoints0 = this.getBerthCoordinates(berth);
          sumlength = 0;
          BerthGroups.push(Object.assign({}, drawBerths));
          drawBerths.berths = [];
          drawBerths.berths.push(data.berths[i]);
        } else {
          sumlength += berth.length + (distance - sumlength);
        }
      } else {
        drawBerths.berths.push(berth);
        sumlength += berth.length;
      }

      //drawBerths.berths.push(berth);
    }

    BerthGroups.push(drawBerths);
    for (let i = 0; i < data.voyageInBerths.length; i++) {
      const ship = data.voyageInBerths[i];
      for (let g = 0; g < BerthGroups.length; g++) {
        if (this.CheckIsInGroup(ship, BerthGroups[g])) {
          if (!BerthGroups[g].voyageInBerths) {
            BerthGroups[g].voyageInBerths = [];
          }
          BerthGroups[g].voyageInBerths.push(Object.assign({}, ship));
        }
      }
    }
    for (let i = 0; i < BerthGroups.length; i++) {
      BerthGroups[i].id = `GROUP_${i}-${uuidv4()}`;
    }
    return BerthGroups;
  }
  CheckIsInGroup(
    ship: BerthManagment.VoyageInBerth,
    berthGroup: BerthManagment.Data
  ) {
    const ids: number[] = [];
    berthGroup.berths.forEach((v) => {
      const u = v.bollards.map((r) => r.id);
      ids.push(...u);
    });
    const results = ids.filter((id) => id === Number(ship.startBollardId));

    return results.length > 0;
  }

  getAnchroheLineCoordinates(geoAnchorageLine: string) {
    const geometryCoordinates: Array<Array<number>> = [];
    if (geoAnchorageLine) {
      try {
        const geogson = JSON.parse(geoAnchorageLine);
        if (geogson.geometry && geogson.geometry.coordinates) {
          geogson.geometry.coordinates.forEach((item) => {
            geometryCoordinates.push([item[0], item[1]]);
          });
        }
      } catch {
        const coordinates = geoAnchorageLine.split(",");
        coordinates.forEach((coordinate) => {
          const latlon = coordinate.split("/");
          geometryCoordinates.push([Number(latlon[1]), Number(latlon[0])]);
        });
      }
    }

    return geometryCoordinates;
  }
  getBerthCoordinates(Berth: BerthManagment.Berth) {
    const geometryCoordinates: Array<Array<number>> = [];
    if (Berth.polygon) {
      try {
        const geogson = JSON.parse(Berth.polygon);
        if (geogson.geometry && geogson.geometry.coordinates) {
          geogson.geometry.coordinates[0].forEach((item) => {
            geometryCoordinates.push([item[0], item[1]]);
          });
        }
      } catch {
        const coordinates = Berth.polygon.split(",");
        coordinates.forEach((coordinate) => {
          const latlon = coordinate.split("/");
          geometryCoordinates.push([Number(latlon[1]), Number(latlon[0])]);
        });
      }
    }

    return geometryCoordinates;
  }
  VoyageInBerthRender(
    VoyageInBerths: BerthManagment.VoyageInBerth[],
    data: BerthManagment.Data
  ) {
    const BerhStartPoints = this.getBerthCoordinates(data.berths[0]);
    const anglex = turf.bearing(BerhStartPoints[0], BerhStartPoints[1]);
    let angley = turf.bearing(BerhStartPoints[1], BerhStartPoints[2]);
    const BerthHeight = 70; //    1000 * turf.distance(BerhStartPoints[1], BerhStartPoints[2]);
    //const fg = turf.destination.destination(BerhStartPoints[2], BerthHeight / 1000, anglex + 90);

    let feturePoints = [];
    for (let i = 0; i < VoyageInBerths.length; i++) {
      feturePoints = [];
      const ship = VoyageInBerths[i];

      const bolard = this.bolards.find(
        (bolrad) => bolrad.bolardId === Number(ship.startBollardId)
      );

      const endbolard = this.bolards.find(
        (bolrad) => bolrad.bolardId === Number(ship.endBollardId)
      );

      //P0
      feturePoints.push(bolard.origin.geometry.coordinates);

      const endpoint = turf.destination(bolard.origin, ship.loa / 1000, anglex);

      //P1
      feturePoints.push(endpoint.geometry.coordinates);
      //P2
      const newPoint2 = turf.destination(endpoint, BerthHeight / 1000, angley);
      feturePoints.push(newPoint2.geometry.coordinates);

      //P3
      const P3 = turf.destination(bolard.origin, BerthHeight / 1000, angley);
      feturePoints.push(P3.geometry.coordinates);

      const fetureShip = this.CreateShip3DFetureModel(feturePoints, ship, data);
      this.vechiles.push(fetureShip);

      const origin = turf.midpoint(bolard.origin, newPoint2);

      const shiplayear = new ShipLayer(
        origin,
        ship,
        bolard.origin,
        endpoint,
        anglex
      );
      this.map.addLayer(shiplayear as mapboxgl.AnyLayer);

      const captionOrigin = turf.destination(
        origin,
        ship.loa / 3 / 1000,
        angley
      );
      const label = `${ship.vesselName}\n(${ship.voyageNoIn},${ship.voyageNoOut})\n${ship.loa}m`;
      const props = {
        label: label,
        code: ship.id,
        anchor: "top-center",
        offset: [0.0, -1],
        rotate: 0,
      };
      captionOrigin.properties = props;
      this.object3dlabelsFeatures.push(captionOrigin);
    }
    this.renderBerthLabels();
  }
  CreateShip3DFetureModel(points, ship, terminal) {
    const properties = {
      base: 0,
      height: 50,
      layer: 1,
      shipid: ship.id,
      shipName: ship.vesselName,
      type: "ship",
      maxLayer: 1,
      terminal: terminal.name,
      portName: terminal.portName,
      portUnCode: terminal.portUnCode,
    };

    return turf.polygon(
      [
        [
          //@ts-ignore
          points[0],
          //@ts-ignore
          points[1],
          //@ts-ignore
          points[2],

          //@ts-ignore
          points[3],
          //@ts-ignore
          points[0],
        ],
      ],
      {
        ...properties,
      }
    );
  }

  VoyageInAnchoragesRender(data: BerthManagment.Data) {
    const VoyageInAnchorages = data.voyageInAnchorages;
    let geometryCoordinates: Array<Array<number>> = [];

    const points = this.getAnchroheLineCoordinates(data.geoAnchorageLine);
    points.forEach((coordinate) => {
      geometryCoordinates.push([coordinate[0], coordinate[1]]);
    });

    // geometryCoordinates.reverse();
    geometryCoordinates = this.addnewPoint(
      geometryCoordinates,
      VoyageInAnchorages.length + 1
    );

    for (let i = 0; i < VoyageInAnchorages.length; i++) {
      const ship = VoyageInAnchorages[i];
      const feturePoints = [];
      const startPoint = turf.destination(geometryCoordinates[i], 0, 0);
      const bearing = turf.bearing(startPoint, geometryCoordinates[i + 1]);
      const shipWidth = Number(ship.loa);
      const endPoint = turf.destination(startPoint, shipWidth / 1000, bearing);
      const midPoint = turf.midpoint(startPoint, endPoint);
      const shiplayear1 = new ShipLayer(
        midPoint,
        ship,
        startPoint,
        endPoint,
        bearing
      );
      this.map.addLayer(shiplayear1 as mapboxgl.AnyLayer);
      this.roro3DModelList.push(shiplayear1.id);

      const captionOrigin = turf.destination(
        midPoint,
        shipWidth / 3 / 1000,
        bearing + 90
      );
      //Create Ship Feture For Click Event
      //P0
      const p0 = turf.destination(
        startPoint,
        shipWidth / 4 / 1000,
        90 + bearing
      );
      const p3 = turf.destination(
        startPoint,
        shipWidth / 4 / 1000,
        270 + bearing
      );
      const p1 = turf.destination(endPoint, shipWidth / 4 / 1000, 90 + bearing);
      const p2 = turf.destination(
        endPoint,
        shipWidth / 4 / 1000,
        270 + bearing
      );
      feturePoints.push(p0.geometry.coordinates);
      feturePoints.push(p1.geometry.coordinates);
      feturePoints.push(p2.geometry.coordinates);
      feturePoints.push(p3.geometry.coordinates);
      const fetureShip = this.CreateShip3DFetureModel(feturePoints, ship, data);
      this.vechiles.push(fetureShip);

      // Create ship Label
      const label = `${ship.vesselName}\n(${ship.voyageNoIn},${ship.voyageNoOut})\n${ship.loa}m`;
      const props = {
        label: label,
        code: ship.id,
        anchor: "top-center",
        offset: [0.0, -1],
        rotate: 0,
      };
      captionOrigin.properties = props;
      this.object3dlabelsFeatures.push(captionOrigin);
    }
  }


  addnewPoint(coordinates, count) {
    const geometryCoordinates: Array<Array<number>> = [];

    for (let i = 0; i < coordinates.length - 1; i++) {
      geometryCoordinates.push(coordinates[i]);
      const midPoint = turf.midpoint(coordinates[i], coordinates[i + 1]);
      const lat = Number(midPoint.geometry.coordinates[0]);
      const lng = Number(midPoint.geometry.coordinates[1]);
      geometryCoordinates.push([lat, lng]);
    }
    geometryCoordinates.push(coordinates[coordinates.length - 1]);
    if (geometryCoordinates.length >= count) {
      return geometryCoordinates;
    } else {
      const geopoints = this.addnewPoint(geometryCoordinates, count);
      return geopoints;
    }
  }

  _onMapReloaded() {
    
    if (this.berthTimeout === 0) {
        this.clear3DModels();
        this.berthTimeout = setTimeout(() => this.getBerths(), 2000);
      }
  }

  _onMapLoaded() {
    this.createSources();

    this.fetchColorSettings((error, colorScheme) => {
      this._createLayers(colorScheme);

      this.selectSlotsTool = new SelectSlotsTool(
        this.map as mapboxgl.Map,
        this.slotsDict
      );
    });

    this.fetchObjectData();
    if (this.apiUrl) {
      // Api Url read from query string
      if (this.berthTimeout === 0) {
        this.clear3DModels();
        this.berthTimeout = setTimeout(() => this.getBerths(), 2000);
      }
    } else {
      // Api Url read from appSetting.json
      axios
        .get(process.env.VUE_APP_BASE_YARDVIEW + "/json/appSetting.json")
        .then(({ data }) => {
          this.apiUrl = data.serverUrl;
          this.clear3DModels();
          //debugger;
          //  this.getBerths();
          if (this.berthTimeout === 0) {
            this.berthTimeout = setTimeout(() => this.getBerths(), 2000);
          }
        })
        .catch(console.error);
    }
  }
  /**
   * Is called when the map is pitched
   */
  _onPitch() {
    this.toggleOccupationLayers();
  }
  /**
   * Is called when the map is rotated
   */
  _onRotated() {
    this.renderOnlyAreas();
  }
  /**
   * Create the MapBox data sources
   */
  createSources() {
    if (!this.map) return;

    this.map.addSource("areas", {
      type: "geojson",
      data: {
        type: "FeatureCollection",
        features: [],
      },
    });

    this.map.addSource("slots", {
      type: "geojson",
      data: {
        type: "FeatureCollection",
        features: [],
      },
    });

    this.map.addSource("occupation", {
      type: "geojson",
      data: {
        type: "FeatureCollection",
        features: [],
      },
    });

    this.map.addSource("containers", {
      type: "geojson",
      data: {
        type: "FeatureCollection",
        features: [],
      },
    });

    //vechiles
    this.map.addSource("vechiles", {
      type: "geojson",
      data: {
        type: "FeatureCollection",
        features: [],
      },
    });

    this.map.addSource("previewareas", {
      type: "geojson",
      data: {
        type: "FeatureCollection",
        features: [],
      },
    });
    this.map.addSource("previewslots", {
      type: "geojson",
      data: {
        type: "FeatureCollection",
        features: [],
      },
    });

    this.map.addSource("object3dlabels", {
      type: "geojson",
      data: {
        type: "FeatureCollection",
        features: [],
      },
    });
  }

  _createLayers(colorScheme: Array<ColorScheme>) {
    if (this.map == null) {
      return;
    }

    let objectColor;
    let slotColorScheme;
    let areaColorFillStyle: Array<string> = [];
    let areaColorStrokeStyle: Array<string> = [];
    let stackColorStyle: Array<string | number> = [];

    if (colorScheme) {
      objectColor = colorScheme.find((color) => {
        return color.Category === "Object" && color.Subcategory === null;
      });

      //Generate the stack color style
      colorScheme
        .filter((color) => {
          return color.Category === "Object" && color.Subcategory != null;
        })
        .forEach((areaColorScheme) => {
          areaColorFillStyle.push(areaColorScheme.Subcategory);
          areaColorFillStyle.push(areaColorScheme.FillColor);
          areaColorStrokeStyle.push(areaColorScheme.Subcategory);
          areaColorStrokeStyle.push(areaColorScheme.BorderColor);
        });

      slotColorScheme = colorScheme.find((color) => {
        return color.Category === "Layer" && color.Subcategory === "0";
      });

      //Generate the stack color style
      colorScheme
        .filter((color) => {
          return color.Category === "Layer" && Number(color.Subcategory) > 0;
        })
        .forEach((layer) => {
          stackColorStyle.push(Number(layer.Subcategory));
          stackColorStyle.push(layer.FillColor);
        });
    }
    if (!slotColorScheme) {
      slotColorScheme = {
        BorderColor: "#333",
        FillColor: "#ccc",
      };
    }
    if (!objectColor) {
      objectColor = {
        BorderColor: "#555",
        FillColor: "#ddd",
      };
    }
    if (areaColorFillStyle.length === 0) {
      areaColorFillStyle = ["Highlight", "#ffff9e"];
    }
    if (areaColorStrokeStyle.length === 0) {
      areaColorStrokeStyle = ["Highlight", "#ff0"];
    }
    if (stackColorStyle.length === 0) {
      stackColorStyle = [
        1,
        "#fbb03b",
        2,
        "#223b53",
        3,
        "#e55e5e",
        4,
        "#3bb2d0",
      ];
    }

    let paintConfiguration = {
      "fill-color": objectColor.FillColor,
      "fill-outline-color": objectColor.BorderColor,
    };

    paintConfiguration = {
      //@ts-ignore
      "fill-color": [
        "match",
        ["get", "objectType"],
        ...areaColorFillStyle,
        objectColor.FillColor,
      ],
      //@ts-ignore
      "fill-outline-color": [
        "match",
        ["get", "objectType"],
        ...areaColorStrokeStyle,
        objectColor.BorderColor,
      ],
      //@ts-ignore
      "fill-opacity": [
        "case",
        ["boolean", ["!=", ["get", "structure"], "LANE"], false],
        1,
        0,
      ], //if structure LANE then opacity set zero
    };

    this.map.addLayer({
      id: "areas",
      type: "fill",
      source: "areas",
      paint: paintConfiguration,
      filter: ["!=", ["geometry-type"], "LineString"],
    });

    //@ts-ignore
    this.map.addLayer({
      id: "lines",
      type: "line",
      source: "areas",
      //@ts-ignore
      paint: {
        "line-color": [
          "match",
          ["get", "objectType"],
          ...areaColorStrokeStyle,
          objectColor.BorderColor,
        ],
        "line-width": 3,
      } as LinePaint,
      filter: ["==", ["geometry-type"], "LineString"],
    });

    this.map.addLayer({
      id: "line-labels",
      type: "symbol",
      source: "areas",
      filter: ["==", ["geometry-type"], "LineString"],
      layout: {
        "symbol-placement": "line",
        "text-field": [
          "format",
          ["upcase", ["get", "code"]],
          { "font-scale": 0.8 },
        ],
        "text-font": ["Open Sans Semibold", "Arial Unicode MS Bold"],
      },
      paint: {
        "text-color": "#202",
        "text-halo-color": "#fff",
        "text-halo-width": 2,
      },
    });

    this.map.addLayer({
      id: `slots`,
      type: "fill",
      source: "slots",
      paint: {
        "fill-color": slotColorScheme ? slotColorScheme.FillColor : "#CCC",
        "fill-outline-color": slotColorScheme.BorderColor,
      },
      filter: ["==", ["geometry-type"], "Polygon"],
    });

    //@ts-ignore
    this.map.addLayer({
      id: `stacks2D`,
      type: "fill",
      source: "occupation",
      //@ts-ignore
      paint: {
        "fill-color": [
          "match",
          ["get", "maxLayer"],
          ...stackColorStyle,
          slotColorScheme.FillColor,
        ],
        "fill-outline-color": "#999",
      } as FillPaint,
    });

    //@ts-ignore
    this.map.addLayer({
      id: "stacks3D",
      type: "fill-extrusion",
      source: "containers",
      layout: {
        visibility: "none",
      },
      //@ts-ignore
      paint: {
        // Get the fill-extrusion-color from the source 'color' property.
        //@ts-ignore
        "fill-extrusion-color": [
          "match",
          ["get", "layer"],
          ...stackColorStyle,
          slotColorScheme.FillColor,
        ],

        // Get fill-extrusion-height from the source 'height' property.
        "fill-extrusion-height": ["get", "height"],

        // Get fill-extrusion-height from the source 'height' property.
        "fill-extrusion-base": ["get", "base"],
        // Make extrusions slightly opaque for see through indoor walls.
        "fill-extrusion-opacity": 0.9,
      },
    });

    if (this.useRoro3dModel) {
      //@ts-ignore
      this.map.addLayer({
        id: "vechiles3D",
        type: "fill-extrusion",
        source: "vechiles",

        //@ts-ignore
        paint: {
          // Get fill-extrusion-height from the source 'height' property.
          "fill-extrusion-height": ["get", "height"],

          // Get fill-extrusion-height from the source 'height' property.
          "fill-extrusion-base": ["get", "base"],
          // Make extrusions slightly opaque for see through indoor walls.
          "fill-extrusion-opacity": 0.0,
        },
      });
    }
    this.map.addLayer({
      id: "slot-labels",
      type: "symbol",
      source: "slots",
      minzoom: 16,
      layout: {
        "text-field": [
          "format",
          ["upcase", ["get", "label"]],
          { "font-scale": 0.5 },
        ],
        "text-font": ["Open Sans Semibold", "Arial Unicode MS Bold"],
        "text-offset": ["get", "offset"],
        "text-anchor": ["get", "anchor"],
      },
      paint: {
        "text-color": "#202",
        "text-halo-color": "#fff",
        "text-halo-width": 2,
      },
    });

    this.map.addLayer({
      id: "area-labels",
      type: "symbol",
      source: "areas",
      layout: {
        "text-field": ["format", ["upcase", ["get", "label"]]],
        "text-font": ["Open Sans Semibold", "Arial Unicode MS Bold"],
        "text-offset": ["get", "offset"],
        "text-anchor": ["get", "anchor"],
        "text-rotate": ["get", "rotate"],
        "text-rotation-alignment": "map",
        "text-size": {
          stops: [
            [15, 6],
            [16, 12],
            [20, 17],
          ],
        },
      },
      paint: {
        "text-color": "#202",
        "text-halo-color": "#fff",
        "text-halo-width": 2,
      },
    });

    this.map.addLayer({
      id: "previewareas",
      type: "fill",
      source: "previewareas",
      paint: {
        "fill-color": "#fff9a8",
        "fill-outline-color": "#b5af55",
      },
      filter: ["!=", "$type", "LineString"],
    });

    this.map.addLayer({
      id: "previewlines",
      type: "line",
      source: "previewareas",
      layout: {
        "line-join": "bevel",
        "line-cap": "round",
      },
      paint: {
        "line-color": "#fff9a8",
        "line-blur": 2,
        "line-width": 5,
      },
      filter: ["==", "$type", "LineString"],
    });

    this.map.addLayer({
      id: "previewslots",
      type: "fill",
      source: "previewslots",
      paint: {
        "fill-color": "#fff240",
        "fill-outline-color": "#807b38",
      },
    });

    this.map.addLayer({
      id: "preview-slot-labels",
      type: "symbol",
      source: "previewslots",
      minzoom: 16,
      layout: {
        "text-field": [
          "format",
          ["upcase", ["get", "label"]],
          { "font-scale": 0.5 },
        ],
        "text-font": ["Open Sans Semibold", "Arial Unicode MS Bold"],
        "text-offset": ["get", "offset"],
        "text-anchor": ["get", "anchor"],
      },
      paint: {
        "text-color": "#202",
        "text-halo-color": "#fff",
        "text-halo-width": 2,
      },
    });

    this.map.addLayer({
      id: "object3d-labels",
      type: "symbol",
      maxzoom: 15,
      source: "object3dlabels",
      layout: {
        // "visibility": "none",
        "text-field": ["get", "label"],
        "text-font": ["Open Sans Semibold", "Arial Unicode MS Bold"],

        "text-offset": ["get", "offset"],
        "text-anchor": ["get", "anchor"],
        "text-rotation-alignment": "auto",
        "text-size": {
          stops: [
            [15, 6],
            [16, 12],
            [20, 17],
          ],
        },
      },
      paint: {
        "text-color": "#202",
        "text-halo-color": "#fff",
        "text-halo-width": 2,
      },
    });
  }

  renderOnlyAreas() {
    if (this.map == null) {
      return;
    }

    //Clear the slots array
    this.areas = [];

    this.areaObjects.forEach((area) => {
      this.renderObject(area);
    });

    //Set area data
    const areaSource: GeoJSONSource = this.map.getSource(
      "areas"
    ) as GeoJSONSource;
    areaSource.setData(
      turf.featureCollection(
        this.areas
      ) as GeoJSON.FeatureCollection<GeoJSON.Geometry>
    );
  }

  renderYard() {
    if (this.map == null) {
      return;
    }

    //Clear the slots array
    this.slots = [];
    this.areas = [];
    // this.bolardslots = [];

    this.areaObjects.forEach((area) => {
      if (area.Code !== this.previewObject) {
        this.renderObject(area);
      }
    });

    // const bolardslotsSource: GeoJSONSource = this.map.getSource(
    //   "object3dlabels"
    // ) as GeoJSONSource;
    // bolardslotsSource.setData(
    //   turf.featureCollection(
    //     this.object3dlabelsFeatures
    //   ) as GeoJSON.FeatureCollection<GeoJSON.Geometry>
    // );

    //Set area data
    const areaSource: GeoJSONSource = this.map.getSource(
      "areas"
    ) as GeoJSONSource;

    areaSource.setData(
      turf.featureCollection(
        this.areas
      ) as GeoJSON.FeatureCollection<GeoJSON.Geometry>
    );

    //Set slot data
    const slotSource: GeoJSONSource = this.map.getSource(
      "slots"
    ) as GeoJSONSource;

    slotSource.setData(
      turf.featureCollection(
        this.slots
      ) as GeoJSON.FeatureCollection<GeoJSON.Geometry>
    );

    if (!this.previewMode) {
      //Set occupation data
      const occupationSource: GeoJSONSource = this.map.getSource(
        "occupation"
      ) as GeoJSONSource;
      occupationSource.setData(
        turf.featureCollection(
          this.stacks
        ) as GeoJSON.FeatureCollection<GeoJSON.Geometry>
      );

      // //Set container stacks data
      const containersSource: GeoJSONSource = this.map.getSource(
        "containers"
      ) as GeoJSONSource;
      containersSource.setData(
        turf.featureCollection(
          this.containers
        ) as GeoJSON.FeatureCollection<GeoJSON.Geometry>
      );

      //Set vechiles stacks data
      const rorobox3dSource: GeoJSONSource = this.map.getSource(
        "vechiles"
      ) as GeoJSONSource;
      rorobox3dSource.setData(
        turf.featureCollection(
          this.vechiles
        ) as GeoJSON.FeatureCollection<GeoJSON.Geometry>
      );
    }
  }

  getLabelRotation(rotation) {
    let labelRotation = rotation;
    if (this.map != null) {
      // const mapRotation = this.map.getBearing();

      let bearing = this.map.getBearing();
      if (bearing <= 0) {
        bearing *= -1;
      } else {
        bearing = 360 - bearing;
      }

      let sumRotations = bearing + rotation;
      if (sumRotations > 360) {
        sumRotations -= 360;
      }

      if (sumRotations > 90 && sumRotations < 270) {
        labelRotation = rotation + 180;
        if (labelRotation >= 360) {
          labelRotation -= 360;
        }
      }
    }
    return labelRotation;
  }

  renderObject(object: YardViewObject) {
    const feat = this.generateFeature(object);
    object.Feature = feat;

    if (!object.Feature) {
      return;
    }

    this.areas.push(object.Feature);
    if (object.Structure !== "NONE") {
      this.slots.push(...this.renderSlots(object));
    }

    if (object.GeoShape === "POLYGON" || object.GeoShape === "RECTANGLE") {
      const areaRect: turf.Polygon = object.Feature.geometry as turf.Polygon;

      if (object.AngleX == null) object.AngleX = 0;
      if (object.AngleY == null) object.AngleY = 0;

      let anchorCoord = 1;
      const angleX = 90 + object.AngleX;
      const angleY = object.AngleY;

      if (
        (object.Structure == "BAY" && angleX + angleY < 270) ||
        (object.Structure == "ROW" && angleX + angleY < 270)
      ) {
        anchorCoord = 2;
      }

      let rotation = 0;
      if (object.Structure == "BAY" && angleX + angleY >= 270) {
        rotation = object.AngleX - 90;
      } else if (object.Structure == "BAY") {
        rotation = object.AngleX;
      } else if (angleX + angleY < 270) {
        rotation = object.AngleX;
      }

      const labelRotation = this.getLabelRotation(rotation);
      // 

      this.areas.push(
        //Anchor point in the bottom right corner
        turf.point(areaRect.coordinates[0][2], {
          label: object.Code,
          code: object.Code,
          anchor: labelRotation != rotation ? "bottom-left" : "top-right",

          offset: labelRotation != rotation ? [0.0, -0.2] : [0.0, 0.2],
          rotate: labelRotation,
        })
      );
    } else if (
      object.GeoShape === "CIRCLE" &&
      object.GeoPointLongitude &&
      object.GeoPointLatitude
    ) {
      //Anchor point in the center of the circle
      this.areas.push(
        turf.point([object.GeoPointLongitude, object.GeoPointLatitude], {
          label: object.Code,
          code: object.Code,
          anchor: "center",
        })
      );
    }
  }

  generateFeature(object: YardViewObject) {
    let feat;
    try {
      if (object.GeoShape === "CIRCLE") {
        if (object.GeoPointLongitude && object.GeoPointLatitude) {
          const center = turf.point([
            object.GeoPointLongitude,
            object.GeoPointLatitude,
          ]);
          feat = this.generateCircleAreaFeature(
            center,
            object.GeoRadius,
            object.Type,
            object.Code,
            object.Structure
          );
        }
      } else if (object.GeoShape === "POLYLINE") {
        feat = this.generateLineFeature(
          object.GeoShape,
          object.GeoShapePoints,
          object.Type,
          object.Code,
          object.Structure
        );
      } else {
        feat = this.generateAreaFeature(
          object.GeoShape,
          object.GeoShapePoints,
          object.Type,
          object.Code,
          object.Structure
        );
      }
    } catch (err) {
      console.error(
        "Error creating feature " + object.GeoShape + ": " + object.Code
      );
      return null;
    }

    return feat;
  }

  /**
   * Renders the slots of a given area
   */
  renderSlots(areaObj: YardViewObject) {
    const slots: Array<turf.Feature> = [];

    if (areaObj.Structure === "LANE") {
      return this.renderLanesSlots(areaObj);
    }

    // Abort when no feature is present
    if (areaObj.Feature == null || areaObj.Feature.geometry == null) {
      return slots;
    }
    const areaRect: turf.Polygon = areaObj.Feature.geometry as turf.Polygon;
    const referencePoint = areaRect.coordinates[0][0];

    const iNbrOfBays = Number(areaObj.NumberOfBays);
    const iNbrOfRows = Number(areaObj.NumberOfRows);
    const dblBayInterspace = Number(areaObj.BayInterspace);
    const dblRowInterspace = Number(areaObj.RowInterspace);
    const dblPositionWidth = Number(areaObj.PositionWidth);
    const dblPositionLength = Number(areaObj.PositionLength);

    if (areaObj.BayStepSize == null) areaObj.BayStepSize = 0;

    // We need to calculate the positions of all ground slots..
    // We support multiple scenarios..
    // The first and most important switch is TEUGroundSlots: when true all positions will be based o nstandard 1 TEU ground slot dimensions.
    // When false custom position dimensions can be entered, but no overlapping positions will be generated, only the standard positions will exist.
    //
    // When using standard TEU ground slots, we support standard 1 TEU, 2 TEU and 3 TEU positions.
    // However there is only one case in which we can render non 20ft slots as ground slots.
    //   - If 1 TEU ground slots are disabled and 2 OR 3 TEU slots are enabled and no overlapping positions are generated.
    //   - In all other cases the 1 TEU ground slots are rendered.
    let iSlotMultiplier = 1;
    if (areaObj.TEUGroundSlots && !areaObj.OneTEUPositions) {
      if (
        areaObj.TwoTEUPositions &&
        !areaObj.ThreeTEUPositions &&
        areaObj.TwoTEUPositionStart !== "B"
      )
        iSlotMultiplier = 2;
      else if (
        !areaObj.TwoTEUPositions &&
        areaObj.ThreeTEUPositions &&
        areaObj.ThreeTEUPositionStart !== "A"
      )
        iSlotMultiplier = 3;
    }

    const angleX = 90 + Number(areaObj.AngleX);
    const angleY = Number(areaObj.AngleY);

    let iBayStartNumber = Number(areaObj.BayStartNumber);
    const iRowStartNumber = Number(areaObj.RowStartNumber);

    const iBayMaxNumber =
      iBayStartNumber + iNbrOfBays * areaObj.BayStepSize - 1;
    const iRowMaxNumber = iRowStartNumber + iNbrOfRows - 1;

    // If we stard with position slots only on the second or third bay, update the bay in which to start..
    // Note that in practice, this doesn't make much sense to do this.. at least not in an area without 1 TEU ground slots!
    let objFirstBayCoord = turf.point(referencePoint);
    if (iSlotMultiplier == 2) {
      if (areaObj.TwoTEUPositionStart == "S") {
        iBayStartNumber += areaObj.BayStepSize;
        objFirstBayCoord = turf.destination(
          referencePoint,
          (dblPositionLength + dblBayInterspace) / 1000,
          angleX
        );
      }
    } else if (iSlotMultiplier == 3) {
      if (areaObj.ThreeTEUPositionStart == "S") {
        iBayStartNumber += areaObj.BayStepSize;
        objFirstBayCoord = turf.destination(
          referencePoint,
          (dblPositionLength + dblBayInterspace) / 1000,
          angleX
        );
      } else if (areaObj.ThreeTEUPositionStart == "T") {
        iBayStartNumber += 2 * areaObj.BayStepSize;
        objFirstBayCoord = turf.destination(
          referencePoint,
          (dblPositionLength * 2 + dblBayInterspace * 2) / 1000,
          angleX
        );
      }
    }

    const iBayStepSize = areaObj.BayStepSize * iSlotMultiplier;
    for (
      let iBay = iBayStartNumber, i = 0;
      iBay <= iBayMaxNumber;
      iBay += iBayStepSize, i++
    ) {
      // When the standard ground slots are not shown, but 2 or 3 TEU slots are shown instead, verify that all the
      // underlying bays of these multi bay slots exist before rendering it..
      if (iSlotMultiplier > 1 && iBay + areaObj.BayStepSize > iBayMaxNumber)
        break;

      let objCoordBay;
      if (i == 0) {
        objCoordBay = objFirstBayCoord;
      } else {
        objCoordBay = turf.destination(
          objFirstBayCoord,
          (dblPositionLength * iSlotMultiplier * i +
            dblBayInterspace * iSlotMultiplier * i) /
            1000,
          angleX
        );
      }

      for (
        let iRow = iRowStartNumber, j = 0;
        iRow <= iRowMaxNumber;
        iRow++, j++
      ) {
        let objGroundPos;
        if (j == 0) {
          objGroundPos = objCoordBay;
        } else {
          objGroundPos = turf.destination(
            objCoordBay,
            (dblPositionWidth * j + dblRowInterspace * j) / 1000,
            angleX + angleY
          );
        }

        const slotParameters = new SlotParameters(
          objGroundPos,
          angleX,
          angleY,
          dblPositionLength,
          dblPositionWidth,
          iSlotMultiplier,
          dblBayInterspace,
          iRow,
          iBay,
          areaObj.Code
        );

        if (j == 0) {
          slots.push(
            this._createBayLabel(slotParameters, iBay, areaObj.AngleX)
          );
        }

        if (iBay == iBayStartNumber) {
          slots.push(
            this._createRowLabel(slotParameters, iRow, areaObj.AngleX)
          );
        }

        //Create the slot and push it to the array of slots
        const feature = this.createGroundSlotFeature(
          slotParameters,
          iRow,
          iBay
        );
        slots.push(feature);

        this.slotsDict.insert(
          areaObj.Code,
          iRow,
          iBay,
          //@ts-ignore
          feature
        );

        if (!this.previewMode && this.occupationObjectList != null) {
          //Create the occupation feature and push it to the array of stacks
          const stack = this.occupationObjectList.getOccupation(
            areaObj.Code,
            iBay, //i + 1,
            iRow //j + 1
          );
          if (
            stack != null &&
            (stack.Bay2 == null ||
              (stack.Bay2 != null && stack.Bay == i + 1) ||
              (stack.Bay3 != null && stack.Bay == i + 2))
          ) {
            const firstLastPos = this._checkAllowContainerOnFirstOrLastBayPos(
              stack,
              areaObj
            );

            //@ts-ignore
            stack.slotParameters = slotParameters;
            //@ts-ignore
            stack.isFirstOrLastPos = firstLastPos;

            const properties = {
              maxLayer: stack.MaxLayer,
            };

            this.stacks.push(
              this._createStackFeature(
                slotParameters,
                stack,
                firstLastPos,
                properties
              )
            );
          }
        }
      }
    }
    return slots;
  }
  renderLanesSlots(areaObj: YardViewObject) {
    const slots: Array<turf.Feature> = [];
    // Abort when no feature is present
    if (areaObj.Feature == null || areaObj.Feature.geometry == null) {
      return slots;
    }
    const areaRect: turf.Polygon = areaObj.Feature.geometry as turf.Polygon;
    const referencePoint = areaRect.coordinates[0][0];

    const mLaneInterspace = Number(areaObj.LaneInterspace);
    if (!areaObj.LaneStartNumber) {
      areaObj.LaneStartNumber = 1;
    }

    const mLaneStartNumber = Number(areaObj.LaneStartNumber);
    const mlaneWidth = Number(areaObj.LaneWidth);

    const angleX = 90 + Number(areaObj.AngleX);
    const angleY = Number(areaObj.AngleY);
    const mLaneCount = Number(areaObj.Lanes.length);
    if (!areaObj.Lanes) {
      areaObj.Lanes = new Array<Lane>();
    }
    const listofLanes: Lane[] = areaObj.Lanes;

    for (let i = 0; i < mLaneCount; i++) {
      const iLane = mLaneStartNumber + i;
      const lane = listofLanes.find((l) => l.Number === iLane);
      if (!lane) continue;

      const objCoordLane = turf.destination(
        referencePoint,
        ((mlaneWidth + mLaneInterspace) * i) / 1000,
        angleX
      );

      const slotParameters = new SlotParameters(
        objCoordLane,
        angleX,
        angleY,
        lane.LaneLength,
        mlaneWidth,
        0,
        mLaneInterspace,
        iLane,
        0,
        areaObj.Code
      );

      slots.push(this._createLaneRowLabel(slotParameters, iLane));

      if (lane.StartOffset > 0) {
        const startOffsetPoint = turf.destination(
          objCoordLane,
          lane.StartOffset / 1000,
          angleX + angleY
        );
        //new start point
        slotParameters.origin = startOffsetPoint;
      }

      const feature = this.createGroundLaneSlotFeature(slotParameters, lane);

      slots.push(feature);

      this.slotsDict.insert(
        areaObj.Code,
        lane.Number,
        0,
        //@ts-ignore
        feature as MapboxGeoJSONFeature
      );
    }

    return slots;
  }
  /**
   * Generate a label point feature for the Lanes
   */
  _createLaneRowLabel(
    slotParameters: SlotParameters,
    rowNumber: number
  ): turf.Feature {
    const objCoordP2: turf.Feature = turf.destination(
      slotParameters.origin,
      slotParameters.width / 1000,
      slotParameters.angleX
    );

    let feature = turf.midpoint(
      slotParameters.origin.geometry.coordinates,
      //@ts-ignore
      objCoordP2.geometry.coordinates
    );

    if (slotParameters.angleY === 90) {
      feature = turf.destination(feature, 1 / 1000, 0);
    }
    if (slotParameters.angleY === 270) {
      feature = turf.destination(feature, 1 / 1000, slotParameters.angleX + 90);
    }

    feature.properties = {
      label: `${rowNumber}`,
      code: slotParameters.areaCode,
    };

    return feature;
  }

  createGroundLaneSlotFeature(slotParameters: SlotParameters, lane: Lane) {
    // C=P1     P2
    //  ________
    // |        |
    // |________|
    //
    // P4       P3
    // AngleX contains the bearing from C to P2
    // AngleY contains the bearing from C to P4 which is identical to the bearing of P2 to P3.

    const objCoordP1: turf.Feature = turf.destination(
      slotParameters.origin,
      slotParameters.width / 1000,
      slotParameters.angleX
    );

    const objCoordP2: turf.Feature = turf.destination(
      //@ts-ignore
      objCoordP1,
      (slotParameters.length - lane.StartOffset) / 1000,
      slotParameters.angleX + slotParameters.angleY
    );
    const objCoordP3: turf.Feature = turf.destination(
      slotParameters.origin,
      (slotParameters.length - lane.StartOffset) / 1000,
      slotParameters.angleX + slotParameters.angleY
    );

    return turf.polygon(
      [
        [
          slotParameters.origin.geometry.coordinates,
          //@ts-ignore
          objCoordP1.geometry.coordinates,
          //@ts-ignore
          objCoordP2.geometry.coordinates,
          //@ts-ignore
          objCoordP3.geometry.coordinates,
          slotParameters.origin.geometry.coordinates,
        ],
      ],
      {
        code: slotParameters.areaCode,
        row: lane.Number,

        fid: `${slotParameters.areaCode}_${lane.Number}`,
      }
    );
  }
  _checkAllowContainerOnFirstOrLastBayPos(stack, areaObj) {
    const result = {
      isFirstPos: false,
      isLastPos: false,
    };

    const lastOccupiedBay = stack.Bay2 != null ? stack.Bay2 : stack.Bay;
    result.isFirstPos = stack.Bay == areaObj.BayStartNumber;
    result.isLastPos =
      lastOccupiedBay == areaObj.BayStartNumber + areaObj.NumberOfBays - 1;

    return result;
  }

  /**
   * Generate a label point feature for the rows
   */
  _createRowLabel(
    slotParameters: SlotParameters,
    rowNumber: number,
    angelx
  ): turf.Feature {
    const objCoordP2: turf.Feature = turf.destination(
      slotParameters.origin,
      slotParameters.width / 1000,
      slotParameters.angleX + slotParameters.angleY
    );

    let feature = turf.midpoint(
      slotParameters.origin.geometry.coordinates,
      //@ts-ignore
      objCoordP2.geometry.coordinates
    );
    let space = 3;
    if (slotParameters.angleY === 270) {
      space = -3;
    }
    feature = turf.destination(
      feature,
      space / 1000,
      slotParameters.angleX + slotParameters.angleY + 90
    );

    feature.properties = {
      label: `${rowNumber}`,
      code: slotParameters.areaCode,
    };

    return feature;
  }

  /**
   * Generate a label point feature for the bays
   */
  _createBayLabel(slotParameters, bayNumber, angelx) {
    const objCoordP1 = turf.destination(
      slotParameters.origin,
      (slotParameters.length * slotParameters.multiplier +
        slotParameters.interspace * (slotParameters.multiplier - 1)) /
        1000,
      slotParameters.angleX
    );

    let feature = turf.midpoint(
      slotParameters.origin.geometry.coordinates,
      //@ts-ignore
      objCoordP1.geometry.coordinates
    );
    let space = 3;
    if (slotParameters.angleY === 270) {
      space = -3;
    }
    feature = turf.destination(
      feature,
      space / 1000,
      slotParameters.angleX - 90
    );

    feature.properties = {
      label: `${bayNumber}`,
      code: slotParameters.code,
    };

    return feature;
  }

  /**
   * Generate a groundslot feature
   */
  createGroundSlotFeature(slotParameters, row, bay) {
    // C=P1     P2
    //  ________
    // |        |
    // |________|
    //
    // P4       P3
    // AngleX contains the bearing from C to P2
    // AngleY contains the bearing from C to P4 which is identical to the bearing of P2 to P3.

    const objCoordP1: turf.Feature = turf.destination(
      slotParameters.origin,
      (slotParameters.length * slotParameters.multiplier +
        slotParameters.interspace * (slotParameters.multiplier - 1)) /
        1000,
      slotParameters.angleX
    );
    const objCoordP2: turf.Feature = turf.destination(
      //@ts-ignore
      objCoordP1,
      slotParameters.width / 1000,
      slotParameters.angleX + slotParameters.angleY
    );
    const objCoordP3: turf.Feature = turf.destination(
      slotParameters.origin,
      slotParameters.width / 1000,
      slotParameters.angleX + slotParameters.angleY
    );

    return turf.polygon(
      [
        [
          slotParameters.origin.geometry.coordinates,
          //@ts-ignore
          objCoordP1.geometry.coordinates,
          //@ts-ignore
          objCoordP2.geometry.coordinates,
          //@ts-ignore
          objCoordP3.geometry.coordinates,
          slotParameters.origin.geometry.coordinates,
        ],
      ],
      {
        code: slotParameters.areaCode,
        row: row,
        bay: bay,
        fid: `${slotParameters.areaCode}_${row}_${bay}`,
      }
    );
  }

  /**
   * Generate a container stack feature
   */
  _createStackFeature(slotParameters, stack, firstLastPos, properties) {
    let groundPosition = slotParameters.origin;

    //Convert feet to metric
    const containerLengthMetric: number = stack.ContainerLength / 3.2808399; //TODO round!
    let occupiedLength = containerLengthMetric;
    let assignedSlotLength = slotParameters.length;

    if (stack.Bay2 != null) {
      assignedSlotLength += slotParameters.length + slotParameters.interspace;
    }
    if (stack.Bay3 != null) {
      assignedSlotLength += slotParameters.length + slotParameters.interspace;
    }

    if (containerLengthMetric != assignedSlotLength) {
      // Two scenarios:
      //   1. The container stack does not fill the full length of the position, in which case a smaller slot must be rendered.
      //      It is rendered in the center of the position.
      //   2. The container stack is longer than the position. In this scensio we have 2 further classifications.
      //        a. The stack is in the first or last bay and the container is allowed on smaller ground slots in the first or last bay.
      //           In this case the stack will extend outside the normal confines of the area.
      //        b. The stack is not in the first or last bay or the container is not allowed on smaller ground slots in the first or last bay.
      //           This scenario is only possible if bay interspacing is sufficiently large to allow for for example 45ft containers to be placed on 40ft ground slots.
      //           In this scenario we reduce the bay interspacing in both direcrtions by half. We can't take up the full interspace because the next 40ft position might also contain a 45ft stack.
      //           Note that even though the first and last bay technically do not have a start/end interspace, we still add the offset as we don't know exactly how the slot size is exceeded.

      if (containerLengthMetric < assignedSlotLength) {
        // Case 1
        const offset = (assignedSlotLength - containerLengthMetric) / 2;

        // Move the origin so we draw the container stack in the center of the position..
        groundPosition = turf.destination(
          slotParameters.origin,
          offset / 1000,
          slotParameters.angleX
        );
      } else if (firstLastPos.isFirstPos || firstLastPos.isLastPos) {
        // Case 2a
        // Note that it's possible the area only has a single position of this length in which case it can extend in both directions..
        // For this we need to check bIsFirstPos && bIsLastPos..
        if (firstLastPos.isFirstPos && firstLastPos.isLastPos) {
          // Move the origin so we draw the container stack in the center of the position..
          const offset = (containerLengthMetric - assignedSlotLength) / 2;
          groundPosition = turf.destination(
            slotParameters.origin,
            offset / 1000,
            slotParameters.angleX
          );
        } else if (firstLastPos.isFirstPos) {
          // Move the origin so we draw the container stack in the center of the position..
          const offset = containerLengthMetric - assignedSlotLength;
          groundPosition = turf.destination(
            slotParameters.origin,
            offset / 1000,
            slotParameters.angleX + 180
          );
        }
      } else {
        // Case 2b
        let offset = (containerLengthMetric - assignedSlotLength) / 2;
        // Max the offset at half the interspace to prevent overlapping in the renderer...
        offset = Math.min(offset, slotParameters.interspace / 2);

        groundPosition = turf.destination(
          slotParameters.origin,
          offset / 1000,
          slotParameters.angleX + 180
        );

        // Render the length of the position, with double the offset. This can result in the full stack length or max the position + bay interspace.
        occupiedLength = assignedSlotLength + 2 * offset;
      }
    }

    // C=P1     P2
    //  ________
    // |        |
    // |________|
    //
    // P4       P3
    // AngleX contains the bearing from C to P2
    // AngleY contains the bearing from C to P4 which is identical to the bearing of P2 to P3.

    const objCoordP1 = turf.destination(
      groundPosition,
      (occupiedLength +
        slotParameters.interspace * (slotParameters.multiplier - 1)) /
        1000,
      slotParameters.angleX
    );
    const objCoordP2 = turf.destination(
      objCoordP1,
      slotParameters.width / 1000,
      slotParameters.angleX + slotParameters.angleY
    );
    const objCoordP3 = turf.destination(
      groundPosition,
      slotParameters.width / 1000,
      slotParameters.angleX + slotParameters.angleY
    );

    return turf.polygon(
      [
        [
          groundPosition.geometry.coordinates,
          //@ts-ignore
          objCoordP1.geometry.coordinates,
          //@ts-ignore
          objCoordP2.geometry.coordinates,
          //@ts-ignore
          objCoordP3.geometry.coordinates,
          groundPosition.geometry.coordinates,
        ],
      ],
      {
        code: slotParameters.areaCode,
        row: slotParameters.row,
        bay: slotParameters.bay,
        ...properties,
      }
    );
  }

  createContainerFeatures(detailedOccupation) {
    const occupationObjectList = this.occupationObjectList;
    if (occupationObjectList == null) {
      return;
    }

    detailedOccupation.forEach((occupation) => {
      let base = 0;
      const stack = occupationObjectList.getOccupation(
        occupation.Area,
        occupation.Bay,
        occupation.Row
      );
      if (stack != null && stack.slotParameters != null) {
        occupation.Containers.forEach((container) => {
          const containerParameters = {
            ContainerLength: container.Length * 3.2808399, //Convert the length to feet because the stack creation function expects this
            ContainerWidth: container.width,
            //@ts-ignore
            Bay: stack.Bay,
            //@ts-ignore
            Bay2: stack.Bay2,
            //@ts-ignore
            Bay3: stack.Bay3,
          };

          const properties = {
            base: base,
            height: base + container.Height,
            layer: container.Layer,
            id: container.Id,
            line: container.Line,
          };

          this.containers.push(
            this._createStackFeature(
              //@ts-ignore
              stack.slotParameters,
              containerParameters,
              //@ts-ignore
              stack.isFirstOrLastPos,
              properties
            )
          );
          base += container.Height + 0.1; // Add 10cm between the containers
        });
      }
    });
  }

  fetchObjectData() {
   // let areaDataUrl = "json/bandarArea.json";
    let areaDataUrl =  process.env.VUE_APP_BASE_YARDVIEW + "/json/GetObjectsByArguments1.json";
    // if (this.terminalId === 7) {
      //areaDataUrl = "json/GetObjectsByArguments1.json";
   // }

    axios.get(areaDataUrl).then((response) => {
      this.areaObjects = response.data.Result;

      this.fetchRoRoLanes();
      // this.fetchOccupation();
      this.renderYard();
    });
  }


  // fetchObjectData() {
  //   debugger;
  //   this.tcServices.YardViewServices.YVObjectServices.GetObjectsByArguments1(
  //     this.sessionId,
  //     ["CONTAREA", "OPENAREA", "WAREHOUSE" ,"BUILDING", "TANK", "TRACK", "GATE", "RORO"],
  //     [],
  //     [],
  //     "",
  //     false
  //   ).then((response) => {
  

  //     this.areaObjects = response.data.Result;
  //     this.fetchRoRoLanes();
  //     this.fetchOccupation();
  //     this.renderYard();
  //   });
  // }

  generateAreaFeature(
    geoShape,
    geoShapePoints,
    objectType,
    objectCode,
    structure
  ) {
    const geometryCoordinates: Array<Array<number>> = [];

    if (geoShapePoints.geometry) {
      if (geoShapePoints.geometry.coordinates) {
        geoShapePoints.geometry.coordinates[0].forEach((item) => {
          geometryCoordinates.push([item[0], item[1]]);
        });
      }
    } else {
      const coordinates = geoShapePoints.split(",");
      coordinates.forEach((coordinate) => {
        const latlon = coordinate.split("/");
        geometryCoordinates.push([Number(latlon[1]), Number(latlon[0])]);
      });
      //Polygon requires first and last position to be the same
      geometryCoordinates.push(geometryCoordinates[0]);
    }

    return turf.polygon([geometryCoordinates], {
      code: objectCode,
      fid: objectCode,
      objectType: objectType,
      structure: structure,
    });
  }
  generateAreaCorrectPolygon(
    point0,
    maxLength,
    maxWidth,
    angelX,
    directionAngle
  ) {
    const point1 = turf.destination(point0, maxLength / 1000, angelX).geometry
      .coordinates;
    const point2 = turf.destination(
      point1,
      maxWidth / 1000,
      angelX + directionAngle
    ).geometry.coordinates;
    const point3 = turf.destination(
      point0,
      maxWidth / 1000,
      angelX + directionAngle
    ).geometry.coordinates;
    return [point0, point1, point2, point3, point0];
  }

  generateLineFeature(
    geoShape,
    geoShapePoints,
    objectType,
    objectCode,
    structure
  ) {
    const geometryCoordinates: Array<Array<number>> = [];
    const coordinates = geoShapePoints.split(",");
    coordinates.forEach((coordinate) => {
      const latlon = coordinate.split("/");
      geometryCoordinates.push([Number(latlon[1]), Number(latlon[0])]);
    });

    return turf.lineString(geometryCoordinates, {
      code: objectCode,
      objectType: objectType,
      structure: structure,
    });
  }

  generateCircleAreaFeature(
    center,
    radius,
    objectType,
    objectCode,
    structure
  ): turf.Feature {
    const resolution = radius > 30 ? radius : 30;
    const options = {
      steps: resolution,
      units: "meters",
      properties: {
        code: objectCode,
        objectType: objectType,
        structure: structure,
      },
    };
    //@ts-ignore
    return turf.circle(center, radius, options);
  }

  async fetchRenderSettings(callback) {
    await axios
      .get("json/GetRenderSetting.json")
      .then((response) => {
        callback(null, response.data.Result);
      })
      .catch((error) => {
        console.error(error.message);
      });
  }

  async fetchColorSettings(callback) {
    await axios
      .get( process.env.VUE_APP_BASE_YARDVIEW + "/json/GetColorSchemes.json")
      .then((response) => {
        const colorScheme = response.data.Result as Array<ColorScheme>;

        callback(null, colorScheme);
      })
      .catch((error) => {
        console.error(error.message);
      });
  }

  async fetchRoRoLanes() {
    // 

    //GetROROLanesOccupation
    let urldata = process.env.VUE_APP_BASE_YARDVIEW + "/json/test/20items.json";
    if (this.terminalId === 7) {
      urldata = "json/roroDar.json";
    }

    await axios.get(urldata).then((response) => {
      this.fillOccupationRoroLaneList(response.data.Result);
      this.createRoroFetures();
      this.renderYard();
    });
  }

  fillOccupationRoroLaneList(array: Array<LaneOccupation>) {
    this.OccupationRoroLaneList = new Array<LaneOccupation>();
    if (!array || array.length == 0) {
      return;
    }
    for (const item of array) {
      this.OccupationRoroLaneList.push(item as LaneOccupation);
    }
  }

  createRoroFetures() {
    this.vechiles = [];
    this.OccupationRoroLaneList.forEach((item) =>
      this.createRoroLaneFetures(item)
    );
  }

  createRoroLaneFetures(laneOccupation: LaneOccupation): void {
    const Vehicleslist = laneOccupation.Vehicles;

    const VehiclesCount = laneOccupation.Vehicles.length;
    const slotLaneFeture = this.slotsDict.getRowFeatures(
      laneOccupation.Area,
      laneOccupation.LaneNumber
    )[0];
    if (slotLaneFeture === undefined) {
      return;
    }

    for (let i = 1; i <= VehiclesCount; i++) {
      const vehicles = Vehicleslist.find((v) => v.Sequence == i);
      if (vehicles === null) {
        continue;
      }

      const area = this.areaObjects.find(
        (r) => r.Code === laneOccupation.Area
      ) as YardViewObject;

      const slotRect: turf.Polygon = slotLaneFeture.geometry as turf.Polygon;
      const referencePoint = slotRect.coordinates[0][0];
      const angleX = Number(area.AngleX);
      const angleY = Number(area.AngleY);
      // const vehicleInterspace = Number(area.VehicleInterspace);
      const laneWidth = Number(area.LaneWidth);
      // const laneLenth = Number(area.LaneLength);
      if (!vehicles.Width) {
        vehicles.Width = Number(laneWidth * 0.8);
      }
      const vehiclesWidth = Number(vehicles.Width);
      if (!vehicles.Length) {
        vehicles.Length = 4;
      }
      if (!vehicles.Offset) {
        vehicles.Offset = 0.4;
      }
      const vehiclesLength = Number(vehicles.Length);
      const vehiclesoffset = Number(vehicles.Offset);

      let objCoordLane = turf.destination(
        referencePoint,
        (0.5 * (laneWidth - vehiclesWidth)) / 1000,
        angleY + (angleY === 270 ? 180 : 0)
      );

      if (vehiclesoffset > 0) {
        objCoordLane = turf.destination(
          objCoordLane,
          vehiclesoffset / 1000,
          angleX + (angleY === 270 ? 0 : 180)
        );
      }
      const model3dVersion = this.renderQuality === "High" ? "v4" : "v3";
      // 

      const vParameters = {
        origin: objCoordLane,
        angleX: angleX + 90,
        angleY: angleY,
        length: vehiclesLength,
        width: vehiclesWidth,
        area: laneOccupation.Area,
        laneNumber: laneOccupation.LaneNumber,
        offset: vehiclesoffset,
        sequence: vehicles.Sequence,
        uid: vehicles.Uid,
        vin: vehicles.VIN,
        type: vehicles.Type,
        laneWidth: laneWidth,
        model3dVersion: model3dVersion,
      };
      /// E.g. CAR (generic), BIKE, SEDAN, HATCHBACK, STATIONWAGON, MINIVAN, VAN, PICKUP, SUV, TRUCK, BUS
      //HATCHBACK,  MINIVAN, SUV, TRUCK,MPV
      // need for click event
      const feture = this.createRoroVechileFeature(vParameters);

      if (this.useRoro3dModel) {
        const Vechile = this.createVechile3DModelLayer(feture, vParameters);
        // if define 3d model added else use container layer
        if (Vechile != null) {
          this.map.addLayer(Vechile as mapboxgl.AnyLayer);
          this.roro3DModelList.push(Vechile.id);
          this.vechiles.push(feture);
        } else {
          this.stacks.push(feture);
          this.containers.push(feture);
        }
      } else {
        this.stacks.push(feture);
        this.containers.push(feture);
      }
    }
  }

  createVechile3DModelLayer(
    feture,
    vParameters
  ):
    | VanLayer
    | SedanLayer
    | BikeLayer
    | PickupLayer
    | StationwagonLayer
    | BusLayer
    | HachbackLayer
    | SuvLayer
    | TruckLayer
    | null {
    switch (vParameters.type) {
      case "HATCHBACK":
        return new HachbackLayer(feture, vParameters);
      case "VAN":
        return new VanLayer(feture, vParameters);
      case "SUV":
        return new SuvLayer(feture, vParameters);
      case "MINIVAN":
        return new MinivanLayer(feture, vParameters);
      case "SEDAN":
      case "CAR":
        // we can select other type example width >5 return PickupLayer
        // if(vParameters.width>5.5)
        //  return new PickupLayer(feture, vParameters);
        // else
        return new SedanLayer(feture, vParameters);

      case "BIKE":
        return new BikeLayer(feture, vParameters);
      case "PICKUP":
        return new PickupLayer(feture, vParameters);
      case "STATIONWAGON":
        return new StationwagonLayer(feture, vParameters);
      case "BUS":
        return new BusLayer(feture, vParameters);
      case "TRUCK":
        return new TruckLayer(feture, vParameters);
      default:
        return new SedanLayer(feture, vParameters);
    }
  }

  createRoroVechileFeature(vParameters) {
    // incorrect server cal rectangle points
    const objCoordP1: turf.Feature = turf.destination(
      vParameters.origin,
      vParameters.width / 1000,
      vParameters.angleX
    );

    const objCoordP2: turf.Feature = turf.destination(
      //@ts-ignore
      objCoordP1,
      vParameters.length / 1000,
      vParameters.angleX + vParameters.angleY
    );
    const objCoordP3: turf.Feature = turf.destination(
      vParameters.origin,
      vParameters.length / 1000,
      vParameters.angleX + vParameters.angleY
    );

    const properties = {
      base: 0,
      height: 2.2,
      layer: 1,
      id: vParameters.uid,
      line: "",
      type: vParameters.type,
      maxLayer: 1,
      ...vParameters,
    };

    //for Triangle
    // const frontMidPoint = turf.midpoint(
    //   //@ts-ignore
    //   objCoordP2.geometry.coordinates,
    //   //@ts-ignore
    //   objCoordP3.geometry.coordinates
    // );

    return turf.polygon(
      [
        [
          //@ts-ignore
          vParameters.origin.geometry.coordinates,
          //@ts-ignore
          objCoordP1.geometry.coordinates,
          //@ts-ignore
          objCoordP2.geometry.coordinates,
          //@ts-ignore
          // frontMidPoint.geometry?.coordinates,
          //@ts-ignore
          objCoordP3.geometry.coordinates,
          //@ts-ignore
          vParameters.origin.geometry.coordinates,
        ],
      ],
      {
        code: vParameters.area,
        row: vParameters.laneNumber,
        bay: vParameters.sequence,
        ...properties,
      }
    );
  }
  /**
   * MapOccupationIntoDictionary
   */

  // async fetchOccupation() {
  //   this.stacks = [];
  //   let dataurl = "json/GetContainerStacks.json";
  //   if (this.terminalId === 7) {
  //     dataurl = "json/stack_DAR.json";
  //   }

  //   await axios.get(dataurl).then((response) => {
  //     this.occupationObjectList = this.MapOccupationIntoDictionary(
  //       response.data.Result
  //     );

  //     // Now that we have the occupation also request to detailed occupation for the 3D view
  //     this.fetchDetailedOccupation();
  //     //  this.fetchRoRoLanes();
  //     this.renderYard();
  //   });
  // }

  // /**
  //  * Retrieves the details slot occupation from the YardView webservice. This is used to draw the 3D container stacks
  //  */


   async fetchOccupation() {
    this.stacks = [];

    await this.tcServices.YardViewServices.YVTerminalOccupationServices.GetContainerStacks(
      this.sessionId,
      this.areaObjects.map((area) => {
        return area.Code;
      })
    )
    .then((response) => {
      if (response.data.Result && response.data.Result.length > 0) {
        this.occupationObjectList = this.MapOccupationIntoDictionary(
          response.data.Result
        );
        this.fetchDetailedOccupation();
      }
      this.fetchRoRoLanes();
      // Now that we have the occupation also request to detailed occupation for the 3D view
      this.renderYard();
    });
  }


   fetchDetailedOccupation() {
    const me = this;
    this.tcServices.YardViewServices.YVTerminalOccupationServices.GetContainerStackDetails(
      this.sessionId,
      this.areaObjects.map((area) => {
        return area.Code;
      })
    )
      .then((response) => {
        this.createContainerFeatures(response.data.Result);
        this.renderYard();
      })
      .catch((error) => {
        console.error(error.message);
      });
  }



//   axios({
//   method: 'post', //you can set what request you want to be
//   url: 'https://example.com/request',
//   data: {id: varID},
//   headers: {
//     Authorization: 'Bearer ' + varToken
//   }
// })


  // fetchDetailedOccupation() {
  //   let dataurl =
  //   "json/GetContainerStackDetails.json";
  //   if (this.terminalId === 7) {
  //     dataurl = "json/stack_detail_DAR.json";
  //   }
  //   axios
  //     .get(dataurl)
  //     .then((response) => {
  //       this.createContainerFeatures(response.data.Result);
  //       this.renderYard();
  //     })
  //     .catch((error) => {
  //       console.error(error.message);
  //     });
  // }

  /**
   * MapOccupationIntoDictionary
   */
  MapOccupationIntoDictionary(
    occupationArray: Array<Occupation>
  ): OccupationDictionary {
    if (!occupationArray || occupationArray.length === 0) {
      throw new Error("Occupation array was null or empty!");
    }

    const occupationDict = new OccupationDictionary();
    occupationArray.forEach((occupation) => {
      const newOcc = new Occupation(
        occupation.Area,
        occupation.Bay,
        occupation.Bay2,
        occupation.Bay3,
        occupation.ContainerLength,
        occupation.MaxLayer,
        occupation.Row
      );
      if (occupation.Bay) {
        occupationDict.SetBay(
          occupation.Area,
          occupation.Row,
          occupation.Bay,
          newOcc
        );
      }
      if (occupation.Bay2) {
        occupationDict.SetBay(
          occupation.Area,
          occupation.Row,
          occupation.Bay2,
          newOcc
        );
      }
      if (occupation.Bay3) {
        occupationDict.SetBay(
          occupation.Area,
          occupation.Row,
          occupation.Bay3,
          newOcc
        );
      }
    });

    return occupationDict;
  }

  /**
   * Is called when the user presses the save selection button
   */
  saveSelectionClicked() {
    if ("appInterface" in window && this.selectSlotsTool) {
      window["appInterface"].selectSlots_Completed(
        JSON.stringify(this.selectSlotsTool.getSelectedSlots())
      );
    }

    if (this.selectSlotsTool) {
      this.selectSlotsTool.setEnabled(false);
      this.selectionMode = false;
    }
  }

  /**
   * Is called when the user presses the cancel button
   */
  cancelClicked() {
    if (this.selectSlotsTool) {
      this.selectSlotsTool.setEnabled(false);
      this.selectionMode = false;
    }
  }

  /**
   * Fired when the user clicks on a feature with the mouse
   * @param {MapMouseEvent} e
   */
  onFeatureClicked(e) {
    console.log(
      "Bearing,lat,lng",
      this.map.getBearing(),
      this.map.getCenter().lat,
      this.map.getCenter().lng
    );
    
    if (
      !this.map ||
      (this.editor && this.editor.active()) ||
      (this.selectSlotsTool && this.selectSlotsTool.enabled)
    ) {
      return;
    }

    const features = this.map.queryRenderedFeatures(e.point);
    if (features.length > 0) {
      const props = features[0].properties;

      this.clickobject(props);
      if (/* this.pageurl && */ props) {
        const url = this.pageurl;
        let code = props.shipid;
        if (!code) {
          code = props.code;
        }
        // window.location.replace(
        //   `${url}?code=${code}&row=${props.row}&bay=${props.bay}&layer=${props.layer}`
        // );
        this.$router.push(`?code=${code}&row=${props.row}&bay=${props.bay}&layer=${props.layer}`)
        setTimeout(() => {
          this.$router.push('/berthmonitoring')
        }, 2000);
      }

      // if ("appInterface" in window && props) {
      //   window["appInterface"].clickPosition(
      //     props.code,
      //     props.row,
      //     props.bay,
      //     props.layer
      //   );
      // }
    }
  }
  pagecomplete() {
    if (this.pageurl) {
      const url = this.pageurl;
      window.location.replace(`${url}?complete=true`);
      setTimeout(() => {
        window.location.replace(url);
      }, 2000);
    }
    this.loadcomplete("All");
  }

  /**
   * Fired when the mouse hovers over a feature on the map
   * @param {MapMouseEvent} e
   */
  _onMouseMove(e) {
    if (this.selectSlotsTool == null || !this.map) return;

    if (
      !this.selectSlotsTool.enabled &&
      (this.editor == null || !this.editor.active())
    ) {
      const features = this.map.queryRenderedFeatures(e.point);
      let mousetype = "";
      features.forEach((feat) => {
        if (
          feat["source"] == "areas" ||
          feat["source"] == "slots" ||
          feat["source"] == "previewareas" ||
          feat["source"] == "previewslots" ||
          feat["source"] == "containers"
        ) {
          mousetype = "pointer";
        }
      });

      this.map.getCanvas().style.cursor = mousetype;
    }
  }

  /**
   * Extract the session Id from the URL
   */
  readQueryStringParams(): string {
    let sessionId = "";
    let terminalId = 1;
    this.useRoro3dModel = true;
    window.location.href.replace(
      /[?&]+([^=&]+)=([^&]*)/gi,
      //@ts-ignore
      (m: string, key: string, value: string) => {
        if (key == "sessionId") {
          sessionId = value;
        }
        if (key == "terminalId") {
          terminalId = Number(value);
        }
        if (key == "apiurl") {
          this.apiUrl = value;
        }
        if (key == "useRoro3dModel") {
          this.useRoro3dModel = Number(value) === 1;
        }
        if (key == "pageurl") {
          this.pageurl = value;
        }
        if (key == "quality") {
          if (value.toLowerCase() === "high") {
            this.renderQuality = "High";
          }
          if (value.toLowerCase() === "medium") {
            this.renderQuality = "Medium";
          }
          if (value.toLowerCase() === "low") {
            this.renderQuality = "Low";
            this.useRoro3dModel = false;
          }
        }
      }
    );


    //For testing purposes only
   // if (!sessionId) {
    //  sessionId ="d281d13c-3a30-45d1-b5da-156ee0b390d6";
      

      //  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyaWQiOiIxIiwibmJmIjoxNjI3MjA1MjAzLCJleHAiOjE2MjcyMDg4MDMsImlhdCI6MTYyNzIwNTIwM30.cY5vKtY8UATnSNiiHWFnBUiLWrcs23h-owdmbc5WMJY";

      // console.error("No session Id found!");
  //  }

    axios.defaults.headers.common["Authorization"] = `bearer ${sessionId}`;
    axios.defaults.headers.common['Access-Control-Allow-Origin'] = '*';
    return sessionId;
  }

  preview(yvObject: YardViewObject) {
    if (!this.map) {
      return;
    }

    //Get preview area source
    const previewAreas: GeoJSONSource = this.map.getSource(
      "previewareas"
    ) as GeoJSONSource;

    //Get preview slots source
    const previewslots: GeoJSONSource = this.map.getSource(
      "previewslots"
    ) as GeoJSONSource;

    this.previewMode = yvObject != null;
    this.previewObject = yvObject != null ? yvObject.Code : null;

    if (
      yvObject &&
      ((yvObject.GeoShape === "CIRCLE" &&
        yvObject.GeoPointLongitude &&
        yvObject.GeoPointLatitude) ||
        (yvObject.GeoShape && yvObject.GeoShapePoints))
    ) {
      const feat = this.generateFeature(yvObject);
      yvObject.Feature = feat;

      if (!yvObject.Feature) {
        return;
      }

      //Set preview area data
      previewAreas.setData(
        turf.featureCollection([
          yvObject.Feature,
        ]) as GeoJSON.FeatureCollection<GeoJSON.Geometry>
      );

      if (yvObject.Structure !== "NONE") {
        previewslots.setData(
          turf.featureCollection(
            this.renderSlots(yvObject)
          ) as GeoJSON.FeatureCollection<GeoJSON.Geometry>
        );
      }
    } else {
      this.map;
      previewAreas.setData(
        turf.featureCollection(
          []
        ) as GeoJSON.FeatureCollection<GeoJSON.Geometry>
      );
      this.map;
      previewslots.setData(
        turf.featureCollection(
          []
        ) as GeoJSON.FeatureCollection<GeoJSON.Geometry>
      );
    }

    this.renderYard();
  }

  refresh(includingStructure) {
    if (includingStructure) {
      this.areas = [];
      this.slots = [];
      this.stacks = [];
      this.containers = [];
      this.clear3DModels();
      this.fetchObjectData();
    } else {
      this.stacks = [];
      this.containers = [];
      this.clear3DModels();
      // this.fetchOccupation();
    }
  }
  clear3DModels() {
    for (const id of this.roro3DModelList) {
      if (this.map.getLayer(id)) this.map.removeLayer(id);
    }
    this.roro3DModelList = [];
  }
  highlightSlots(selectedItemsStr: string) {
    if (this.selectSlotsTool && !this.selectSlotsTool.enabled) {
      const selectedItems = JSON.parse(
        selectedItemsStr
      ) as SelectionInterface[];
      this.selectSlotsTool.highlight(selectedItems);
      this.previewMode = selectedItems != null;
    }
  }

  selectSlots(selectedItems: string) {
    if (this.selectSlotsTool) {
      this.selectSlotsTool.setEnabled(
        true,
        JSON.parse(selectedItems) as SelectionInterface[]
      );
      this.selectionMode = true;
    }
  }

  toggleOccupationLayers() {
    if (!this.map) {
      return;
    }

    this.map.setLayoutProperty(
      "stacks3D",
      "visibility",
      this.map.getPitch() < 10 || this.previewMode || this.selectionMode
        ? "none"
        : "visible"
    );

    this.map.setLayoutProperty(
      "stacks2D",
      "visibility",
      this.map.getPitch() >= 10 || this.previewMode || this.selectionMode
        ? "none"
        : "visible"
    );
  }
  generateAreaFeatureFake(
    geoShape,
    geoShapePoints,
    objectType,
    objectCode,
    structure
  ) {
    const geometryCoordinates: Array<Array<number>> = [];
    if (geoShapePoints.geometry) {
      if (geoShapePoints.geometry.coordinates) {
        geoShapePoints.geometry.coordinates[0].forEach((item) => {
          geometryCoordinates.push([item[0], item[1]]);
        });
      }
    } else {
      const coordinates = geoShapePoints.split(",");
      coordinates.forEach((coordinate) => {
        const latlon = coordinate.split("/");
        geometryCoordinates.push([Number(latlon[1]), Number(latlon[0])]);
      });
      //Polygon requires first and last position to be the same
      geometryCoordinates.push(geometryCoordinates[0]);
    }

    if (objectType === "ROROxx") {
      const area = this.areaObjects.find((area) => area.Code === objectCode);

      const maxLength = Number(area.LaneLength);
      const maxWidth =
        area.Lanes.length *
          (Number(area.LaneWidth) + Number(area.LaneInterspace)) -
        Number(area.LaneInterspace);
      const angelX = Number(area.AngleX) + 90;
      const angelY = Number(area.AngleY);
      const point0 = geometryCoordinates[0];
      let directionAngle = 90;
      if (angelY === 270) {
        directionAngle = -90;
      }

      const point1 = turf.destination(point0, maxLength / 1000, angelX).geometry
        .coordinates;
      const point2 = turf.destination(
        point1,
        maxWidth / 1000,
        angelX + directionAngle
      ).geometry.coordinates;
      const point3 = turf.destination(
        point0,
        maxWidth / 1000,
        angelX + directionAngle
      ).geometry.coordinates;
      const newArray = [point0, point1, point2, point3, point0];

      const newPlolygon = turf.polygon([newArray], {
        code: objectCode,
        fid: objectCode,
        objectType: objectType,
        structure: structure,
      });
      
    }
    //For Create Fake Data Container

    if (
      objectType === "CONTAREA" &&
      this.terminalId === 7 &&
      objectCode === "KH01"
    ) {
      const area = this.areaObjects.find((area) => area.Code === objectCode);
      const maxLength =
        Number(area.NumberOfBays) *
          (Number(area.PositionLength) + Number(area.BayInterspace)) -
        Number(area.BayInterspace);
      const maxWidth =
        Number(area.NumberOfRows) *
          (Number(area.PositionWidth) + Number(area.RowInterspace)) -
        Number(area.RowInterspace);

      const angelX = Number(area.AngleX) + 90;
      const angelY = Number(area.AngleY);
      const point0 = geometryCoordinates[0];
      let directionAngle = 90;
      if (angelY === 270) {
        directionAngle = -90;
      }

      const point1 = turf.destination(point0, maxLength / 1000, angelX).geometry
        .coordinates;
      const point2 = turf.destination(
        point1,
        maxWidth / 1000,
        angelX + directionAngle
      ).geometry.coordinates;
      const point3 = turf.destination(
        point0,
        maxWidth / 1000,
        angelX + directionAngle
      ).geometry.coordinates;
      const newArray = [point0, point1, point2, point3, point0];

      const newPlolygon = turf.polygon([newArray], {
        code: objectCode,
        fid: objectCode,
        objectType: objectType,
        structure: structure,
      });
      //

      //Create Fake Data

      if (objectCode === "HC01" && this.terminalId === 9) {
        const newareas = [];
        for (let col = 1; col <= 2; col++) {
          const fixpoint = turf.destination(
            point0,
            ((maxLength + 40) * (col - 1)) / 1000,
            angelX
          ).geometry.coordinates;
          for (let i = 1; i <= 6; i++) {
            const point3 = turf.destination(
              fixpoint,
              ((maxWidth + 10) * (i - 1)) / 1000,
              angelX + directionAngle
            ).geometry.coordinates;
            const res = this.generateAreaCorrectPolygon(
              point3,
              maxLength,
              maxWidth,
              angelX,
              directionAngle
            );
            const newp = turf.polygon([res], {});

            const area0 = Object.assign({}, this.areaObjects[0]);
            //@ts-ignore
            area0.GeoShapePoints = newp;
            let md = "A";
            if (col === 1) md = "A";
            if (col === 2) md = "B";
            if (col === 3) md = "C";
            if (i >= 10) {
              area0.Code = "A" + md + i;
            } else {
              area0.Code = "A" + md + "0" + i;
            }
            /// if(!(col===1 && i===1))
            newareas.push(area0);
            this.areaObjects.push(area0);
          }
        }
        
      }

      return newPlolygon;
    }

    return turf.polygon([geometryCoordinates], {
      code: objectCode,
      fid: objectCode,
      objectType: objectType,
      structure: structure,
    });
  }
}
</script>

<style>
.boxdraw {
  background: rgba(56, 135, 190, 0.1);
  border: 2px solid #3887be;
  position: absolute;
  top: 0;
  left: 0;
  width: 0;
  height: 0;
}

.button {
  position: absolute;
  left: 20px;
  width: 130px;
  background-color: white;
  z-index: 10;
  text-align: center;
  padding: 6px;
  cursor: pointer;
  font-family: "Segoe UI", Tahoma, Verdana, sans-serif;
  -webkit-box-shadow: 0px 0px 4px 0px rgba(0, 0, 0, 0.75);
  -moz-box-shadow: 0px 0px 4px 0px rgba(0, 0, 0, 0.75);
  box-shadow: 0px 0px 4px 0px rgba(0, 0, 0, 0.75);
}

.selection-mode {
  cursor: crosshair;
}

#save-selection {
  top: 20px;
}

#cancel-selection {
  top: 70px;
}

.help-keys {
  position: absolute;
  padding: 4px;
  bottom: 10px;
  right: 10px;
  z-index: 10;
  border: 1px outset #bbbbbb;
  font-family: "Segoe UI", Tahoma, Verdana, sans-serif;
  font-size: 0.8em;
  background-color: #2f3742;
  color: white;
}
.help-keys td {
  padding-right: 3px;
}
.mapboxgl-control-container {
  display: none !important;
}
</style>
