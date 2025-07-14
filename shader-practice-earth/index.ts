import {
  AxesHelper,
  Color,
  Mesh,
  PerspectiveCamera,
  Scene,
  ShaderMaterial,
  SphereGeometry,
  WebGLRenderer,
} from 'three';
import { OrbitControls, TrackballControls } from 'three/examples/jsm/Addons.js';
import Stats from 'three/examples/jsm/libs/stats.module.js';
import { Pane } from 'tweakpane';
import earthFragmentShader from './shader/earth/fragment.glsl?raw';
import earthVertexShader from './shader/earth/vertex.glsl?raw';

const el = document.querySelector('#root') as HTMLDivElement;

const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
  pixelRatio: Math.min(window.devicePixelRatio, 2),
};

/**
 * Basic
 */

const renderer = new WebGLRenderer({
  alpha: true,
  antialias: true,
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(sizes.pixelRatio);
el.append(renderer.domElement);

const scene = new Scene();
scene.background = new Color('#1e1e1e');

const camera = new PerspectiveCamera(35, sizes.width / sizes.height, 0.1, 100);
camera.position.set(3, 4, 2);
camera.lookAt(scene.position);
scene.add(camera);

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.enablePan = true;
controls.enableZoom = false;

const controls2 = new TrackballControls(camera, renderer.domElement);
controls2.noPan = true;
controls2.noRotate = true;
controls2.noZoom = false;
controls2.zoomSpeed = 1.25;

const stats = new Stats();
el.append(stats.dom);

/**
 * Scene
 */

const earthGeometry = new SphereGeometry(1.0, 32, 32);
const earthMaterial = new ShaderMaterial({
  vertexShader: earthVertexShader,
  fragmentShader: earthFragmentShader,
});

const earth = new Mesh(earthGeometry, earthMaterial);
scene.add(earth);

/**
 * Helpers
 */

const axesHelper = new AxesHelper();
scene.add(axesHelper);

/**
 * Pane
 */

const pane = new Pane({ title: '🚧🚧🚧 Debug Params 🚧🚧🚧' });
pane.element.parentElement!.style.width = '380px';

/**
 * Events
 */

function render(time: number = 0) {
  // Render
  renderer.render(scene, camera);

  // Updates
  const target = controls.target;
  controls2.target.set(target.x, target.y, target.z);

  controls.update(time);
  controls2.update();
  stats.update();

  // Animation
  requestAnimationFrame(render);
}

render();

function resize() {
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;
  sizes.pixelRatio = Math.max(2, window.devicePixelRatio);

  renderer.setSize(sizes.width, sizes.height);

  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();
}

window.addEventListener('resize', resize);
