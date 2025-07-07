import {
  AxesHelper,
  BoxGeometry,
  Color,
  Layers,
  Mesh,
  MeshBasicMaterial,
  PerspectiveCamera,
  Raycaster,
  Scene,
  Vector2,
  Vector3,
  WebGLRenderer,
} from 'three';
import { OrbitControls } from 'three/examples/jsm/Addons.js';
import Stats from 'three/examples/jsm/libs/stats.module.js';
import { Pane } from 'tweakpane';

const el = document.querySelector('#root') as HTMLDivElement;

const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
  pixelRatio: Math.min(2, window.devicePixelRatio),
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
camera.position.set(0, 5, 5);
camera.lookAt(scene.position);

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.enablePan = false;

const stats = new Stats();
el.append(stats.dom);

/**
 * Postprocess
 */

/**
 * Layers
 */

const BLOOM_SCENE = 1;

const bloomLayer = new Layers();
bloomLayer.set(BLOOM_SCENE);

/**
 * Scenes
 */

const points = [
  new Vector3(-2, 2 - 0),
  new Vector3(2, 2 - 0),
  new Vector3(-2, -2 - 0),
  new Vector3(2, -2 - 0),
];

const boxGeometry = new BoxGeometry(1, 1, 1);
const boxMaterial = new MeshBasicMaterial({});

for (const p of points) {
  const material = boxMaterial.clone();
  material.color = new Color().setRGB(
    Math.random(),
    Math.random(),
    Math.random()
  );

  const box = new Mesh(boxGeometry, material);
  box.position.copy(p);
  scene.add(box);
}

/**
 * Raycaster
 */

const raycaster = new Raycaster();

/**
 * Helpers
 */

const axesHelper = new AxesHelper(10);
scene.add(axesHelper);

/**
 * Pane
 */

const pane = new Pane({ title: '🛠️ Debug Params' });
pane.element.parentElement!.style.width = '380px';

/**
 * Events
 */

function render(time: number = 0) {
  // Render
  renderer.render(scene, camera);

  // Update
  controls.update(time);
  stats.update();

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

function onPointerMove(e: PointerEvent) {
  const x = (e.clientX / sizes.width) * 2 - 1;
  const y = -(e.clientY / sizes.height) * 2 + 1;

  raycaster.setFromCamera(new Vector2(x, y), camera);

  const intersect = raycaster.intersectObject(scene);

  if (intersect.length) {
    if (intersect[0].object instanceof Mesh) {
      if (intersect[0].object.material instanceof MeshBasicMaterial) {
        intersect[0].object.material.color = new Color('red');
      }
    }
  }
}

window.addEventListener('pointermove', onPointerMove);
