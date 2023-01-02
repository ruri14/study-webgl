import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';


// for convenience
const pi = Math.PI;

const scene = new THREE.Scene();
let h, w;
if (window.innerWidth <= 500) {
  h = w = window.innerWidth - 10;
} else {
  h = w = 380;
}
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

const composer = new EffectComposer(renderer);

//camera
camera.position.set(0, 0, 50);
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
const mat_white = new THREE.MeshLambertMaterial({ color: 0x000000 });
const mat_baige = new THREE.MeshLambertMaterial({ color: 0xC5BAA9 });
const mat_lightbaige = new THREE.MeshLambertMaterial({ color: 0xD5CAB9 });
const mat_kahki = new THREE.MeshLambertMaterial({ color: 0x686C33 });
const mat_moss = new THREE.MeshLambertMaterial({ color: 0x8AAAA5 });
const mat_brown = new THREE.MeshLambertMaterial({ color: 0xA5956D });
const mat_lightbrown = new THREE.MeshLambertMaterial({ color: 0xCABD9A });
const mat_blue = new THREE.MeshLambertMaterial({ color: 0x64829B });
const mat_lightblue = new THREE.MeshLambertMaterial({ color: 0xA0C4DC });



//-----------------------------------fan-----------------------------------
const fanHead = new THREE.Group();
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
  const bladeMesh = new THREE.Mesh(geo_blade, mat_lightbrown);
  bladeMesh.rotateY(pi / 12);
  blades[i] = new THREE.Group();
  blades[i].add(bladeMesh);
  blade.add(blades[i]);
}
blades[1].rotateZ(pi * 2 / 3);
blades[2].rotateZ(pi * 2 / 3 * 2);

fanHead.add(blade);

//frame
const frame = new THREE.Group();
const wire = [];
for (let i = 0; i < 8; i++) {
  wire[i] = new THREE.Group();
  const geo_curve1 = new THREE.TorusGeometry(3, 0.15, 20, 100, pi - pi / 24);
  const wireCurve1 = new THREE.Mesh(geo_curve1, mat_brown);
  wireCurve1.position.set(-5, 0, 0);
  wire[i].add(wireCurve1);

  const geo_curve2 = new THREE.TorusGeometry(0.5, 0.15, 20, 100, pi / 2);
  const wireCurve2 = new THREE.Mesh(geo_curve2, mat_brown);
  wireCurve2.rotateX(pi);
  wireCurve2.position.set(-8.46, 0.5, 0);
  wire[i].add(wireCurve2);

  const geo_curve3 = new THREE.CylinderGeometry(0.15, 0.15, 3.2, 20);
  const wireCurve3 = new THREE.Mesh(geo_curve3, mat_brown);
  wireCurve3.rotateZ(pi / 2);
  wireCurve3.position.set(-10, 0, 0);
  wire[i].add(wireCurve3);

  const geo_curve4 = new THREE.TorusGeometry(4, 0.15, 20, 100, pi);
  const wireCurve4 = new THREE.Mesh(geo_curve4, mat_brown);
  wireCurve4.rotateX(pi / 2);
  wireCurve4.rotateZ(pi / 2);
  wireCurve4.position.set(-11.5, 0, -3.99);
  wire[i].add(wireCurve4);

  const wireCurve5 = new THREE.Mesh(geo_curve3, mat_brown);
  wireCurve5.scale.set(1, 2, 1);
  wireCurve5.rotateZ(pi / 2);
  wireCurve5.position.set(-8.3, 0, -8);
  wire[i].add(wireCurve5);

  wire[i].rotateZ(pi / 4 * i);
  frame.add(wire[i]);
}

const geo_circle = new THREE.CylinderGeometry(4.2, 4.2, 0.15, 32);
const circle = new THREE.Mesh(geo_circle, mat_brown);
circle.rotateX(pi / 2);
circle.position.set(0, 0, 0.2);
frame.add(circle);
frame.position.set(0, 0, 2);

