import mapboxgl from "mapbox-gl";
import BaseLayer from "./BaseLayer";
export default class PickupLayer extends BaseLayer {
  getModelUrl() {
    return `object3d/${this.vParameters.model3dVersion}/pickup.gltf`;
  }
  getScaleFactor() {
    return {
      y: this.vParameters.length / 3.2,
      z: 1,
      x: this.vParameters.width / this.vParameters.laneWidth,
    };
  }
}
