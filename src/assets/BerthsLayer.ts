import * as THREE from "three";

import * as mapboxgl from "mapbox-gl";
import * as turf from "@turf/turf";
import ShipLayer from "./ShipLayer";
import { Text } from "troika-three-text";
export default class BerthsLayer {
  id = "";
  type = "custom";
  renderingMode = "3d";
  textObjects = [];

  vParameters: BerthManagment.Data;
  map: mapboxgl.Map;
  scene: any;
  renderer: any;
  cord: any;
  cam: any;
  BerhStartPoints: number[][];
  angley = 0;
  bolards: any[] = [];
  updateMap: any;
  BerthHeight = 0;

  constructor(vParameters: BerthManagment.Data, updateMap: any) {
    this.vParameters = vParameters;
    this.BerhStartPoints = this.getCoordinates(vParameters.berths[0]);
    this.id = vParameters.id;
    this.cam = new THREE.Camera();
    this.scene = new THREE.Scene();
    THREE.Cache.enabled = true;
    this.updateMap = updateMap;
    this.BerthHeight = 70; //      1000 * turf.distance(this.BerhStartPoints[1], this.BerhStartPoints[2]);
  }

  onAdd(map: mapboxgl.Map, gl) {
    this.map = map;

    this.addLights();

    const me = this;

    //const geometry = new THREE.PlaneGeometry(20, 20);
    // let box = new THREE.BoxGeometry(this.BerthWidth - 1, this.BerthHeigh);

    const loader = new THREE.TextureLoader();
    loader.load(`images/border.png`, (texture) => {
      const material = new THREE.MeshBasicMaterial();

      texture.wrapS = THREE.RepeatWrapping;
      texture.wrapT = THREE.RepeatWrapping;
      texture.repeat.set(1, 1);
      material.map = texture;
      material.needsUpdate = true;
      let startPoint = 0;
      const bh = this.BerthHeight;

      const berth = this.vParameters.berths[0];
      const boxBerth = new THREE.BoxGeometry(berth.length, bh);
      const plane0 = new THREE.Mesh(boxBerth, material);

      plane0.position.set(0, 0.3, 0);
      plane0.rotation.set(Math.PI / 2, 0, 0);
      me.scene.add(plane0);
      berth.bollards.forEach((b) =>
        this.addBolards(me.scene, b, startPoint, berth)
      );
      this.addText(
        { x: startPoint, y: 2, z: -(this.BerthHeight + 8) / 2 },
        berth.name,
        10
      );
      startPoint = 0;
      for (let i = 1; i < this.vParameters.berths.length; i++) {
        startPoint =
          startPoint +
          this.vParameters.berths[i - 1].length / 2 +
          this.vParameters.berths[i].length / 2;

        const berth = this.vParameters.berths[i];
        const boxBerth = new THREE.BoxGeometry(berth.length, this.BerthHeight);
        const plane = new THREE.Mesh(boxBerth, material);
        plane.position.set(startPoint, 0.3, 0);
        plane.rotation.set(Math.PI / 2, 0, 0);
        me.scene.add(plane);

        berth.bollards.forEach((b) =>
          this.addBolards(me.scene, b, startPoint, berth)
        );

        this.addText(
          { x: startPoint, y: 2, z: -(this.BerthHeight + 8) / 2 },
          berth.name,
          10
        );
      }

      this.updateMap(this.bolards);
    });

    this.addStripTexture();

    this.renderer = new THREE.WebGLRenderer({
      canvas: map.getCanvas(),
      context: gl,
      antialias: true,
    });
    this.renderer.autoClear = false;
  }
  addStripTexture() {
    new THREE.TextureLoader().load(`images/strip4.png`, (item1) => {
      new THREE.TextureLoader().load(`images/strip5.jpg`, (item2) => {
        this.calcStripTexture(item1, item2);
      });
    });
  }
  calcStripTexture(item1, item2) {
    const me = this;
    const texture = item1;
    let OldPointed = this.BerhStartPoints[0];
    let oldMarginright = 0;
    let oldMarginleft = 0;
    let sumlength = 0;
    // Calc All Berth Length
    this.vParameters.berths.forEach((b) => (sumlength += b.length));

    // last Gorpoint in last berth in group
    const lastPoint = turf.destination(
      this.BerhStartPoints[0],
      sumlength / 1000,
      this.angley
    );

    if (
      !this.vParameters.voyageInBerths ||
      this.vParameters.voyageInBerths.length === 0
    ) {
      // Add one Plane
      const centerX = sumlength / 2 - this.vParameters.berths[0].length / 2;

      const plane = this.createBerthPlane(
        sumlength,
        this.BerthHeight - 4,
        item1,
        centerX
      );
      if (Math.round(sumlength) > 0)
        this.addText(
          { x: centerX, y: 2, z: 0 },
          `${Math.round(sumlength)}m`,
          10
        );
      me.scene.add(plane);
      return;
    }

    for (let i = 0; i < this.vParameters.voyageInBerths.length; i++) {
      const layerId =
        this.vParameters.voyageInBerths[i].id +
        "_" +
        this.vParameters.voyageInBerths[i].vesselName;

      const vesslLayear2 = this.map.getLayer(layerId);

      const vesslLayear22 = vesslLayear2?.["implementation"] as ShipLayer;

      const marginLeft = Number(vesslLayear22?.ship?.marginLeft);
      const marginRight = Number(vesslLayear22?.ship?.marginRight);

      const distanceFromStart =
        1000 * turf.distance(this.BerhStartPoints[0], OldPointed);
      const distance2 =
        1000 * turf.distance(OldPointed, vesslLayear22?.startpoint) -
        marginLeft -
        oldMarginright;

      if (distance2 > 0) {
        const posx2 =
          distanceFromStart -
          this.vParameters.berths[0].length / 2 +
          distance2 / 2 +
          oldMarginright;
        const plane = this.createBerthPlane(
          distance2,
          this.BerthHeight - 4,
          texture,
          posx2
        );
        if (Math.round(distance2) > 0)
          this.addText(
            { x: posx2, y: 2, z: 0 },
            `${Math.round(distance2)}m`,
            5
          );
        me.scene.add(plane);
      }
      if (marginLeft && marginLeft > 0) {
        const posx2 =
          distanceFromStart +
          (distance2 + oldMarginright) -
          this.vParameters.berths[0].length / 2 +
          marginLeft / 2;
        const plane = this.createBerthPlane(
          marginLeft,
          this.BerthHeight - 4,
          item2,
          posx2
        );
        if (Math.round(marginLeft) > 0)
          this.addText(
            { x: posx2, y: 2, z: 0 },
            `${Math.round(marginLeft)}m`,
            2
          );
        me.scene.add(plane);
      }
      if (marginRight && marginRight > 0) {
        const endshipDistane =
          1000 * turf.distance(this.BerhStartPoints[0], vesslLayear22.endpoint);
        const posx2 =
          endshipDistane -
          this.vParameters.berths[0].length / 2 +
          marginRight / 2;

        const plane = this.createBerthPlane(
          marginRight,
          this.BerthHeight - 4,
          item2,
          posx2
        );
        if (Math.round(marginRight) > 0)
          this.addText(
            { x: posx2, y: 2, z: 0 },

            `${Math.round(marginRight)}m`,
            2
          );
        me.scene.add(plane);
      }

      OldPointed = vesslLayear22.endpoint;
      oldMarginleft = marginLeft;
      oldMarginright = marginRight;
      if (i === this.vParameters.voyageInBerths.length - 1) {
        const distanceFromStart =
          turf.distance(this.BerhStartPoints[0], OldPointed) * 1000;
        const lastDistance =
          turf.distance(OldPointed, lastPoint) * 1000 - marginRight;
        const box1 = new THREE.BoxGeometry(
          lastDistance - 1,
          this.BerthHeight - 4
        );

        const material2 = new THREE.MeshBasicMaterial();

        const textureLast = texture.clone();
        const StripCount = this.getTextureCount(lastDistance);
        textureLast.repeat.set(StripCount, 1);
        textureLast.needsUpdate = true;
        material2.map = textureLast;
        material2.needsUpdate = true;

        const plane3 = new THREE.Mesh(box1, material2);
        const posx2 =
          distanceFromStart -
          this.vParameters.berths[0].length / 2 +
          lastDistance / 2 +
          marginRight;
        plane3.position.set(posx2, 0.4, 0);
        plane3.rotation.set(Math.PI / 2, 0, 0);
        if (Math.round(lastDistance) > 0)
          this.addText(
            { x: posx2, y: 2, z: 0 },
            `${Math.round(lastDistance)}m`,
            10
          );
        me.scene.add(plane3);
      }
    }
  }
  createBerthPlane(width, height, texture, positionX) {
    const box1 = new THREE.BoxGeometry(width, height);
    const material = new THREE.MeshBasicMaterial();
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    const textureFor = texture.clone();
    textureFor.repeat.set(1, 1);
    textureFor.needsUpdate = true;
    material.map = textureFor;
    material.needsUpdate = true;
    const plane = new THREE.Mesh(box1, material);
    plane.position.set(positionX, 0.4, 0);
    plane.rotation.set(Math.PI / 2, 0, 0);
    return plane;
  }