const geo_torus1 = new THREE.TorusGeometry(13.5, 0.15, 20, 100);
const torus1 = new THREE.Mesh(geo_torus1, mat_brown);
torus1.position.set(0, 0, -0.85);
frame.add(torus1);

const geo_torus2 = new THREE.TorusGeometry(15.25, 0.15, 20, 100);
const torus2 = new THREE.Mesh(geo_torus2, mat_brown);
torus2.position.set(0, 0, -4);
frame.add(torus2);

const geo_torus3 = new THREE.TorusGeometry(13.5, 0.15, 20, 100);
const torus3 = new THREE.Mesh(geo_torus3, mat_brown);
torus3.position.set(0, 0, -7.15);
frame.add(torus3);

fanHead.add(frame);

const geo_capsule = new THREE.CapsuleGeometry(6, 3, 32, 100);
const mortor = new THREE.Mesh(geo_capsule, mat_brown);
mortor.rotateX(pi / 2);
mortor.position.set(0, 0, -10);
fanHead.add(mortor);

fanHead.position.set(0, 0, 10);
const fanHeadWrap = new THREE.Group();
fanHeadWrap.add(fanHead);

scene.add(fanHeadWrap);

//-----------------------------------wall-----------------------------------
const geo_wall = new THREE.BoxGeometry(100, 100, 1);
const wall = new THREE.Mesh(geo_wall, mat_blue);
wall.position.set(0, 0, -20);
wall.receiveShadow = true;

scene.add(wall);

//-----------------------------------render-----------------------------------

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

// renderer
let fanAngle = 0;
let fanFlag = 0;
// const render = function () {
//   window.requestAnimationFrame(render);
//   // orbitControls.update();
//   if (isDown === true) {
//     blade.rotation.z += 1;
//     if (fanFlag === 0) {
//       fanHeadWrap.rotation.y += 0.008;
//       fanAngle += 0.01;
//       if (fanAngle > 1) {
//         fanFlag = 1;
//       }
//     } else {
//       fanHeadWrap.rotation.y -= 0.008;
//       fanAngle -= 0.01;
//       if (fanAngle < -1) {
//         fanFlag = 0;
//       }
//     }
//   }
//   renderer.render(scene, camera);
// };
// render();

// composer
const animate = function () {
  window.requestAnimationFrame(animate);
  if (window.innerWidth >= 500) {
    if (isDown === true) {
      blade.rotation.z += 1;
      if (fanFlag === 0) {
        fanHeadWrap.rotation.y += 0.005;
        fanAngle += 0.005;
        if (fanAngle > 1) {
          fanFlag = 1;
        }
      } else {
        fanHeadWrap.rotation.y -= 0.005;
        fanAngle -= 0.005;
        if (fanAngle < -1) {
          fanFlag = 0;
        }
      }
    }
  } else {
    blade.rotation.z += 1;
    if (fanFlag === 0) {
      fanHeadWrap.rotation.y += 0.005;
      fanAngle += 0.005;
      if (fanAngle > 1) {
        fanFlag = 1;
      }
    } else {
      fanHeadWrap.rotation.y -= 0.005;
      fanAngle -= 0.005;
      if (fanAngle < -1) {
        fanFlag = 0;
      }
    }
  }
  composer.render();
}

import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
const renderPass = new RenderPass(scene, camera);
composer.addPass(renderPass);

const passList = [
  'AdaptiveToneMapping',
  'Afterimage',
  'Bloom',
  'Bokeh',
  'Clear',
  'CubeTexture',
  'DotScreen',
  'Film',
  'Glitch',
  'Halftone',
  'LUT',
  'Mask',
  'Outline',
  'SAO',
  'Save',
  'Shader',
  'SMAA',
  'SSAARender',
  'SSAO',
  'SSR',
  'SSRr',
  'TAARender',
  'Texture',
  'UnrealBloom'
]

import { AdaptiveToneMappingPass } from 'three/addons/postprocessing/AdaptiveToneMappingPass.js';
const _AdaptiveToneMappingPass = new AdaptiveToneMappingPass();

