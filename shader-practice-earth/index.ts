import {
  AxesHelper,
  Color,
  IcosahedronGeometry,
  Mesh,
  MeshBasicMaterial,
  PerspectiveCamera,
  Scene,
  ShaderMaterial,
  SphereGeometry,
  Spherical,
  SRGBColorSpace,
  TextureLoader,
  Uniform,
  Vector3,
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
 * Loader
 */

const textureLoader = new TextureLoader();
textureLoader.setPath('/shader-practice-earth/assets/textures/');

/**
 * Textures
 */

const earthDayMapTexture = textureLoader.load('2k_earth_daymap.jpg');
earthDayMapTexture.anisotropy = 8;
earthDayMapTexture.colorSpace = SRGBColorSpace;

const earthNightMapTexture = textureLoader.load('2k_earth_nightmap.jpg');
earthNightMapTexture.anisotropy = 8;
earthNightMapTexture.colorSpace = SRGBColorSpace;

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
camera.position.set(5, 4, 6);
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

const sunDirection = new Vector3();
const sunSpherical = new Spherical(1.0, Math.PI / 2, 0.5);

const uniforms = {
  uSunDirection: new Uniform(new Vector3()),

  uAtmosphereDayColor: new Uniform(new Color('#00aaff')),
  uAtmosphereTwilightColor: new Uniform(new Color('#ff6600')),

  uEarthDayMapTexture: new Uniform(earthDayMapTexture),
  uEarthNightMapTexture: new Uniform(earthNightMapTexture),
};

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

const earthGeometry = new SphereGeometry(1.0, 64, 64);
const earthMaterial = new ShaderMaterial({
  vertexShader: earthVertexShader,
  fragmentShader: earthFragmentShader,
  uniforms,
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

// Sun debug
const sunPane = pane.addFolder({ title: '☀️ Sun' });
sunPane
  .addBinding(sunSpherical, 'phi', {
    step: 0.001,
    min: 0,
    max: Math.PI,
  })
  .on('change', updateSun);
sunPane
  .addBinding(sunSpherical, 'theta', {
    step: 0.001,
    min: -Math.PI,
    max: Math.PI,
  })
  .on('change', updateSun);

// Earth debug
const earthPane = pane.addFolder({ title: '🌍 Earth' });
earthPane.addBinding(uniforms.uAtmosphereDayColor, 'value', {
  color: { type: 'float' },
});
earthPane.addBinding(uniforms.uAtmosphereTwilightColor, 'value', {
  color: { type: 'float' },
});

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
