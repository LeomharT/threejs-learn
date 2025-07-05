import {
  AxesHelper,
  BoxGeometry,
  BufferGeometry,
  CatmullRomCurve3,
  Clock,
  Color,
  CurvePath,
  Group,
  Line,
  LineBasicMaterial,
  Mesh,
  MeshBasicMaterial,
  PerspectiveCamera,
  Scene,
  Vector3,
  WebGLRenderer,
} from 'three';
import { OrbitControls } from 'three/examples/jsm/Addons.js';
import Stats from 'three/examples/jsm/libs/stats.module.js';

const el = document.querySelector('#root') as HTMLDivElement;

const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
  pixelRatio: window.devicePixelRatio,
};

/**
 * Basic
 */

const renderer = new WebGLRenderer({
  antialias: true,
  alpha: true,
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(sizes.pixelRatio);
el.append(renderer.domElement);

const scene = new Scene();
scene.background = new Color('#1e1e1e');

const camera = new PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 1000);
camera.position.set(5, 5, 5);
camera.lookAt(scene.position);

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.05;
controls.enablePan = false;
controls.maxDistance = 15.0;

const state = new Stats();
el.append(state.dom);

/**
 * Scenes
 */

const curvePath = new CurvePath();

const initialPoints: Vector3[] = [
  new Vector3(-5, 0, -5),
  new Vector3(5, 0, -5),
  new Vector3(5, 0, 5),
  new Vector3(-5, 0, 5),
];

const handles = new Group();

const boxGeometry = new BoxGeometry(0.1, 0.1, 0.1);
const boxMaterial = new MeshBasicMaterial();

for (const p of initialPoints) {
  const material = boxMaterial.clone();
  material.color.setRGB(Math.random(), Math.random(), Math.random());

  const box = new Mesh(boxGeometry, boxMaterial);
  box.position.copy(p);
  handles.add(box);
}
scene.add(handles);

const curve = new CatmullRomCurve3(initialPoints, true, 'centripetal');
curvePath.add(curve);

const points = curvePath.getPoints(50) as Vector3[];

// Lines
const lineGeometry = new BufferGeometry().setFromPoints(points);
const lineMaterial = new LineBasicMaterial({ color: 0x00ff00 });
const line = new Line(lineGeometry, lineMaterial);

scene.add(line);

/**
 * Helpers
 */

const axesHelper = new AxesHelper();
scene.add(axesHelper);

/**
 * Events
 */

const clock = new Clock();
let prevTime = 0;

function render(time: number = 0) {
  renderer.render(scene, camera);

  // Elapsed time
  const elapsedTime = clock.getElapsedTime();
  const deltaTime = elapsedTime - prevTime;
  prevTime = elapsedTime;

  // Update
  controls.update(deltaTime);
  state.update();

  requestAnimationFrame(render);
}
render();

function resize() {
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;
  sizes.pixelRatio = Math.min(2, window.devicePixelRatio);

  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(sizes.pixelRatio);

  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();
}

window.addEventListener('resize', resize);
