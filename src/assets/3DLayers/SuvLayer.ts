import mapboxgl from "mapbox-gl";
import BaseLayer from "./BaseLayer";
import * as turf from "@turf/turf";

export default class SuvLayer extends BaseLayer {
  getModelUrl() {
    return `object3d/${this.vParameters.model3dVersion}/suv.gltf`;
  }

  getScaleFactor() {
    return {
      y: this.vParameters.length / 3.25,
      z: 1,
      x: this.vParameters.width / this.vParameters.laneWidth,
    };
  }
}
