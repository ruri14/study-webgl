import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { FontLoader } from 'three/addons/loaders/FontLoader.js';
import { TextGeometry } from 'three/addons/geometries/TextGeometry.js';
import * as TWEEN from '@tweenjs/tween.js';

const playButton = document.querySelector('#playButton');

playButton.addEventListener('click', () => {
  const soundBox = new Audio('./assets/sounds/star.mp3');
  setTimeout(() => { soundBox.play(); }, 2000);
  playButton.classList.add('is-open');
  render();
}, false);


// for convenience
var pi = Math.PI;

var scene = new THREE.Scene();
var h = window.innerHeight,
  w = window.innerWidth;
var aspectRatio = w / h,
  fieldOfView = 45,
  nearPlane = 1,
  farPlane = 1000;
var camera = new THREE.PerspectiveCamera(
  fieldOfView,
  aspectRatio,
  nearPlane,
  farPlane
);
var renderer = new THREE.WebGLRenderer({
  canvas: webgl,
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
camera.position.set(25, 7, 0);
camera.lookAt(new THREE.Vector3(0, 4, 0));

//lights, 3 point lighting
var col_light = 0xffffff; // set

var light = new THREE.AmbientLight(col_light, 0.6);

var keyLight = new THREE.DirectionalLight(col_light, 0.6);
keyLight.position.set(30, 20, 10);

keyLight.castShadow = true;
keyLight.shadow.camera.top = 30;

// var shadowHelper = new THREE.CameraHelper(keyLight.shadow.camera);
// scene.add(shadowHelper);

var fillLight = new THREE.DirectionalLight(col_light, 0.3);
fillLight.position.set(-20, 20, 20);

var backLight = new THREE.DirectionalLight(col_light, 0.1);
backLight.position.set(10, 0, -20);

scene.add(light);
scene.add(keyLight);
scene.add(fillLight);
scene.add(backLight);

// axis
// var axesHelper = new THREE.AxesHelper(50);
// scene.add(axesHelper);

// orbit controll
// var orbitControls = new OrbitControls(camera, renderer.domElement);

//materials
var mat_white = new THREE.MeshLambertMaterial({ color: 0xffffff });
var mat_green = new THREE.MeshLambertMaterial({ color: 0x374028 });
var mat_grey = new THREE.MeshLambertMaterial({ color: 0xf3f2f7 });
var mat_yellow = new THREE.MeshLambertMaterial({ color: 0xFEAE73 });
var mat_orange = new THREE.MeshLambertMaterial({ color: 0xFEAE73 });
var mat_dark = new THREE.MeshLambertMaterial({ color: 0x4e3b2f });
var mat_brown = new THREE.MeshLambertMaterial({ color: 0x4e3b2f });
var mat_red = new THREE.MeshLambertMaterial({ color: 0x78383c });
var mat_gold = new THREE.MeshLambertMaterial({ color: 0xFEBE80 });
var mat_silver = new THREE.MeshLambertMaterial({ color: 0xebedf1 });
// var mat_white = new THREE.MeshLambertMaterial({ color: 0xffffff });
// var mat_green = new THREE.MeshLambertMaterial({ color: 0x2D4628 });
// var mat_grey = new THREE.MeshLambertMaterial({ color: 0xf3f2f7 });
// var mat_yellow = new THREE.MeshLambertMaterial({ color: 0xFEAE73 });
// var mat_orange = new THREE.MeshLambertMaterial({ color: 0xFEAE73 });
// var mat_dark = new THREE.MeshLambertMaterial({ color: 0x696752 });
// var mat_brown = new THREE.MeshLambertMaterial({ color: 0x696752 });
// var mat_red = new THREE.MeshLambertMaterial({ color: 0x760007 });
// var mat_gold = new THREE.MeshLambertMaterial({ color: 0xf2d299 });

//-------------------------------------ground-------------------------------------
var layers = [];
var ground = new THREE.Group();
for (var i = 0; i < 5; i++) {
  var h = 0.1;
  var geometry = new THREE.CylinderGeometry(8 - i - 0.01, 8 - i, h, 9);
  layers.push(new THREE.Mesh(geometry, mat_white));
  layers[i].position.y = h * i;
  layers[i].receiveShadow = true;
  ground.add(layers[i]);
}
layers[0].scale.x = 0.8;
layers[1].scale.set(0.77, 1, 0.91);
layers[1].rotation.y = ((2 * pi) / 9) * 0.6;
layers[2].scale.set(0.8, 1, 0.91);
layers[2].rotation.y = ((2 * pi) / 9) * 0.3;
layers[3].scale.set(0.75, 1, 0.92);
layers[3].rotation.y = ((2 * pi) / 9) * 0.7;
layers[4].scale.set(0.7, 1, 0.93);
layers[4].rotation.y = ((2 * pi) / 9) * 0.9;

var geo_base = new THREE.CylinderGeometry(8, 1, 10, 9);
var base = new THREE.Mesh(geo_base, mat_dark);
base.scale.x = layers[0].scale.x;
base.position.y = -5;
ground.add(base);

scene.add(ground);

//-------------------------------------tree-------------------------------------
var tree = new THREE.Group();

//leaf
var geo_cone = new THREE.ConeGeometry(2, 4, 7, 1, true);
var cone = [];

for (var i = 0; i < 3; i++) {
  cone[i] = new THREE.Mesh(geo_cone, mat_green);
  cone[i].castShadow = true;
  cone[i].receiveShadow = true;
  tree.add(cone[i]);
}

cone[0].position.set(-2, 9, -2);
cone[0].scale.set(0.8, 0.8, 0.8);

cone[1].position.set(-2, 7.45, -2);
cone[1].scale.set(1.1, 1.1, 1.1);
cone[1].rotateY(pi / 6);

cone[2].position.set(-2, 5.5, -2);
cone[2].scale.set(1.4, 1.4, 1.4);
cone[2].rotateY(pi / 4);

//stem
var geo_stem = new THREE.CylinderGeometry(0.6, 0.6, 4, 5);
var stem = new THREE.Mesh(geo_stem, mat_brown);
stem.position.set(-2, 2, -2);
stem.castShadow = true;
stem.receiveShadow = true;
tree.add(stem);

//star
var geo_star = new THREE.IcosahedronGeometry(0.5, 0);
var star = new THREE.Mesh(geo_star, mat_yellow);
star.position.set(-2, 10.8, -2);
star.castShadow = true;
tree.add(star);

//treelights
var goldlights = [];
var silverlights = [];
for (var i = 0; i < 9; i++) {
  goldlights[i] = new THREE.Mesh(geo_star, mat_gold);
  goldlights[i].scale.set(0.3, 0.3, 0.3);
  goldlights[i].castShadow = true;
  goldlights[i].receiveShadow = true;
  tree.add(goldlights[i]);
}
for (var i = 0; i < 9; i++) {
  silverlights[i] = new THREE.Mesh(geo_star, mat_silver);
  silverlights[i].scale.set(0.3, 0.3, 0.3);
  silverlights[i].castShadow = true;
  silverlights[i].receiveShadow = true;
  tree.add(silverlights[i]);
}

silverlights[0].position.set(-2.2, 8.8, -1.1);
goldlights[0].position.set(-1, 8.5, -1.4);
silverlights[1].position.set(-0.9, 8.1, -2.5);
goldlights[1].position.set(-1.8, 7.7, -3.3);
silverlights[2].position.set(-3.1, 7.2, -3);
goldlights[2].position.set(-3.5, 6.8, -1.8);
silverlights[3].position.set(-2.9, 6.4, -0.7);
goldlights[3].position.set(-1.5, 6.1, -0.3);
silverlights[4].position.set(-0.2, 5.9, -1.4);
goldlights[4].position.set(-0.25, 5.6, -2.8);
silverlights[5].position.set(-1.2, 5.3, -3.9);
goldlights[5].position.set(-2.9, 4.9, -3.6);
silverlights[6].position.set(-3.8, 4.6, -2);
goldlights[6].position.set(-3.2, 4.3, -0.5);
silverlights[7].position.set(-1.2, 4, -0.1);
goldlights[7].position.set(0.2, 3.8, -1.4);
silverlights[8].position.set(0, 3.5, -3);
goldlights[8].position.set(-0.9, 3.25, -4.3);

tree.position.set(0, 0, -1);

scene.add(tree);


//-------------------------------------snowman-------------------------------------
var snowman = new THREE.Group();

//body
var geo_snowball = new THREE.IcosahedronGeometry(1, 0);
var snowmanBody = [];
for (var i = 0; i < 3; i++) {
  snowmanBody[i] = new THREE.Mesh(geo_snowball, mat_white);
  snowmanBody[i].castShadow = true;
  snowmanBody[i].receiveShadow = true;
  snowman.add(snowmanBody[i]);
}
snowmanBody[0].position.set(0, 0.8, 5);
snowmanBody[0].scale.set(1.5, 1.5, 1.5);
snowmanBody[1].position.set(0, 2.5, 5);
snowmanBody[1].rotateY(pi / 3);
snowmanBody[1].scale.set(1.3, 1.3, 1.3);
snowmanBody[2].position.set(0, 4.2, 5);
snowmanBody[2].rotateY(pi / 6);
snowmanBody[2].scale.set(1.2, 1.2, 1.2);

//eyes
var geo_eye = new THREE.SphereGeometry(0.11, 8, 8);
var eyes = [];
for (var i = 0; i < 2; i++) {
  eyes[i] = new THREE.Mesh(geo_eye, mat_dark);
  snowman.add(eyes[i]);
  eyes[i].castShadow = true;
}
eyes[0].position.set(0.88, 4.65, 4.95);
eyes[1].position.set(0.55, 4.65, 4.35);

//carrot
var geo_carrot = new THREE.ConeGeometry(0.2, 1, 6);
var carrot = new THREE.Mesh(geo_carrot, mat_orange);
carrot.position.set(1.2, 4.5, 4.45);
carrot.rotateZ(pi / -2.5);
carrot.rotateX(pi / -10);
carrot.castShadow = true;
snowman.add(carrot);

//branch
var branch = [];
for (var i = 0; i < 3; i++) {
  branch[i] = new THREE.Mesh(geo_snowball, mat_brown);
  branch[i].scale.set(0.08, 0.08, 1);
  branch[i].castShadow = true;
  snowman.add(branch[i]);
}
branch[0].rotateX(pi / -6);
branch[0].rotateY(pi / 6);
branch[0].position.set(0.35, 3, 6.7);

branch[1].scale.set(0.07, 0.07, 0.4);
branch[1].rotateX(pi / -3);
branch[1].rotateY(pi / 8);
branch[1].position.set(0.55, 3.35, 7);

branch[2].rotateX(pi / 5);
branch[2].rotateY(pi / -8);
branch[2].position.set(0.15, 3.2, 3.5);

scene.add(snowman);

//-------------------------------------Texts-------------------------------------
var present = new THREE.Group();

const loader = new FontLoader();

var text1 = ["M", "E", "R", "R", "Y"]
var text2 = ["C", "H", "R", "I", "S", "T", "M", "A", "S"];
var mesh_text1 = [];
var mesh_text2 = [];
loader.load('./assets/fonts/Chango_Regular.json', (font) => {
  text1.forEach((e, i) => {
    var geo_m = new TextGeometry(e, {
      font: font,
      size: 1,
      height: 1,
      // curveSegments: 12,
      // bevelEnabled: true,
      // bevelThickness: 10,
      // bevelSize: 8,
      // bevelOffset: 0,
      // bevelSegments: 5
    });
    mesh_text1[i] = new THREE.Mesh(geo_m, mat_red);
    mesh_text1[i].rotateY(pi / 2);
    mesh_text1[i].castShadow = true;
    scene.add(mesh_text1[i]);
  });
  text2.forEach((e, i) => {
    var geo_m = new TextGeometry(e, {
      font: font,
      size: 0.8,
      height: 0.8,
      // curveSegments: 12,
      // bevelEnabled: true,
      // bevelThickness: 10,
      // bevelSize: 8,
      // bevelOffset: 0,
      // bevelSegments: 5
    });
    mesh_text2[i] = new THREE.Mesh(geo_m, mat_gold);
    mesh_text2[i].rotateY(pi / 2);
    mesh_text2[i].castShadow = true;
    scene.add(mesh_text2[i]);
  });
  mesh_text1[0].scale.set(2, 2, 1);
  mesh_text1[0].position.set(0, 0.45, 3.5);
  mesh_text1[1].position.set(0, 1.4, 0.5);
  mesh_text2[2].scale.set(1.2, 1.2, 1.2)
  mesh_text2[2].position.set(0, 0.45, 0.5);
  mesh_text1[3].position.set(0, 0.45, -0.7);
  mesh_text1[4].position.set(0, 0.45, -1.9);

  mesh_text2[0].scale.set(2, 2, 1);
  mesh_text2[0].position.set(3, 0.1, 5.5);
  mesh_text2[1].position.set(3.9, 0.2, 3.5);
  mesh_text1[2].scale.set(0.8, 0.8, 0.8);
  mesh_text1[2].position.set(5, 0.2, 2.2);
  mesh_text2[3].position.set(3.7, 0.2, 1.2);
  mesh_text2[4].position.set(4.8, 0.1, 0.5);
  mesh_text2[4].position.set(4.8, 0.05, 0.5);
  mesh_text2[5].position.set(4.8, -0.1, -0.65);
  mesh_text2[5].rotateZ(pi / 6);
  mesh_text2[6].position.set(4, 0.1, -1.5);
  mesh_text2[7].position.set(4.5, 0.1, -2.8);
  mesh_text2[8].position.set(3.6, 0, -4);
});



//render
var render = function () {
  requestAnimationFrame(render);
  // orbitControls.update();
  TWEEN.update();
  renderer.render(scene, camera);
  // console.log(goldlights[0].material.color);
};
// tween();


// function tween() {
//   goldlights.forEach(e => {
//     const target = e.material.color;
//     var tween = TWEEN.Tween(target)
//       .to({ mat_silver }, 100)
//     tween.start();
//   })
// }