import {
  Color,
  IcosahedronGeometry,
  Layers,
  Material,
  Mesh,
  MeshBasicMaterial,
  Object3D,
  PerspectiveCamera,
  Raycaster,
  ReinhardToneMapping,
  Scene,
  ShaderMaterial,
  Uniform,
  Vector2,
  WebGLRenderer,
} from 'three';
import {
  EffectComposer,
  OrbitControls,
  OutputPass,
  RenderPass,
  ShaderPass,
  UnrealBloomPass,
} from 'three/examples/jsm/Addons.js';
import Stats from 'three/examples/jsm/libs/stats.module.js';
import { Pane } from 'tweakpane';
import fragmentShader from './fragment.glsl?raw';
import vertexShader from './vertex.glsl?raw';

const el = document.querySelector('#root') as HTMLDivElement;

const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
  pixelratio: Math.min(2, window.devicePixelRatio),
};

const darkMaterial = new MeshBasicMaterial({ color: 'black' });
const materials: Record<string, Material> = {};

/**
 * Layers
 */

const BLOOM_LAYER = 1;
const layers = new Layers();
layers.set(BLOOM_LAYER);

/**
 * Basic
 */

const renderer = new WebGLRenderer({
  antialias: true,
  alpha: true,
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(sizes.pixelratio);
renderer.toneMapping = ReinhardToneMapping;
el.append(renderer.domElement);

const scene = new Scene();
scene.background = new Color('#000000');

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

const mouse = new Vector2();

/**
 * Post Processing
 */

const finalComposer = new EffectComposer(renderer);
finalComposer.setSize(sizes.width, sizes.height);
finalComposer.setPixelRatio(sizes.pixelratio);

const bloomComposer = new EffectComposer(renderer);
// Do not render bloom effect to the screen
bloomComposer.renderToScreen = false;

const renderPass = new RenderPass(scene, camera);

const bloomPass = new UnrealBloomPass(new Vector2(sizes.width, sizes.height), 1.5, 0.4, 0.0);

const mixPass = new ShaderPass(
  new ShaderMaterial({
    vertexShader,
    fragmentShader,
    uniforms: {
      baseTexture: new Uniform(null),
      bloomTexture: new Uniform(bloomComposer.renderTarget2.texture),
    },
    defines: {},
  }),
  'baseTexture'
);

const outputPass = new OutputPass();

bloomComposer.addPass(renderPass);
bloomComposer.addPass(bloomPass);

finalComposer.addPass(renderPass);
finalComposer.addPass(mixPass);
finalComposer.addPass(outputPass);

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

const folder = pane.addFolder({
  title: '🌟 Bloom',
});
folder.addBinding(bloomPass, 'radius', {
  min: 0,
  max: 1.0,
  step: 0.01,
});
folder.addBinding(bloomPass, 'strength', {
  min: 0,
  max: 3.0,
  step: 0.01,
});
folder.addBinding(bloomPass, 'threshold', {
  min: 0,
  max: 1.0,
  step: 0.01,
});

/**
 * Events
 */

function darkenNoneBloomed(obj: Object3D) {
  if (obj instanceof Mesh && layers.test(obj.layers) === false) {
    materials[obj.uuid] = obj.material as Material;
    obj.material = darkMaterial;
  }
}

function restoreMaterial(obj: Object3D) {
  if (materials[obj.uuid]) {
    (obj as Mesh).material = materials[obj.uuid];
    delete materials[obj.uuid];
  }
}

function render(time: number = 0) {
  //Render
  scene.traverse(darkenNoneBloomed);
  bloomComposer.render();
  scene.traverse(restoreMaterial);

  finalComposer.render();

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

  finalComposer.setSize(sizes.width, sizes.height);
  finalComposer.setPixelRatio(sizes.pixelratio);

  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();
}

window.addEventListener('resize', resize);

function onPointerDown(e: PointerEvent) {
  mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;

  raycaster.setFromCamera(mouse, camera);

  const intersects = raycaster.intersectObjects(scene.children);

  if (intersects.length > 0) {
    const object = intersects[0].object;
    object.layers.toggle(BLOOM_LAYER);
  }
}

window.addEventListener('pointerdown', onPointerDown);
