import {
  AxesHelper,
  BoxGeometry,
  Clock,
  Color,
  Layers,
  Mesh,
  MeshBasicMaterial,
  PerspectiveCamera,
  Raycaster,
  RepeatWrapping,
  Scene,
  TextureLoader,
  Vector2,
  Vector3,
  WebGLRenderer,
} from 'three';
import {
  EffectComposer,
  FXAAShader,
  OrbitControls,
  OutlinePass,
  OutputPass,
  RenderPass,
  ShaderPass,
} from 'three/examples/jsm/Addons.js';
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
 * Loaders
 */

const textureLoader = new TextureLoader();
textureLoader.setPath('/texture/');

/**
 * Postprocess
 */

const composer = new EffectComposer(renderer);
composer.setSize(sizes.width, sizes.height);
composer.setPixelRatio(sizes.pixelRatio);

const renderPass = new RenderPass(scene, camera);

const fxaaPass = new ShaderPass(FXAAShader);
fxaaPass.uniforms['resolution'].value.set(1 / sizes.width, 1 / sizes.height);

const outlinePass = new OutlinePass(new Vector2(sizes.width, sizes.height), scene, camera);
textureLoader.load('tri_pattern.jpg', (texture) => {
  texture.wrapS = RepeatWrapping;
  texture.wrapT = RepeatWrapping;

  outlinePass.patternTexture = texture;
});
outlinePass.edgeStrength = 3.0;
outlinePass.edgeThickness = 1.0;
outlinePass.edgeGlow = 0.0;
outlinePass.usePatternTexture = true;
outlinePass.pulsePeriod = 0.0;

const outputPass = new OutputPass();

composer.addPass(renderPass);
composer.addPass(fxaaPass);
composer.addPass(outlinePass);
composer.addPass(outputPass);

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
  material.color = new Color().setRGB(Math.random(), Math.random(), Math.random());

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

/**
 * Pane
 */

const pane = new Pane({ title: '🛠️ Debug Params' });
pane.element.parentElement!.style.width = '380px';

const outlinePane = pane.addFolder({ title: '⭕ Outline Params' });
outlinePane.addBinding(outlinePass, 'edgeStrength', {
  min: 0.01,
  max: 10,
  step: 0.01,
  label: 'Edge Strength',
});
outlinePane.addBinding(outlinePass, 'edgeThickness', {
  min: 1,
  max: 5,
  step: 0.01,
  label: 'Edge Thickness',
});
outlinePane.addBinding(outlinePass, 'edgeGlow', {
  min: 0.0,
  max: 1.0,
  step: 0.01,
  label: 'Edge Glow',
});
outlinePane.addBinding(outlinePass, 'pulsePeriod', {
  min: 0.0,
  max: 5.0,
  step: 0.01,
  label: 'Pulse Period',
});
outlinePane.addBinding(outlinePass, 'usePatternTexture', {
  label: 'Use Pattern Texture',
});

/**
 * Events
 */

let INTERSECTED: undefined | Mesh;

const pointer = new Vector2();

const subscribe: Function[] = [];

function intersectMeshes() {
  raycaster.setFromCamera(pointer, camera);

  const intersect = raycaster.intersectObjects(scene.children, false);

  if (intersect.length) {
    if (intersect[0].object instanceof Mesh) INTERSECTED = intersect[0].object;
  } else {
    if (INTERSECTED) {
      INTERSECTED = undefined;
    }
  }

  if (INTERSECTED) {
    outlinePass.selectedObjects = [INTERSECTED];
  } else {
    // Always has selection
    // outlinePass.selectedObjects = [];
  }
}

addFrameLoop(intersectMeshes);

function addFrameLoop(fn: (delta: number) => void) {
  subscribe.push(fn);
}

function removeFrameLoop(fn: (delta: number) => void) {
  const index = subscribe.indexOf(fn);

  if (index !== -1) {
    subscribe.splice(index, 1);
  }
}

const clock = new Clock();
let prevTime = 0;

function render(time: number = 0) {
  // Render
  composer.render();

  // Delta time
  const elapsedTime = clock.getElapsedTime();
  const deltaTime = elapsedTime - prevTime;
  prevTime = elapsedTime;

  // Update
  controls.update(time);
  stats.update();

  requestAnimationFrame(render);

  // Frame evnets
  for (const fn of subscribe) {
    fn.call({}, deltaTime);
  }
}
render();

function resize() {
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;
  sizes.pixelRatio = Math.min(2, window.devicePixelRatio);

  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(sizes.pixelRatio);

  composer.setSize(sizes.width, sizes.height);
  composer.setPixelRatio(sizes.pixelRatio);

  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();
}

window.addEventListener('resize', resize);

function onPointerMove(e: PointerEvent) {
  const x = (e.clientX / sizes.width) * 2 - 1;
  const y = -(e.clientY / sizes.height) * 2 + 1;

  pointer.x = x;
  pointer.y = y;
}

window.addEventListener('pointermove', onPointerMove);