import { AfterimagePass } from 'three/addons/postprocessing/AfterimagePass.js';
const _AfterimagePass = new AfterimagePass();

import { BloomPass } from 'three/addons/postprocessing/BloomPass.js';
const _BloomPass = new BloomPass();

// import { BokehPass } from 'three/addons/postprocessing/BokehPass.js';
// const _BokehPass = new BokehPass();

import { ClearPass } from 'three/addons/postprocessing/ClearPass.js';
const _ClearPass = new ClearPass();

import { CubeTexturePass } from 'three/addons/postprocessing/CubeTexturePass.js';
const _CubeTexturePass = new CubeTexturePass();

import { DotScreenPass } from 'three/addons/postprocessing/DotScreenPass.js';
const _DotScreenPass = new DotScreenPass();

import { FilmPass } from 'three/addons/postprocessing/FilmPass.js';
const _FilmPass = new FilmPass();

import { GlitchPass } from 'three/addons/postprocessing/GlitchPass.js';
const _GlitchPass = new GlitchPass();

import { HalftonePass } from 'three/addons/postprocessing/HalftonePass.js';
const _HalftonePass = new HalftonePass();

import { LUTPass } from 'three/addons/postprocessing/LUTPass.js';
const _LUTPass = new LUTPass();

import { MaskPass } from 'three/addons/postprocessing/MaskPass.js';
const _MaskPass = new MaskPass();

// import { OutlinePass } from 'three/addons/postprocessing/OutlinePass.js';
// const _OutlinePass = new OutlinePass();

// import { SAOPass } from 'three/addons/postprocessing/SAOPass.js';
// const _SAOPass = new SAOPass();

import { SavePass } from 'three/addons/postprocessing/SavePass.js';
const _SavePass = new SavePass();

import { ShaderPass } from 'three/addons/postprocessing/ShaderPass.js';
const _ShaderPass = new ShaderPass();

import { SMAAPass } from 'three/addons/postprocessing/SMAAPass.js';
const _SMAAPass = new SMAAPass();

import { SSAARenderPass } from 'three/addons/postprocessing/SSAARenderPass.js';
const _SSAARenderPass = new SSAARenderPass();

// import { SSAOPass } from 'three/addons/postprocessing/SSAOPass.js';
// const _SSAOPass = new SSAOPass();

// import { SSRPass } from 'three/addons/postprocessing/SSRPass.js';
// const _SSRPass = new SSRPass();

// import { SSRrPass } from 'three/addons/postprocessing/SSRrPass.js';
// const _SSRrPass = new SSRrPass();

import { TAARenderPass } from 'three/addons/postprocessing/TAARenderPass.js';
const _TAARenderPass = new TAARenderPass();

import { TexturePass } from 'three/addons/postprocessing/TexturePass.js';
const _TexturePass = new TexturePass();

import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';
const _UnrealBloomPass = new UnrealBloomPass();

// composer.addPass(_AdaptiveToneMappingPass);
// composer.addPass(_AfterimagePass);   // none
// composer.addPass(_BloomPass);  // all white
// composer.addPass(_ClearPass);  // all white
// composer.addPass(_CubeTexturePass);  // error
// composer.addPass(_DotScreenPass);
// composer.addPass(_FilmPass);
// composer.addPass(_GlitchPass);
// composer.addPass(_HalftonePass);
// composer.addPass(_LUTPass);  // all black
// composer.addPass(_MaskPass);  // error
// composer.addPass(_SavePass);  // all white
// composer.addPass(_ShaderPass);  // error
// composer.addPass(_SMAAPass);  // none
// composer.addPass(_SSAARenderPass);  // error
// composer.addPass(_TAARenderPass);  // error
// composer.addPass(_TexturePass);  // all white
// composer.addPass(_UnrealBloomPass);

const filterButton = document.querySelectorAll('.js-filter');
filterButton.forEach(e => {
  e.addEventListener('click', () => {
    console.log(e.dataset.filter);
    if (e.dataset.filter != 'Normal') {
      composer.addPass(eval(`_${e.dataset.filter}Pass`));
    }
  })
})
animate();
