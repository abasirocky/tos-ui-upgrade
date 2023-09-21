import mapboxgl from "mapbox-gl";
import BaseLayer from "./BaseLayer";

export default class BusLayer extends BaseLayer {
  getModelUrl() {
    return `object3d/${this.vParameters.model3dVersion}/Bus.gltf`;
  }

  getScaleFactor() {
    return {
      y: this.vParameters.length / 7.7,
      z: 1,
      x: this.vParameters.width / this.vParameters.laneWidth,
    };
  }
}
