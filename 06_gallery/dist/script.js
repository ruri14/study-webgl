import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import * as TWEEN from '@tweenjs/tween.js';


// ------------------------------ for convenience ------------------------------
const pi = Math.PI;

const scene = new THREE.Scene();
let h, w;
h = window.innerHeight;
w = window.innerWidth;

const aspectRatio = w / h,
  fieldOfView = 20,
  nearPlane = 1,
  farPlane = 1000;
const canvas = document.querySelector('#canvas');
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

// const dpi = window.devicePixelRatio;
// renderer.setSize(w * dpi, h * dpi);
// const theCanvas = document.getElementById("webgl");
// theCanvas.style.width = `${w}px`;
// theCanvas.style.height = `${h}px`;
renderer.setSize(w, h);

renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;

//camera
camera.position.set(0, 0, 180);
camera.lookAt(new THREE.Vector3(0, 0, 0));

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

// const size = 20;
// const divisions = 20;
// const gridHelper = new THREE.GridHelper(size, divisions);
// scene.add(gridHelper);

// orbit controll
// const orbitControls = new OrbitControls(camera, renderer.domElement);

//materials
const mat_white = new THREE.MeshLambertMaterial({ color: 0xffffff });
const mat_gray = new THREE.MeshLambertMaterial({ color: 0x999999 });


//------------------------------ board ------------------------------
const loader = new THREE.TextureLoader();
const geo_board = new THREE.PlaneGeometry(18, 12);
const boardNum = 19;

const boards = [];
for (let i = 0; i < boardNum; i++) {
  const id = ('000' + (i + 1)).slice(-3);
  const mat_board = new THREE.MeshStandardMaterial({
    map: loader.load(`./dist/images/photos/${id}.JPG`)
  });
  const mesh = new THREE.Mesh(geo_board, mat_board);
  mesh.position.set(20 * Math.floor(i / 4), 14 * (-i % 4) + 21, 0);
  scene.add(mesh);
  boards.push(mesh);
}

//------------------------------ momentum scroll ------------------------------
function lerp(x, y, a) {
  return x + (y - x) * easeOutQuad(a);
}
function scalePercent(start, end) {
  return (inertialScrollPercent - start) / (end - start);
}
function easeOutQuad(x) {
  let t = x; const b = 0; const c = 1; const d = 1;
  return -c * (t /= d) * (t - 2) + b;
}

let inertialScroll = 0;
let inertialScrollPercent = 0;

const animationScripts = [
  {
    start: 0,
    end: 100,
    func: () => {
      camera.position.x = lerp(
        0, 20 * Math.floor(boardNum / 4), scalePercent(0, 100)
      );
    }
  }
];

function playScrollAnimations() {
  animationScripts.forEach((item) => {
    if (inertialScrollPercent >= item.start && inertialScrollPercent < item.end) {
      item.func();
    }
  });
}

function setScrollPercent() {
  inertialScroll +=
    ((document.documentElement.scrollTop || document.body.scrollTop) - inertialScroll) * 0.08;
  inertialScrollPercent = (inertialScroll / ((document.documentElement.scrollHeight || document.body.scrollHeight) - document.documentElement.clientHeight) * 100).toFixed(2);
}


//------------------------------ raycaster ------------------------------

// hover
const mouse = new THREE.Vector2();
canvas.addEventListener('mousemove', handleMouseMove);

function handleMouseMove(event) {
  const element = event.currentTarget;
  const x = event.clientX - element.offsetLeft;
  const y = event.clientY - element.offsetTop;
  const w = element.offsetWidth;
  const h = element.offsetHeight;
  mouse.x = (x / w) * 2 - 1;
  mouse.y = -(y / h) * 2 + 1;
}

const raycaster = new THREE.Raycaster();
const boardsStatus = [...Array(boards.length)].map(() => 0);
tick();
function tick() {
  raycaster.setFromCamera(mouse, camera);
  const intersects = raycaster.intersectObjects(boards);
  boards.forEach((e, i) => {
    if (intersects.length > 0 && e === intersects[0].object && boardsStatus[i] === 0) {
      boardHoverOn(e);
      boardsStatus[i] = 1;
    } else if (intersects.length > 0 && e !== intersects[0].object && boardsStatus[i] === 1) {
      boardHoverOff(e);
      boardsStatus[i] = 0;
    } else if (intersects.length === 0 && boardsStatus[i] === 1) {
      boardHoverOff(e);
      boardsStatus[i] = 0;
    }
  });
  renderer.render(scene, camera);
  setScrollPercent();
  playScrollAnimations();
  TWEEN.update();
  requestAnimationFrame(tick);
}

// click
const modal = document.querySelector('.modal'), modalBg = document.querySelector('.modalBg'), modalClose = document.querySelector('.modalClose'), modalFigure = document.querySelector('.modal__figure'), modalContent = document.querySelector('.modal__content');
canvas.addEventListener('click', () => {
  raycaster.setFromCamera(mouse, camera);
  const intersects = raycaster.intersectObjects(boards);
  boards.forEach((e, i) => {
    if (intersects.length > 0 && e === intersects[0].object) {
      boardHoverOff(e);
      modalFigure.innerHTML = `<img src="./dist/images/photos/${id}.JPG">`
      modal.classList.add('is-open');
      modalBg.classList.add('is-open');
      document.body.style.overflow = "hidden";
    }
  });
});

modalBg.addEventListener('click', () => {
  modal.classList.remove('is-open');
  modalBg.classList.remove('is-open');
  document.body.style.overflow = "auto";
})
modalClose.addEventListener('click', () => {
  modal.classList.remove('is-open');
  modalBg.classList.remove('is-open');
  document.body.style.overflow = "auto";
})



//------------------------------ render ------------------------------
// const render = function () {
//   renderer.render(scene, camera);
//   // orbitControls.update();

//   setScrollPercent();
//   playScrollAnimations();

//   // raycaster.setFromCamera(pointer, camera);
//   // const intersects = raycaster.intersectObjects(scene.children);
//   // console.log(intersects);
//   // for (let i = 0; i < intersects.length; i++) {
//   //   intersects[i].object.material.color.set(0xff0000);
//   // }
//   window.requestAnimationFrame(render);
// };
// window.addEventListener('pointermove', onPointerMove);
// render();


//------------------------------ animation function ------------------------------

function boardHoverOn(object) {
  const target = {
    position: object.position,
  }
  const duration = 100;
  let tween;
  tween = new TWEEN.Tween(target)
    .to({ position: { z: -5 } }, duration)
    .start();
};

function boardHoverOff(object) {
  const target = {
    position: object.position,
  }
  const duration = 100;
  let tween;
  tween = new TWEEN.Tween(target)
    .to({ position: { z: 0 } }, duration)
    .start();
};