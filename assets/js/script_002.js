import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import * as TWEEN from '@tweenjs/tween.js';
import { AnimationObjectGroup } from 'three';

window.addEventListener('DOMContentLoaded', () => {
  const app = new App3();
  app.init();
  tweenBox(app);
  app.render();
}, false);

class App3 {
  constructor() {
    this.renderer;
    this.scene;
    this.perspectiveCamera;
    this.orthographicCamera;
    this.currentCamera;
    this.axesHelper;
    this.directionalLight;
    this.ambientLight;
    this.controls;
    this.render = this.render.bind(this);
    this.shadowHelper;
    this.gridHelper;
    this.cameraHelper;

    // boxes
    this.geometory;
    this.material;
    this.box;
    this.boxAxis;

    // floor
    this.floorGeometory;
    this.floorMaterial;
    this.floor;
  }
  static get RENDERER_PARAM() {
    return {
      clearColor: 0xFFFFFF,
      width: window.innerWidth,
      height: window.innerHeight,
    };
  }
  static get CAMERA_PARAM() {
    return {
      perspective: {
        fov: 20,
        aspect: window.innerWidth / window.innerHeight,
        near: 0.1,
        far: 1000,
        x: 50,
        y: 60,
        z: 70,
      },
      orthographic: {
        left: - window.innerWidth / 50,
        right: window.innerWidth / 50,
        top: window.innerHeight / 50,
        bottom: - window.innerHeight / 50,
        near: 0.1,
        far: 1000,
        x: 50,
        y: 60,
        z: 70,
      },
      lookAt: new THREE.Vector3(0.0, 0.0, 0.0),
    }
  }
  static get FLOOR_GEOMETORY_PARAM() {
    return {
      x: 1000,
      y: 1,
      z: 1000,
    }
  }
  static get FLOOR_MATERIAL_PARAM() {
    return {
      color: 0xFFFFFF,
    }
  }
  static get BOX_GEOMETORY_PARAM() {
    return {
      x: 1,
      y: 1,
      z: 1,
    }
  }
  static get BOX_MATERIAL_PARAM() {
    return {
      color: 0x87CEEB,
    }
  }
  static get DIRECTIONAL_LIGHT_PARAM() {
    return {
      color: 0xFFFFFF,
      intensity: 1,
      x: -10,
      y: 12,
      z: 14,
      shadow: {
        mapSize: {
          width: 10240,
          height: 10240,
        },
        camera: {
          left: -100,
          right: 100,
          top: -100,
          bottom: 100,
          near: 0.5,
          far: 500,
        }
      }
    }
  }
  static get AMBIENT_LIGHT_PARAM() {
    return {
      color: 0x606060,
      intensity: 1,
    }
  }

