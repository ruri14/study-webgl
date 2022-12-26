import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { FontLoader } from 'three/addons/loaders/FontLoader.js';
import { TextGeometry } from 'three/addons/geometries/TextGeometry.js';

// for convenience
const pi = Math.PI;

const scene = new THREE.Scene();
const h = window.innerHeight,
  w = window.innerWidth;
const aspectRatio = w / h,
  fieldOfView = 45,
  nearPlane = 1,
  farPlane = 1000;
const canvas = document.querySelector('#webgl');
const camera = new THREE.PerspectiveCamera(
  fieldOfView,
  aspectRatio,
  nearPlane,
  farPlane
);
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
  alpha: true,
  antialias: true
});

const dpi = window.devicePixelRatio;
renderer.setSize(w * dpi, h * dpi);
const theCanvas = document.getElementById("webgl");
theCanvas.style.width = `${w}px`;
theCanvas.style.height = `${h}px`;

renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
document.body.appendChild(renderer.domElement);

//camera
if (w > h) {
  camera.position.set(30, 30, 30);
  camera.lookAt(new THREE.Vector3(0, 0, 0));
} else {
  camera.position.set(40, 40, 40);
  camera.lookAt(new THREE.Vector3(0, 0, 0));
}

//lights, 3 point lighting
const col_light = 0xffffff; // set

const light = new THREE.AmbientLight(col_light, 0.6);

const keyLight = new THREE.DirectionalLight(col_light, 0.6);
keyLight.position.set(30, 20, 10);


keyLight.castShadow = true;
keyLight.shadow.camera.top = 30;

// const shadowHelper = new THREE.CameraHelper(keyLight.shadow.camera);
// scene.add(shadowHelper);

const fillLight = new THREE.DirectionalLight(col_light, 0.3);
fillLight.position.set(-20, 20, 20);

const backLight = new THREE.DirectionalLight(col_light, 0.1);
backLight.position.set(10, 0, -20);

scene.add(light);
scene.add(keyLight);
scene.add(fillLight);
scene.add(backLight);

// axis
// const axesHelper = new THREE.AxesHelper(50);
// scene.add(axesHelper);

// orbit controll
const orbitControls = new OrbitControls(camera, renderer.domElement);

//materials
const mat_white = new THREE.MeshLambertMaterial({ color: 0x000000 });


//-----------------------------------box-----------------------------------
const box = [];
const geo_box = new THREE.BoxGeometry(2, 2, 2);
// const box = new THREE.Mesh(geo_box, mat_white);
// scene.add(box);

for (let i = 0; i < 5; i++) {
  for (let j = 0; j < 5; j++) {
    for (let k = 0; k < 5; k++) {
      // const mat_box = new THREE.MeshLambertMaterial({ color: new THREE.Color("rgb(0, 0, 0)") })
      const mat_box = new THREE.MeshStandardMaterial({ color: new THREE.Color(`rgb(${0 + 64 * i},${0 + 64 * j},${0 + 64 * k})`) });
      box[i, j, k] = new THREE.Mesh(geo_box, mat_box);
      box[i, j, k].position.set(
        -8 + i * 4,
        -8 + j * 4,
        -8 + k * 4,
      )
      scene.add(box[i, j, k]);
    }
  }
}

//render
const render = function () {
  window.requestAnimationFrame(render);
  orbitControls.update();
  renderer.render(scene, camera);
};

render();
