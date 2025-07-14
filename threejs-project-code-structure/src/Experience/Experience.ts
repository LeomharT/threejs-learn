import { Scene } from 'three';
import Camera from './Camera';
import Sizes from './Utils/Sizes';
import Time from './Utils/Time';

declare global {
  interface Window {
    experience: Experience;
  }
}

/**
 * All classes related to the experience will be in there
 */
export default class Experience {
  private constructor(canvas?: HTMLCanvasElement) {
    // Global access
    window.experience = this;

    // Options
    this.canvas = canvas;

    // Setup
    this.sizes = new Sizes();
    this.sizes.on('resize', () => this._resize());

    this.time = new Time();
    this.time.on('tick', () => this._update());

    this.scene = new Scene();

    this.camera = new Camera(this);
  }

  public canvas?: HTMLCanvasElement;

  public sizes: Sizes;

  public time: Time;

  public scene: Scene;

  public camera: Camera;

  private _resize() {
    console.log(this);
  }

  private _update() {}

  private static _singleInstance: Experience;

  public static getInstance(): Experience {
    if (this._singleInstance) return this._singleInstance;

    return (this._singleInstance = new Experience());
  }
}
