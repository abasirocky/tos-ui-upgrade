import mapboxgl from "mapbox-gl";
import BaseLayer from "./BaseLayer";
import * as turf from "@turf/turf";

export default class HachbackLayer extends BaseLayer {
  getModelUrl() {
    return `object3d/${this.vParameters.model3dVersion}/hachback.gltf`;
  }

  getScaleFactor() {
    return {
      y: this.vParameters.length / 2.4,
      z: 1,
      x: this.vParameters.width / this.vParameters.laneWidth,
    };
  }
}
