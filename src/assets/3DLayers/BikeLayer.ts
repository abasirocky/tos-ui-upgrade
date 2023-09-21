import mapboxgl from "mapbox-gl";
import BaseLayer from "./BaseLayer";

export default class BikeLayer extends BaseLayer {
  getModelUrl() {
    return `object3d/${this.vParameters.model3dVersion}/bike.gltf`;
  }

  getScaleFactor() {
    return {
      y: 1,
      z: 1,
      x: 1,
    };
  }
}
