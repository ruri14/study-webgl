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
const axesHelper = new THREE.AxesHelper(50);
scene.add(axesHelper);

const size = 20;
const divisions = 20;

const gridHelper = new THREE.GridHelper(size, divisions);
scene.add(gridHelper);

// orbit controll
const orbitControls = new OrbitControls(camera, renderer.domElement);

//materials
const mat_white = new THREE.MeshLambertMaterial({ color: 0x000000 });
const mat_mint = new THREE.MeshLambertMaterial({ color: 0xaaf0d1 });



//-----------------------------------fan-----------------------------------
// blade
const blade = new THREE.Group();
const bladeShape = new THREE.Shape();
const x = 0, y = 0.5;
bladeShape.moveTo(x, y);
bladeShape.bezierCurveTo(x, y, x - 4, y + 1, x - 4, y + 6);
bladeShape.bezierCurveTo(x - 4, y + 6, x - 4, y + 11, x, y + 12);
bladeShape.bezierCurveTo(x, y + 12, x + 7, y + 13, x + 10, y + 10);
bladeShape.bezierCurveTo(x + 10, y + 10, x + 14, y + 6, x + 8.8, y + 2.8);
bladeShape.bezierCurveTo(x + 9, y + 3, x + 7, y + 1, x, y);
const geo_blade = new THREE.ShapeGeometry(bladeShape);

const blades = [];
for (let i = 0; i < 3; i++) {
  const bladeMesh = new THREE.Mesh(geo_blade, mat_mint);
  bladeMesh.rotateY(pi / 12);
  blades[i] = new THREE.Group();
  blades[i].add(bladeMesh);
  blade.add(blades[i]);
}
blades[1].rotateZ(pi * 2 / 3);
blades[2].rotateZ(pi * 2 / 3 * 2);

scene.add(blade);

//frame
const frame = new THREE.Group();
const wire = [];
for (let i = 0; i < 8; i++) {
  wire[i] = new THREE.Group();
  const geo_curve1 = new THREE.TorusGeometry(3, 0.15, 20, 100, pi - pi / 24);
  const wireCurve1 = new THREE.Mesh(geo_curve1, mat_mint);
  wireCurve1.position.set(-5, 0, 0);
  wire[i].add(wireCurve1);

  const geo_curve2 = new THREE.TorusGeometry(0.5, 0.15, 20, 100, pi / 2);
  const wireCurve2 = new THREE.Mesh(geo_curve2, mat_mint);
  wireCurve2.rotateX(pi);
  wireCurve2.position.set(-8.46, 0.5, 0);
  wire[i].add(wireCurve2);

  const geo_curve3 = new THREE.CylinderGeometry(0.15, 0.15, 3.2, 20);
  const wireCurve3 = new THREE.Mesh(geo_curve3, mat_mint);
  wireCurve3.rotateZ(pi / 2);
  wireCurve3.position.set(-10, 0, 0);
  wire[i].add(wireCurve3);

  const geo_curve4 = new THREE.TorusGeometry(4, 0.15, 20, 100, pi);
  const wireCurve4 = new THREE.Mesh(geo_curve4, mat_mint);
  wireCurve4.rotateX(pi / 2);
  wireCurve4.rotateZ(pi / 2);
  wireCurve4.position.set(-11.5, 0, -3.99);
  wire[i].add(wireCurve4);

  const wireCurve5 = new THREE.Mesh(geo_curve3, mat_mint);
  wireCurve5.scale.set(1, 2, 1);
  wireCurve5.rotateZ(pi / 2);
  wireCurve5.position.set(-8.3, 0, -8);
  wire[i].add(wireCurve5);

  wire[i].rotateZ(pi / 4 * i);
  frame.add(wire[i]);
}

const geo_circle = new THREE.CylinderGeometry(4.2, 4.2, 0.15, 32);
const circle = new THREE.Mesh(geo_circle, mat_mint);
circle.rotateX(pi / 2);
circle.position.set(0, 0, 0.2);
frame.add(circle);
frame.position.set(0, 0, 2);

const geo_torus1 = new THREE.TorusGeometry(13.5, 0.15, 20, 100);
const torus1 = new THREE.Mesh(geo_torus1, mat_mint);
torus1.position.set(0, 0, -0.85);
frame.add(torus1);

const geo_torus2 = new THREE.TorusGeometry(15.25, 0.15, 20, 100);
const torus2 = new THREE.Mesh(geo_torus2, mat_mint);
torus2.position.set(0, 0, -4);
frame.add(torus2);

const geo_torus3 = new THREE.TorusGeometry(13.5, 0.15, 20, 100);
const torus3 = new THREE.Mesh(geo_torus3, mat_mint);
torus3.position.set(0, 0, -7.15);
frame.add(torus3);

const geo_capsule = new THREE.CapsuleGeometry(6, 3, 32, 100);
const mortor = new THREE.Mesh(geo_capsule, mat_mint);
mortor.rotateX(pi / 2);
mortor.position.set(0, 0, -11);
frame.add(mortor);
scene.add(frame);

//-------------------------------------------------------------------------

// keybord events
let isDown = false;
window.addEventListener('keydown', (keyEvent) => {
  switch (keyEvent.key) {
    case ' ':
      isDown = true;
      break;
    default:
  }
}, false);
window.addEventListener('keyup', (keyEvent) => {
  isDown = false;
}, false);

//render
const render = function () {
  window.requestAnimationFrame(render);
  orbitControls.update();
  if (isDown === true) {
    blade.rotation.z += 1;
  }
  renderer.render(scene, camera);
};

render();
