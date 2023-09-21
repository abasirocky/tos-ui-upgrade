import * as THREE from "three";
import GLTFLoader from "three-gltf-loader";
import * as turf from "@turf/turf";
import mapboxgl from "mapbox-gl";

export default abstract class BaseLayer {
  id = "";
  type = "custom";
  renderingMode = "3d";
  feture: any;
  vParameters: any;
  map: any;
  scene: any;
  renderer: any;
  cord: any;
  cam: any;
  loader = new GLTFLoader();
  ranglex: number;
  rangley: number;
  centerPoint: any;
  rotateY: number;

  translateX: number;
  translateY: number;
  translateZ: number;

  constructor(feture: any, vParameters: any) {
    this.feture = feture;
    this.vParameters = vParameters;

    this.id = this.uuidv4(); // vParameters.vin;

    this.cam = new THREE.Camera();
    this.scene = new THREE.Scene();
    THREE.Cache.enabled = true;
    this.ranglex = (this.vParameters.angleX * Math.PI) / 180;
    this.rangley = (this.vParameters.angleY * Math.PI) / 180;
    if (this.vParameters.angleY === 270) {
      this.rotateY = -Math.PI / 2 - this.ranglex;
    } else {
      this.rotateY = Math.PI / 2 - this.ranglex;
    }
    if (this.feture.geometry.coordinates[0].length > 3) {
      this.centerPoint = turf.midpoint(
        this.feture.geometry.coordinates[0][0],
        this.feture.geometry.coordinates[0][2]
      );
      this.cord = this.centerPoint.geometry.coordinates;
    }

    const startpos = new mapboxgl.LngLat(this.cord[0], this.cord[1]);

    this.translateX = mapboxgl.MercatorCoordinate.fromLngLat(startpos, 0).x;
    this.translateY = mapboxgl.MercatorCoordinate.fromLngLat(startpos, 0).y;
    this.translateZ = 0; // mapboxgl.MercatorCoordinate.fromLngLat(startpos, 0).z ?? 0
  }

  abstract getModelUrl();
  getScaleFactor() {
    return {
      x: 1,
      y: 1,
      z: 1,
    };
  }

  addLights(): void {
    // const directionalLight2 = new THREE.AmbientLight(0xffffff);
    // this.scene.add(directionalLight2);
    const skyColor1 = 0xffffff; // light blue
    const groundColor1 = 0x181817; // brownish orange
    const intensity1 = 1;
    const light1 = new THREE.HemisphereLight(
      skyColor1,
      groundColor1,
      intensity1
    );
    this.scene.add(light1);
  }
  onAdd(map, gl) {
    this.map = map;

    this.addLights();

    const me = this;
    const gtlfModelUrl = this.getModelUrl();
    this.loader.load(
      gtlfModelUrl,
      (gltf) => {
        // called when the resource is loaded
        const scaleFactor = this.getScaleFactor();
        // X --> length , Y --> height , Z --> width
        gltf.scene.scale.set(
          scaleFactor.x * 2.4,
          scaleFactor.y * 2.4,
          scaleFactor.z * 2.4
        );
        me.scene.add(gltf.scene);
      },
      (xhr) => {
        // called while loading is progressing
        console.log(
          `${gtlfModelUrl} - ${(xhr.loaded / xhr.total) * 100}% loaded`
        );
      },
      (error) => {
        // called when loading has errors
        console.error("An error happened", error);
      }
    );
    this.renderer = new THREE.WebGLRenderer({
      canvas: map.getCanvas(),
      context: gl,
      antialias: false,
    });
    this.renderer.autoClear = false;
  }

  render(gl, matrix) {
    const currentMatrix = new THREE.Matrix4().fromArray(matrix);
    const transofrm = this.gettransformMatix();
    const cam = this.cam === null ? new THREE.Camera() : this.cam;

    cam.projectionMatrix.elements = matrix;
    cam.projectionMatrix = currentMatrix.multiply(transofrm);
    if (this.renderer) {
      this.renderer.state.reset();
      this.renderer.render(this.scene, cam);
    }
    //this.map.triggerRepaint();
  }

  gettransformMatix() {
    const startpos = new mapboxgl.LngLat(this.cord[0], this.cord[1]);
    const modelAsMercatorCoordinate = mapboxgl.MercatorCoordinate.fromLngLat(
      startpos,
      0
    );
    const rotationX = new THREE.Matrix4().makeRotationX(0);
    const rotationY = new THREE.Matrix4().makeRotationY(0);
    const rotationZ = new THREE.Matrix4().makeRotationZ(this.rotateY);
    return (
      new THREE.Matrix4()
        .makeTranslation(this.translateX, this.translateY, this.translateZ)
        // .scale(new THREE.Vector3(1e-7, -1e-7, 1e-7))
        .scale(
          new THREE.Vector3(
            modelAsMercatorCoordinate.meterInMercatorCoordinateUnits(),
            -modelAsMercatorCoordinate.meterInMercatorCoordinateUnits(),
            modelAsMercatorCoordinate.meterInMercatorCoordinateUnits()
          )
        )
        .multiply(rotationX)
        .multiply(rotationY)
        .multiply(rotationZ)
    );
  }
  uuidv4() {
    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function(c) {
      const r = (Math.random() * 16) | 0,
        v = c == "x" ? r : (r & 0x3) | 0x8;
      return v.toString(16);
    });
  }
}