  getTextureCount(length: number): number {
    return Math.floor(length / 200) + 1;
  }

  addBolards(
    scene: any,
    bolard: BerthManagment.Bollard,
    startpoint: number,
    berth: BerthManagment.Berth
  ) {
    const material = new THREE.MeshBasicMaterial({
      color: "#888",
    });
    const boxBerth = new THREE.BoxGeometry(1, 4, 4);

    const plane = new THREE.Mesh(boxBerth, material);
    const bolardPoint = startpoint - berth.length / 2 + bolard.distance;

    plane.position.set(bolardPoint, 0.5, this.BerthHeight / 2);
    plane.rotation.set(Math.PI / 2, 0, 0);
    scene.add(plane);

    const bolardPos = turf.destination(
      this.BerhStartPoints[0],
      (bolardPoint + this.vParameters.berths[0].length / 2) / 1000,
      this.angley
    );
    this.bolards.push({
      position: bolardPos,
      bolard: bolard,
      berthId: berth.id,
    });

    this.addText(
      {
        x: bolardPoint,
        y: 4,
        z: this.BerthHeight / 2 + 5,
      },
      bolard.name,
      5
    );
  }

  render(gl, matrix) {
    const angelBerth = ((this.angley + 270) * Math.PI) / 180;
    const rotate = -(this.map.getBearing() * Math.PI) / 180 + angelBerth;
    const pitch = 90 - this.map.getPitch();
    this.textObjects.forEach((item) => {
      if (pitch > 60) {
        item.rotation.set(-Math.PI / 2, 0, rotate);
      } else {
        item.rotation.set(0, rotate, 0);
      }
    });
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
  addLights(): void {
    const directionalLight2 = new THREE.AmbientLight(0xffffff);
    this.scene.add(directionalLight2);
  }
  getCam() {
    const cam = new THREE.Camera();
    return cam;
  }

  gettransformMatix() {
    const modelTransform = this.getModelTransform();
    const factor = 1;
    const scaleFactor = { x: factor, y: factor, z: factor };
    const rotationX = new THREE.Matrix4().makeRotationAxis(
      new THREE.Vector3(1, 0, 0),
      modelTransform.rotateX
    );
    const rotationY = new THREE.Matrix4().makeRotationAxis(
      new THREE.Vector3(0, 1, 0),
      modelTransform.rotateY
    );
    const rotationZ = new THREE.Matrix4().makeRotationAxis(
      new THREE.Vector3(0, 0, 1),
      modelTransform.rotateZ
    );
    return new THREE.Matrix4()
      .makeTranslation(
        modelTransform.translateX,
        modelTransform.translateY,
        Number(modelTransform.translateZ)
      )
      .scale(
        new THREE.Vector3(
          modelTransform.scale * scaleFactor.x,
          -modelTransform.scale * scaleFactor.y,
          modelTransform.scale * scaleFactor.z
        )
      )
      .multiply(rotationX)
      .multiply(rotationY)
      .multiply(rotationZ);
  }
  getModelTransform() {
    this.angley = turf.bearing(
      this.BerhStartPoints[0],
      this.BerhStartPoints[1]
    );
    const newPoint1 = turf.destination(
      this.BerhStartPoints[0],
      this.vParameters.berths[0].length / 1000,
      this.angley
    );

    const angle12 = turf.bearing(
      this.BerhStartPoints[1],
      this.BerhStartPoints[2]
    );

    const newPoint2 = turf.destination(
      newPoint1,
      this.BerthHeight / 1000,
      angle12
    );

    const midPoint = turf.midpoint(this.BerhStartPoints[0], newPoint2);
    this.cord = midPoint.geometry.coordinates;

    const startpos = new mapboxgl.LngLat(this.cord[0], this.cord[1]);
    // const ranglex = (this.vParameters.angleX * Math.PI) / 180;
    const altitude = 0;
    const modelAsMercatorCoordinate = mapboxgl.MercatorCoordinate.fromLngLat(
      startpos,
      0
    );
    const modelTransform = {
      translateX: mapboxgl.MercatorCoordinate.fromLngLat(startpos, altitude).x,
      translateY: mapboxgl.MercatorCoordinate.fromLngLat(startpos, altitude).y,
      translateZ: mapboxgl.MercatorCoordinate.fromLngLat(startpos, altitude).z,
      rotateX: Math.PI / 2,
      rotateY: ((90 - this.angley) * Math.PI) / 180,
      rotateZ: 0,
      scale: modelAsMercatorCoordinate.meterInMercatorCoordinateUnits(),
    };

    return modelTransform;
  }

  getCoordinates(Berth: BerthManagment.Berth) {
    const geometryCoordinates: Array<Array<number>> = [];
    if (Berth.polygon) {
      try {
        const geogson = JSON.parse(Berth.polygon);
        if (geogson.geometry && geogson.geometry.coordinates) {
          geogson.geometry.coordinates[0].forEach((item) => {
            geometryCoordinates.push([item[0], item[1]]);
          });
        }
      } catch {
        const coordinates = Berth.polygon.split(",");
        coordinates.forEach((coordinate) => {
          const latlon = coordinate.split("/");
          geometryCoordinates.push([Number(latlon[1]), Number(latlon[0])]);
        });
      }
    }

    return geometryCoordinates;
  }
  getBolardLocations() {
    return this.bolards;
  }
  addText(pos0, text, scale) {
    const myText = new Text();
    myText.text = text;

    myText.fontSize = 0.2;
    myText.outlineColor = 0xffffff;
    myText.outlineWidth = 0.03;
    //myText.letterSpacing = -0.1;
    // myText.outlineBlur = 0.08;
    myText.outlineOpacity = 0.7;

    myText.textAlign = "center";
    myText.anchorX = "center";
    myText.anchorY = "middle";
    myText.position.set(pos0.x, 5, pos0.z);
    myText.color = 0x000000;
    myText.rotation.x = -Math.PI / 2;
    myText.rotation.y = Math.PI / 2;
    myText.scale.set(scale * 5, scale * 5, scale * 5);
    this.scene.add(myText);
    this.textObjects.push(myText);
  }

  uuidv4() {
    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function(c) {
      const r = (Math.random() * 16) | 0,
        v = c == "x" ? r : (r & 0x3) | 0x8;
      return v.toString(16);
    });
  }
}
