import { Scene } from 'three';
import { Pane } from 'tweakpane';
import Camera from './Camera';
import Renderer from './Renderer';
import Resources from './Utils/Resources';
import Sizes from './Utils/Sizes';
import Time from './Utils/Time';
import World from './World/World';

declare global {
  interface Window {
    experience: Experience;
  }
}

/**
 * All classes related to the experience will be in there
 */
export default class Experience {
  private constructor() {
    // Global access
    window.experience = this;

    // Setup
    this.sizes = new Sizes();
    this.sizes.on('resize', () => this._resize());

    this.time = new Time();
    this.time.on('tick', () => this._update());

    this._setPane();

    this.renderer = new Renderer(this);

    this.canvas = this.renderer.instance.domElement;

    this.scene = new Scene();

    this.camera = new Camera(this);

    this.resources = new Resources();

    this.world = new World(this);
  }

  public canvas: HTMLCanvasElement;

  public sizes: Sizes;

  public time: Time;

  public renderer: Renderer;

  public scene: Scene;

  public camera: Camera;

  public resources: Resources;

  public world: World;

  public pane: Pane;

  private _resize() {
    this.renderer.resize();
    this.camera.resize();
  }

  private _update() {
    // Render
    this.renderer.render();

    // Update
    this.camera.update(this.time.elapsed);
  }

  private _setPane() {
    this.pane = new Pane({ title: '🚧Debug Params🚧' });
    this.pane.element.parentElement!.style.width = '380px';

    if (window.location.hash !== '#debug') {
      this.pane.element.parentElement!.remove();
    }
  }

  private static _singleInstance: Experience;

  public static getInstance(): Experience {
    if (this._singleInstance) return this._singleInstance;

    return (this._singleInstance = new Experience());
  }
}