  init() {
    this.renderer = new THREE.WebGLRenderer({ antialias: true });
    this.renderer.setClearColor(new THREE.Color(App3.RENDERER_PARAM.clearColor));
    this.renderer.setSize(App3.RENDERER_PARAM.width, App3.RENDERER_PARAM.height);
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    const wrapper = document.querySelector('#webgl');
    wrapper.appendChild(this.renderer.domElement);

    this.scene = new THREE.Scene();

    this.perspectiveCamera = new THREE.PerspectiveCamera(
      App3.CAMERA_PARAM.perspective.fov,
      App3.CAMERA_PARAM.perspective.aspect,
      App3.CAMERA_PARAM.perspective.near,
      App3.CAMERA_PARAM.perspective.far,
    );
    this.perspectiveCamera.position.set(
      App3.CAMERA_PARAM.perspective.x,
      App3.CAMERA_PARAM.perspective.y,
      App3.CAMERA_PARAM.perspective.z,
    );
    this.perspectiveCamera.lookAt(App3.CAMERA_PARAM.lookAt);
    this.scene.add(this.perspectiveCamera);
    this.orthographicCamera = new THREE.OrthographicCamera(
      App3.CAMERA_PARAM.orthographic.left,
      App3.CAMERA_PARAM.orthographic.right,
      App3.CAMERA_PARAM.orthographic.top,
      App3.CAMERA_PARAM.orthographic.bottom,
      App3.CAMERA_PARAM.orthographic.near,
      App3.CAMERA_PARAM.orthographic.far,
    );
    this.orthographicCamera.position.set(
      App3.CAMERA_PARAM.orthographic.x,
      App3.CAMERA_PARAM.orthographic.y,
      App3.CAMERA_PARAM.orthographic.z,
    );
    this.orthographicCamera.lookAt(App3.CAMERA_PARAM.lookAt);
    this.scene.add(this.orthographicCamera);

    this.currentCamera = this.perspectiveCamera;


    this.floorGeometory = new THREE.BoxGeometry(
      App3.FLOOR_GEOMETORY_PARAM.x,
      App3.FLOOR_GEOMETORY_PARAM.y,
      App3.FLOOR_GEOMETORY_PARAM.z,
    );
    this.floorMaterial = new THREE.MeshStandardMaterial(App3.FLOOR_MATERIAL_PARAM);
    this.floor = new THREE.Mesh(this.floorGeometory, this.floorMaterial);
    this.floor.position.set(
      0,
      App3.FLOOR_GEOMETORY_PARAM.y / -2,
      0,
    );
    this.floor.receiveShadow = true;
    this.scene.add(this.floor);

    this.geometory = new THREE.BoxGeometry(
      App3.BOX_GEOMETORY_PARAM.x,
      App3.BOX_GEOMETORY_PARAM.y,
      App3.BOX_GEOMETORY_PARAM.z,
    );
    this.material = new THREE.MeshStandardMaterial(App3.BOX_MATERIAL_PARAM);
    this.box = new THREE.Mesh(this.geometory, this.material);
    this.box.position.set(
      App3.BOX_GEOMETORY_PARAM.x / 2,
      App3.BOX_GEOMETORY_PARAM.y / 2,
      App3.BOX_GEOMETORY_PARAM.z / 2,
    );
    this.box.castShadow = true;
    // this.boxAxis = new THREE.AxesHelper(20);
    // this.box.add(this.boxAxis);
    this.scene.add(this.box);

    this.directionalLight = new THREE.DirectionalLight(
      App3.DIRECTIONAL_LIGHT_PARAM.color,
      App3.DIRECTIONAL_LIGHT_PARAM.intensity
    );
    this.directionalLight.position.set(
      App3.DIRECTIONAL_LIGHT_PARAM.x,
      App3.DIRECTIONAL_LIGHT_PARAM.y,
      App3.DIRECTIONAL_LIGHT_PARAM.z,
    );
    // this.directionalLight.target.set()
    this.directionalLight.castShadow = true;
    this.scene.add(this.directionalLight);

    this.directionalLight.shadow.mapSize.width = App3.DIRECTIONAL_LIGHT_PARAM.shadow.mapSize.width;
    this.directionalLight.shadow.mapSize.height = App3.DIRECTIONAL_LIGHT_PARAM.shadow.mapSize.height;
    this.directionalLight.shadow.camera.left = App3.DIRECTIONAL_LIGHT_PARAM.shadow.camera.left;
    this.directionalLight.shadow.camera.right = App3.DIRECTIONAL_LIGHT_PARAM.shadow.camera.right;
    this.directionalLight.shadow.camera.top = App3.DIRECTIONAL_LIGHT_PARAM.shadow.camera.top;
    this.directionalLight.shadow.camera.bottom = App3.DIRECTIONAL_LIGHT_PARAM.shadow.camera.bottom;
    this.directionalLight.shadow.camera.near = App3.DIRECTIONAL_LIGHT_PARAM.shadow.camera.near;
    this.directionalLight.shadow.camera.far = App3.DIRECTIONAL_LIGHT_PARAM.shadow.camera.far;

    this.ambientLight = new THREE.AmbientLight(
      App3.AMBIENT_LIGHT_PARAM.color,
      App3.AMBIENT_LIGHT_PARAM.intensity,
    );
    this.scene.add(this.ambientLight);


    // Helper
    this.controls = new OrbitControls(this.currentCamera, this.renderer.domElement);
    // this.controls.enableZoom = false;

    // this.shadowHelper = new THREE.CameraHelper(this.directionalLight.shadow.camera);
    // this.scene.add(this.shadowHelper);

    this.axesHelper = new THREE.AxesHelper(100);
    this.scene.add(this.axesHelper);

    this.gridHelper = new THREE.GridHelper(App3.FLOOR_GEOMETORY_PARAM.x, App3.FLOOR_GEOMETORY_PARAM.x / 10);
    this.scene.add(this.gridHelper);

    // this.cameraHelper = new THREE.CameraHelper(this.currentCamera);
    // this.scene.add(this.cameraHelper);
  }

  render() {
    requestAnimationFrame(this.render);
    // this.controls.update();
    TWEEN.update();
    this.renderer.render(this.scene, this.currentCamera);
  }
}

function tweenBox(app) {
  const target = {
    position: app.box.position,
    rotation: app.box.rotation,
  }
  const randomInt = Math.floor(Math.random() * 4);
  const duration = 1200;
  let tweenPosition;
  if (randomInt === 0) {
    tweenPosition = new TWEEN.Tween(target)
      .to({ position: { x: app.box.position['x'] - 1 }, rotation: { z: Math.PI / 2 } }, duration)
      .easing(TWEEN.Easing.Cubic.InOut)
      .onComplete(function () {
        app.box.rotation.set(0, 0, 0);
        tweenBox(app);
      });
  } else if (randomInt === 1) {
    tweenPosition = new TWEEN.Tween(target)
      .to({ position: { x: app.box.position['x'] + 1 }, rotation: { z: Math.PI / -2 } }, duration)
      .easing(TWEEN.Easing.Cubic.InOut)
      .onComplete(function () {
        app.box.rotation.set(0, 0, 0);
        tweenBox(app);
      });
  } else if (randomInt === 2) {
    tweenPosition = new TWEEN.Tween(target)
      .to({ position: { z: app.box.position['z'] - 1 }, rotation: { x: Math.PI / -2 } }, duration)
      .easing(TWEEN.Easing.Cubic.InOut)
      .onComplete(function () {
        app.box.rotation.set(0, 0, 0);
        tweenBox(app);
      });
  } else if (randomInt === 3) {
    tweenPosition = new TWEEN.Tween(target)
      .to({ position: { z: app.box.position['z'] + 1 }, rotation: { x: Math.PI / 2 } }, duration)
      .easing(TWEEN.Easing.Cubic.InOut)
      .onComplete(function () {
        app.box.rotation.set(0, 0, 0);
        tweenBox(app);
      });
  }
  tweenPosition.start();
}