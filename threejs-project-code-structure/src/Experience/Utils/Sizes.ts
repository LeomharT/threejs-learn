import EventEmitter from './EventEmitter';

export default class Sizes extends EventEmitter {
  constructor() {
    super();

    // Setup
    this.updateSizes();

    // Resize events
    window.addEventListener('resize', () => {
      this.updateSizes();
      this.trigger('resize');
    });
  }

  public width: number;

  public height: number;

  public pixelRatio: number;

  public updateSizes() {
    this.width = window.innerWidth;
    this.height = window.innerHeight;
    this.pixelRatio = Math.min(window.devicePixelRatio, 2);
  }
}
