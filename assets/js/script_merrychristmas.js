import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import * as TWEEN from '@tweenjs/tween.js';
import { AnimationObjectGroup } from 'three';

let myFont = new FontFace(
  'Rubik Spray Paint',
  "url(https://fonts.gstatic.com/l/font?kit=WnzhHBAoeBPUDTB4EWR82y6EXWPH-Ro7QoCBZCZF0UfG155FAppa600&skey=174ec27ca854506c&v=v1) format('woff2')"
);

myFont.load().then((font) => {
  document.fonts.add(font);
  console.log("Font loaded");
});

const playButton = document.querySelector('#playButton');

playButton.addEventListener('click', () => {
  playButton.classList.add('is-open');
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
    this.pointLight;
    this.controls;
    this.render = this.render.bind(this);
    this.shadowHelper;
    this.gridHelper;
    this.cameraHelper;

    // boxes
    this.geometry;
    this.material;
    this.box;
    this.boxAxis;

    // floor
    this.floorGeometry;
    this.floorMaterial;
    this.floor;
  }
  static get RENDERER_PARAM() {
    return {
      clearColor: 0x191970,
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
        y: 80,
        z: 60,
      },
      orthographic: {
        left: - window.innerWidth / 50,
        right: window.innerWidth / 50,
        top: window.innerHeight / 50,
        bottom: - window.innerHeight / 50,
        near: 0.1,
        far: 1000,
        x: 20,
        y: 72,
        z: 68,
        zoom: 4,
      },
      lookAt: new THREE.Vector3(10.5, 0, 1.5),
    }
  }
  static get FLOOR_GEOMETRY_PARAM() {
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
  static get BOX_GEOMETRY_PARAM() {
    return {
      x: 1,
      y: 1,
      z: 1,
    }
  }
  static get BOX_MATERIAL_PARAM() {
    return {
      // color: 0xC93A40,
      color: 0xFFFFFF,
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
      color: 0x0066FF,
      // color: 0x030890,
      intensity: 0.1,
    }
  }
  static get POINT_LIGHT_PARAM() {
    return {
      color: 0xFAFAD2,
      intensity: 2.5,
      distance: 30,
      decay: 2,
      x: 20,
      y: 5,
      z: -10,
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
    this.orthographicCamera.zoom = App3.CAMERA_PARAM.orthographic.zoom;
    this.orthographicCamera.updateProjectionMatrix();
    this.scene.add(this.orthographicCamera);

    this.currentCamera = this.orthographicCamera;


    this.floorGeometry = new THREE.BoxGeometry(
      App3.FLOOR_GEOMETRY_PARAM.x,
      App3.FLOOR_GEOMETRY_PARAM.y,
      App3.FLOOR_GEOMETRY_PARAM.z,
    );
    this.floorMaterial = new THREE.MeshStandardMaterial(App3.FLOOR_MATERIAL_PARAM);
    this.floor = new THREE.Mesh(this.floorGeometry, this.floorMaterial);
    this.floor.position.set(
      0,
      App3.FLOOR_GEOMETRY_PARAM.y / -2,
      0,
    );
    // this.floor.receiveShadow = true;
    this.scene.add(this.floor);

    this.geometry = new THREE.BoxGeometry(
      App3.BOX_GEOMETRY_PARAM.x,
      App3.BOX_GEOMETRY_PARAM.y,
      App3.BOX_GEOMETRY_PARAM.z,
    );
    this.material = new THREE.MeshStandardMaterial(App3.BOX_MATERIAL_PARAM);
    this.material.transparent = true;
    this.material.opacity = 0;
    this.box = new THREE.Mesh(this.geometry, this.material);
    this.box.position.set(
      App3.BOX_GEOMETRY_PARAM.x / 2,
      App3.BOX_GEOMETRY_PARAM.y / 2,
      App3.BOX_GEOMETRY_PARAM.z / 2,
    );
    this.box.castShadow = true;
    // this.boxAxis = new THREE.AxesHelper(20);
    // this.box.add(this.boxAxis);
    this.scene.add(this.box);

    this.pointLight = new THREE.PointLight(
      App3.POINT_LIGHT_PARAM.color,
      App3.POINT_LIGHT_PARAM.intensity,
      App3.POINT_LIGHT_PARAM.distance,
      App3.POINT_LIGHT_PARAM.decay
    );
    this.pointLight.position.set(
      App3.POINT_LIGHT_PARAM.x,
      App3.POINT_LIGHT_PARAM.y,
      App3.POINT_LIGHT_PARAM.z,
    )
    this.scene.add(this.pointLight);

    this.ambientLight = new THREE.AmbientLight(
      App3.AMBIENT_LIGHT_PARAM.color,
      App3.AMBIENT_LIGHT_PARAM.intensity,
    );
    this.scene.add(this.ambientLight);

    // Helper
    // this.controls = new OrbitControls(this.currentCamera, this.renderer.domElement);
    // this.controls.enableZoom = false;

    // this.shadowHelper = new THREE.CameraHelper(this.directionalLight.shadow.camera);
    // this.scene.add(this.shadowHelper);

    // this.axesHelper = new THREE.AxesHelper(100);
    // this.scene.add(this.axesHelper);

    // this.gridHelper = new THREE.GridHelper(App3.FLOOR_GEOMETRY_PARAM.x, App3.FLOOR_GEOMETRY_PARAM.x / 10);
    // this.scene.add(this.gridHelper);

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
  const directions = ["r", "r", "r", "r", "r", "r", "r", "r", "d", "r", "r", "r", "r", "r", "r", "r", "r", "r"];
  const text = ["-", "-", "-", "M", "e", "r", "r", "y", "C", "h", "r", "i", "s", "t", "m", "a", "s"];
  const target = {
    position: app.box.position,
    rotation: app.box.rotation,
  }

  const soundBox = new Audio('./assets/sounds/box.mp3');
  const soundBell = new Audio('./assets/sounds/bell.mp3');

  const duration = 700;
  let xi = 1;
  let zi = 1;
  var firstTween;
  var earlierTween = firstTween;
  directions.forEach((e, i) => {
    if (e === "r") {
      var tween = new TWEEN.Tween(target)
        .to({ position: { x: target.position['x'] + xi }, rotation: { z: Math.PI / -2 } }, duration)
        .easing(TWEEN.Easing.Cubic.InOut)
        .onComplete(function () {
          app.box.rotation.set(0, 0, 0);
          if (text[i] !== "-") {
            printText(app, text[i]);
          }
          soundBox.play();
        });
      xi += 1;
    } else {
      var tween = new TWEEN.Tween(target)
        .to({ position: { z: target.position['z'] + zi }, rotation: { x: Math.PI / 2 } }, duration)
        .easing(TWEEN.Easing.Cubic.InOut)
        .onComplete(function () {
          app.box.rotation.set(0, 0, 0);
          if (text[i] !== "-") {
            printText(app, text[i]);
          }
          soundBox.play();
        });
      zi += 1;
    }
    if (i === 0) {
      firstTween = tween;
    } else {
      earlierTween.chain(tween);
    }
    if (i === (directions.length - 1)) {
      tween.onComplete(function () {
        soundBox.play();
        setTimeout(() => {
          app.scene.remove(app.box);
          addHeart(app);
          soundBell.play();
        }, 600);
      })
    }
    earlierTween = tween;
  });
  firstTween.start();
}

function printText(app, letter) {
  if (letter !== "-") {
    const ctx = document.createElement('canvas').getContext('2d');
    ctx.canvas.width = 100;
    ctx.canvas.height = 100;

    ctx.fillStyle = '#FFF';
    ctx.fillRect(0, 0, 100, 100);

    // ctx.fillStyle = '#fff';
    ctx.font = '100px Rubik Spray Paint';
    ctx.strokeText(letter, 10, 90);
    const texture = new THREE.CanvasTexture(ctx.canvas);
    const material = new THREE.MeshStandardMaterial({
      map: texture,
    });
    const text = new THREE.Mesh(app.geometry, material);
    text.position.set(
      app.box.position['x'],
      text.geometry.parameters.width / -2 + 0.0001,
      app.box.position['z'],
    );
    app.scene.add(text);
  }
}

function addHeart(app) {
  const x = -0.25, y = 0;

  const heartShape = new THREE.Shape();

  heartShape.moveTo(x + 0.25, y + 0.25);
  heartShape.bezierCurveTo(x + 0.25, y + 0.25, x + 0.2, y, x, y);
  heartShape.bezierCurveTo(x - 0.3, y, x - 0.3, y + 0.35, x - 0.3, y + 0.35);
  heartShape.bezierCurveTo(x - 0.3, y + 0.55, x - 0.15, y + 0.77, x + 0.25, y + 0.95);
  heartShape.bezierCurveTo(x + 0.6, y + 0.77, x + 0.8, y + 0.55, x + 0.8, y + 0.35);
  heartShape.bezierCurveTo(x + 0.8, y + 0.35, x + 0.8, y, x + 0.5, y);
  heartShape.bezierCurveTo(x + 0.35, y, x + 0.25, y + 0.25, x + 0.25, y + 0.25);

  const geometry = new THREE.ShapeGeometry(heartShape);
  geometry.translate(0, 0, 0);
  const material = new THREE.MeshBasicMaterial({ color: 0xC93A40 });
  const mesh1 = new THREE.Mesh(geometry, material);
  mesh1.rotation['x'] = Math.PI;
  mesh1.position.set(
    app.box.position['x'], 1, app.box.position['z']
  );
  const mesh2 = new THREE.Mesh(geometry, material);
  mesh2.rotation['x'] = Math.PI;
  mesh2.rotation['y'] = Math.PI;
  mesh2.position.set(
    app.box.position['x'], 1, app.box.position['z']
  );
  app.scene.add(mesh1);
  app.scene.add(mesh2);

  var tween1 = new TWEEN.Tween(mesh1.rotation)
    .to({ y: Math.PI * 2 }, 4000)
    .repeat(Infinity)
  var tween2 = new TWEEN.Tween(mesh2.rotation)
    .to({ y: Math.PI * 3 }, 4000)
    .repeat(Infinity)
  tween1.start();
  tween2.start();
}