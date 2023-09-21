import mapboxgl from "mapbox-gl";
import BaseLayer from "./BaseLayer";

import * as turf from "@turf/turf";
export default class VanLayer extends BaseLayer {
  getModelUrl() {
    return `object3d/${this.vParameters.model3dVersion}/van.gltf`;
  }

  getScaleFactor() {
    return {
      y: this.vParameters.length / 3.3,
      z: 1,
      x: this.vParameters.width / this.vParameters.laneWidth,
    };
  }
}
