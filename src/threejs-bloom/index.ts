import {
  Color,
  IcosahedronGeometry,
  Mesh,
  MeshBasicMaterial,
  PerspectiveCamera,
  Raycaster,
  Scene,
  Vector3,
  WebGLRenderer,
} from 'three';
import { EffectComposer, OrbitControls, RenderPass } from 'three/examples/jsm/Addons.js';
import Stats from 'three/examples/jsm/libs/stats.module.js';
import { Pane } from 'tweakpane';

const el = document.querySelector('#root') as HTMLDivElement;

const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
  pixelratio: Math.min(2, window.devicePixelRatio),
};

/**
 * Basic
 */

const renderer = new WebGLRenderer({
  antialias: true,
  alpha: true,
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(sizes.pixelratio);
el.append(renderer.domElement);

const scene = new Scene();
scene.background = new Color('#1e1e1e');

const camera = new PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 500);
camera.position.set(0, 8, 8);
camera.lookAt(scene.position);

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.enablePan = false;

const stats = new Stats();
el.append(stats.dom);

/**
 * Raycaster
 */

const raycaster = new Raycaster();

const points = new Vector3();

/**
 * Post Processing
 */

const composer = new EffectComposer(renderer);
composer.setSize(sizes.width, sizes.height);
composer.setPixelRatio(sizes.pixelratio);

const renderPass = new RenderPass(scene, camera);

composer.addPass(renderPass);

/**
 * Scene
 */

const sphereGeometry = new IcosahedronGeometry(1, 3);

for (let i = 0; i < 50; i++) {
  const color = new Color();
  color.setHSL(Math.random(), 0.7, Math.random() * 0.2 + 0.05);

  const material = new MeshBasicMaterial({ color: color });
  const sphere = new Mesh(sphereGeometry, material);

  sphere.position.x = Math.random() * 10 - 5;
  sphere.position.y = Math.random() * 10 - 5;
  sphere.position.z = Math.random() * 10 - 5;
  sphere.position.normalize().multiplyScalar(Math.random() * 4.0 + 2.0);
  sphere.scale.setScalar(Math.random() * Math.random() + 0.5);

  scene.add(sphere);
}

/**
 * Pane
 */

const pane = new Pane({ title: 'Debug Params' });
pane.element.parentElement!.style.width = '380px';

/**
 * Events
 */

function render(time: number = 0) {
  //Render
  composer.render();

  // Update
  controls.update(time);
  stats.update();

  // Animation
  requestAnimationFrame(render);
}

render();

function resize() {
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;
  sizes.pixelratio = Math.min(2, window.devicePixelRatio);

  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(sizes.pixelratio);

  composer.setSize(sizes.width, sizes.height);
  composer.setPixelRatio(sizes.pixelratio);

  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();
}

window.addEventListener('resize', resize);

function onPointerMove(e: PointerEvent) {
  const x = (e.clientX / window.innerWidth) * 2 - 1;
  const y = -(e.clientY / window.innerHeight) * 2 + 1;
}

window.addEventListener('pointermove', onPointerMove);
