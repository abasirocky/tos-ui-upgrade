import mapboxgl from "mapbox-gl";
import BaseLayer from "./BaseLayer";

export default class TruckLayer extends BaseLayer {
  getModelUrl() {
    return `object3d/${this.vParameters.model3dVersion}/truck.gltf`;
  }

  getScaleFactor() {
    return {
      y: this.vParameters.length / 4.4,
      z: 1,
      x: this.vParameters.width / this.vParameters.laneWidth,
    };
  }
}
