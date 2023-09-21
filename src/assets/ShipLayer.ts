import * as THREE from "three";
import GLTFLoader from "three-gltf-loader";
import * as mapboxgl from "mapbox-gl";
import * as turf from "@turf/turf";
import { Text } from "troika-three-text";
export default class ShipLayer {
  id = "";
  type = "custom";
  renderingMode = "3d";
  ship: any;
  pitloc: any;
  renderer: any;
  map: mapboxgl.Map;
  scene = new THREE.Scene();
  cam: any;
  textObjects = [];
  public startpoint: any;
  public endpoint: any;
  anglex: number;
  center: any;
  constructor(
    center: any,
    ship: any,
    startpoint: any,
    endpoint: any,
    anglex: number
  ) {
    this.center = center;
    this.ship = ship;
    this.startpoint = startpoint;
    this.endpoint = endpoint;

    this.id = ship.id + "_" + ship.vesselName;
    THREE.Cache.enabled = true;
    this.cam = this.getCam();
    this.anglex = anglex + 2 * (90 - anglex);
  }

  addlights() {
    const skyColor1 = 0xffffff;
    const groundColor1 = 0x181817;
    const intensity1 = 1;
    const light1 = new THREE.HemisphereLight(
      skyColor1,
      groundColor1,
      intensity1
    );

    this.scene.add(light1);
  }
  addShipNames(pos0, pos1) {
    const me = this;

    const topText = new Text();
    topText.text = `${me.ship.vesselName}\n(${this.ship.voyageNoIn},${this.ship.voyageNoOut})\n${this.ship.loa}m`;
    topText.fontSize = 0.1;
    topText.outlineColor = 0xffffff;
    topText.outlineWidth = 0.02;
    //myText.letterSpacing = -0.1;
    topText.scale.set(30, 30, 30);
    topText.textAlign = "center";
    topText.anchorX = "center";
    topText.anchorY = "middle";
    topText.position.set(0, 20, 0);
    topText.color = 0x000000;
    topText.rotation.x = -Math.PI / 2;
    topText.rotation.y = Math.PI / 2 + Math.PI / 2;

    this.scene.add(topText);
    this.textObjects.push(topText);

    //https://threejs.org/examples/fonts/gentilis_bold.typeface.json
    //https://threejs.org/examples/fonts/gentilis_bold.typeface.json
    //https://threejs.org/examples/fonts/optimer_bold.typeface
    //https://threejs.org/examples/fonts/helvetiker_regular.typeface.json
    //https://threejs.org/examples/fonts/helvetiker_bold.typeface.json
    //https://threejs.org/examples/fonts/droid/droid_serif_regular.typeface.json
    //https://threejs.org/examples/fonts/droid/droid_serif_bold.typeface.json
    //https://threejs.org/examples/fonts/droid/droid_sans_mono_regular.typeface.json
    //https://threejs.org/examples/fonts/droid/droid_sans_bold.typeface.json
    const loader = new THREE.FontLoader();

    loader.load(
      "https://threejs.org/examples/fonts/droid/droid_serif_regular.typeface.json",
      function(font) {
        const geometrytext = new THREE.TextGeometry(me.ship.vesselName, {
          font: font,
          size: 5,
          height: 1,
          curveSegments: 12,
          bevelEnabled: false,
          bevelThickness: 1,
          bevelSize: 0.5,
          bevelOffset: 0,
          bevelSegments: 3,
        }).normalize();

        const cubeMat = new THREE.MeshBasicMaterial({
          color: "#ffffff",
        });

        const leftText = new THREE.Mesh(geometrytext, cubeMat);
        leftText.position.set(pos0.x, pos0.y, pos0.z);
        leftText.rotation.y = Math.PI / 2;

        const rightText = new THREE.Mesh(geometrytext, cubeMat);
        rightText.position.set(pos1.x, pos1.y, pos1.z);
        rightText.rotation.y = -Math.PI / 2;

        const cubeMat2 = new THREE.MeshBasicMaterial({
          color: "#ffffff",
        });
        const mesh2 = new THREE.Mesh(geometrytext, cubeMat2);
        mesh2.position.set(0, 7, 0);
        mesh2.rotation.x = -Math.PI / 2;
        mesh2.scale.set(3, 3, 3);
        leftText.scale.set(3, 3, 3);
        rightText.scale.set(3, 3, 3);
        me.scene.add(leftText);
        me.scene.add(rightText);
      }
    );
  }
  zoomed(e, me) {
    const zoom = e.target.getZoom();
    me.textObjects.forEach((item) => {
      item.visible = true;
      if (zoom > 15 && zoom < 16) {
        const scale = 15;
        item.scale.set(scale, scale, scale);
        item.position.x = 0;
      } else if (zoom > 15) {
        const scale = 10;
        item.scale.set(scale, scale, scale);
        item.position.x = 0;
      } else {
        //zoom <15
        item.visible = false;
        const scale = 40;
        if (me.ship.side && me.ship.side.toLocaleUpperCase() !== "PORT")
          item.position.x = -15;
        else item.position.x = 15;
        item.scale.set(scale, scale, scale);
      }
    });
  }
  onAdd(map, gl: WebGLRenderingContext) {
    this.map = map;
    const me = this;

    this.map.on("zoom", (e) => this.zoomed(e, me));
    this.addlights();
    const loader = new GLTFLoader();
    let gltf = "object3d/ship/ship4.gltf";
    if (this.ship.vesselType === "Ro-Ro") {
      gltf = "object3d/ship/ship4.gltf";
    }

    loader.load(
      gltf,
      (gltf) => {
        // Ship Width Scale 3DModel

        const texture = new THREE.TextureLoader().load(
          `images/flags/${this.ship.nationality}.svg`
        );
        texture.encoding = THREE.sRGBEncoding;
        texture.flipY = false;
        texture.wrapS = THREE.RepeatWrapping;
        texture.wrapT = THREE.RepeatWrapping;

        // Add Flags
        const flag0 = gltf.scene.getObjectByName("flag0");
        const flag1 = gltf.scene.getObjectByName("flag1");
        if (flag0) {
          flag0.traverse((child) => {
            if (child instanceof THREE.Mesh) {
              const material = new THREE.MeshBasicMaterial({
                map: texture,
              });
              child.material = [];
              child.material = material;
              child.material.needsUpdate = true;
            }
          });
        }
        if (flag1) {
          flag1.traverse((child) => {
            if (child instanceof THREE.Mesh) {
              const material = new THREE.MeshBasicMaterial({
                map: texture,
              });
              child.material = [];
              child.material = material;
              child.material.needsUpdate = true;
            }
          });
        }

        // add Ship Vessel Name
        const point0 = gltf.scene.getObjectByName("Point0");
        const point1 = gltf.scene.getObjectByName("Point1");
        if (
          point0 &&
          point1 &&
          point0 instanceof THREE.Mesh &&
          point1 instanceof THREE.Mesh
        ) {
          this.addShipNames(
            point0.geometry.boundingSphere.center,
            point1.geometry.boundingSphere.center
          );
        }

        this.scene.add(gltf.scene);
        const factorw = this.ship.loa / 40;
        this.scene.scale.set(factorw, factorw, factorw);
      },
      (xhr) => {
        console.log(`${(xhr.loaded / xhr.total) * 100}% loaded`);
      },
      (error) => {
        console.error("An error happened", error);
      }
    );

    this.renderer = new THREE.WebGLRenderer({
      canvas: map.getCanvas(),
      context: gl,
      antialias: true,
    });

    this.renderer.autoClear = false;
    // this.renderer.shadowMap.enabled = true;
  }

