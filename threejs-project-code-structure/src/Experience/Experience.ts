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
  constructor(canvas?: HTMLCanvasElement) {
    // Global access
    window.experience = this;

    // Options
    this.canvas = canvas;

    // Setup

    this.sizes = new Sizes();
    this.sizes.on('resize', () => this._resize());

    this.time = new Time();
    this.time.on('tick', () => this._update());
  }

  public canvas?: HTMLCanvasElement;

  public sizes: Sizes;

  public time: Time;

  private _resize() {
    console.log(this);
  }

  private _update() {}
}
