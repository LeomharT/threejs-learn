import {
  Color,
  IcosahedronGeometry,
  Mesh,
  MeshBasicMaterial,
  PerspectiveCamera,
  Scene,
  ShaderMaterial,
  SphereGeometry,
  Spherical,
  Uniform,
  Vector3,
  WebGLRenderer,
} from 'three';
import { OrbitControls } from 'three/examples/jsm/Addons.js';
import Stats from 'three/examples/jsm/libs/stats.module.js';
import { Pane } from 'tweakpane';
import fragmentShader from './shader/fragment.glsl?raw';
import vertexShader from './shader/vertex.glsl?raw';

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
  alpha: true,
  antialias: true,
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(sizes.pixelratio);
el.append(renderer.domElement);

const scene = new Scene();
scene.background = new Color('#1e1e1e');

const camera = new PerspectiveCamera(65, sizes.width / sizes.height, 0.1, 1000);
camera.position.set(3, 3, 3);
camera.lookAt(scene.position);

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.enablePan = false;

const stats = new Stats();
el.append(stats.dom);

/**
 * Scenes
 */
const sunSpherical = new Spherical(1.0, Math.PI / 2, 0.5);
const sunDirection = new Vector3();

const uniforms = {
  uSunDirection: new Uniform(new Vector3()),
};

const sphereGeometry = new SphereGeometry(1, 64, 64);
const sphereMaterial = new ShaderMaterial({
  fragmentShader,
  vertexShader,
  uniforms,
  wireframe: false,
});
const sphere = new Mesh(sphereGeometry, sphereMaterial);
scene.add(sphere);

const sunGeometry = new IcosahedronGeometry(0.1, 3);
const sunMaterial = new MeshBasicMaterial({ color: 'yellow' });
const sun = new Mesh(sunGeometry, sunMaterial);

function updateSun() {
  // Direction
  sunDirection.setFromSpherical(sunSpherical);

  // Position
  sun.position.copy(sunDirection).multiplyScalar(3.0);

  // Uniform
  uniforms.uSunDirection.value.copy(sunDirection);
}
updateSun();

scene.add(sun);

/**
 * Pane
 */

const pane = new Pane({ title: '🚧🚧🚧Debug Params🚧🚧🚧' });
pane.element.parentElement!.style.width = '380px';

const earthPane = pane.addFolder({ title: '🌍 Earth' });
earthPane.addBinding(sphereMaterial, 'wireframe');

const sunPane = pane.addFolder({ title: '☀️ Sun' });
sunPane
  .addBinding(sunSpherical, 'phi', {
    min: 0,
    max: Math.PI,
    step: 0.001,
    label: 'Phi',
  })
  .on('change', updateSun);

sunPane
  .addBinding(sunSpherical, 'theta', {
    min: -Math.PI,
    max: Math.PI,
    step: 0.001,
    label: 'Theta',
  })
  .on('change', updateSun);

/**
 * Events
 */

function render(time: number = 0) {
  //Render
  renderer.render(scene, camera);

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
  sizes.pixelratio = Math.min(window.devicePixelRatio);

  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(sizes.pixelratio);

  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();
}
window.addEventListener('resize', resize);