  render(gl, matrix) {
    let ang = this.anglex; //turf.bearing(this.startpoint, this.endpoint)
    let ry = 0;
    ry = (ang * Math.PI) / 180;
    if (this.ship.side && this.ship.side.toLocaleUpperCase() !== "PORT") {
      ry = ry + Math.PI;
    }

    const angelBerth = ry + Math.PI;

    const pitch = 90 - this.map.getPitch();
    const zoom = this.map.getZoom();
    //console.log(this.map.getBearing(),this.map.getCenter(),this.map.getPitch());
    const rotateText =
      -angelBerth - (this.map.getBearing() * Math.PI) / 180 + Math.PI;
    this.textObjects.forEach((item) => {
      //item.scale.set(zoom / 2, zoom / 2, zoom / 2);
      if (pitch > 60) {
        item.rotation.set(-Math.PI / 2, 0, rotateText);
        item.position.y = 7;
      } else {
        item.rotation.set(0, rotateText, 0);
        item.position.y = 10;
      }
      if (item.sync) {
        item.fontSize = (0.2 * zoom) / 20;
        item.sync();
      }
    });

    // const lng = this.center.geometry.coordinates[0];
    // const lat = this.center.geometry.coordinates[1];
    //Move Ship Behind Berth
    const shipwidth = this.ship.loa / 4;
    const BerthHeight = 70;
    const newPoint = turf.destination(
      this.center,
      (BerthHeight - shipwidth) / 2 / 1000,
      this.anglex + 90
    );
    const lng = newPoint.geometry.coordinates[0];
    const lat = newPoint.geometry.coordinates[1];

    const startpos = new mapboxgl.LngLat(lng, lat);
    const modelAsMercatorCoordinate = mapboxgl.MercatorCoordinate.fromLngLat(
      startpos,
      0
    );
    const modelTransform = {
      translateX: mapboxgl.MercatorCoordinate.fromLngLat(startpos, 0).x,
      translateY: mapboxgl.MercatorCoordinate.fromLngLat(startpos, 0).y,
      translateZ: mapboxgl.MercatorCoordinate.fromLngLat(startpos, 0).z,
      rotateX: Math.PI / 2,
      rotateY: ry,
      rotateZ: 0,
      // scale: modelAsMercatorCoordinate.meterInMercatorCoordinateUnits() * 1.3383e-7 * factorw * 0.92, // 13.7
      scale: modelAsMercatorCoordinate.meterInMercatorCoordinateUnits(),
    };

    const currentMatrix = new THREE.Matrix4().fromArray(matrix);
    const cam = this.cam === null ? new THREE.Camera() : this.cam;
    cam.projectionMatrix.elements = matrix;
    cam.projectionMatrix = currentMatrix.multiply(
      this.getNewMatrix(modelTransform)
    );
    if (this.renderer) {
      this.renderer.state.reset();
      this.renderer.render(this.scene, cam);
    }
    //this.map.triggerRepaint();
  }
  getNewMatrix(modelTransform: any): THREE.Matrix4 {
    const rotationX = new THREE.Matrix4().makeRotationX(modelTransform.rotateX);
    const rotationY = new THREE.Matrix4().makeRotationY(modelTransform.rotateY);
    const rotationZ = new THREE.Matrix4().makeRotationZ(modelTransform.rotateZ);

    const newMatrix = new THREE.Matrix4()
      .makeTranslation(
        modelTransform.translateX,
        modelTransform.translateY,
        Number(modelTransform.translateZ)
      )
      .scale(
        new THREE.Vector3(
          modelTransform.scale,
          -modelTransform.scale,
          modelTransform.scale
        )
      )
      .multiply(rotationX)
      .multiply(rotationY)
      .multiply(rotationZ);
    return newMatrix;
  }

  getCam() {
    const cam = new THREE.Camera();
    return cam;
  }
  getCoordinates(Berth: BerthManagment.Berth) {
    const geometryCoordinates: Array<Array<number>> = [];
    const coordinates = Berth.polygon.split(",");
    coordinates.forEach((coordinate) => {
      const latlon = coordinate.split("/");
      geometryCoordinates.push([Number(latlon[1]), Number(latlon[0])]);
    });
    return geometryCoordinates;
  }
}
