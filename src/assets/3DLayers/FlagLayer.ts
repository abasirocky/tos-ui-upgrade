import mapboxgl from "mapbox-gl";
import BaseLayer from "./BaseLayer";
import * as turf from "@turf/turf";

export default class FlagLayer extends BaseLayer {
  // getSomeLights(): any[] {
  //     const directionalLight2 = new THREE.SpotLight(0xffffff);
  //     directionalLight2.position.set(0, -70, 100).normalize();
  //      return [directionalLight2]

  // }
  getModelUrl() {
    return "images/flag3d/flag1.gltf";
  }
  getScaleFactor() {
    return { x: 1, y: 1, z: 1 };
  }

  getModelTransform() {
    const bpoint: turf.Polygon = this.vParameters.origin
      .geometry as turf.Polygon;
    this.cord = [bpoint.coordinates[0], bpoint.coordinates[1]];
    const startpos = new mapboxgl.LngLat(this.cord[0], this.cord[1]);
    //  const startpos = [this.cord[0], this.cord[1]];
    const altitude = 50;
    const ranglex = (this.vParameters.angleX * Math.PI) / 180;
    const modelTransform = {
      translateX: mapboxgl.MercatorCoordinate.fromLngLat(startpos, altitude).x,
      translateY: mapboxgl.MercatorCoordinate.fromLngLat(startpos, altitude).y,
      translateZ: mapboxgl.MercatorCoordinate.fromLngLat(startpos, altitude).z,
      rotateX: Math.PI / 2,
      rotateY:
        this.vParameters.angleY === 90
          ? ranglex + Math.PI / 2
          : Math.PI / 2 - ranglex,
      rotateZ: 0,
      scale: 1e-7,
    };
    return modelTransform;
  }
}
