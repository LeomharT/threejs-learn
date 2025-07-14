import EventEmitter from './EventEmitter';

export default class Time extends EventEmitter {
  constructor() {
    super();

    // Setup

    this.start = Date.now();
    this.current = this.start;
    this.elapsed = 0;
    this.delta = 16;

    // Wait one frame
    requestAnimationFrame(() => {
      this.tick();
    });
  }

  public start: number;

  public current: number;

  public elapsed: number;

  public delta: number;

  public tick() {
    // Update
    const currentTime = Date.now();

    this.delta = currentTime - this.current;
    this.current = currentTime;
    this.elapsed = this.current - this.start;

    this.trigger('tick');

    // Animation
    requestAnimationFrame(() => {
      this.tick();
    });
  }
}
