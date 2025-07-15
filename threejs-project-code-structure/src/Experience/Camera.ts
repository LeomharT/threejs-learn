import { PerspectiveCamera } from 'three';
import { OrbitControls, TrackballControls } from 'three/examples/jsm/Addons.js';
import Experience from './Experience';

export default class Camera {
  constructor(experience: Experience) {
    this._experience = experience;

    // Setup

    this._setInstance();
    this._setControls();
  }

  private _experience: Experience;

  public instance: PerspectiveCamera;

  private _controls: OrbitControls;

  private _controls2: TrackballControls;

  private _setInstance() {
    this.instance = new PerspectiveCamera(
      35,
      this._experience.sizes.width / this._experience.sizes.height,
      0.1,
      1000
    );

    this.instance.position.set(6, 4, 8);
    this._experience.scene.add(this.instance);
  }

  private _setControls() {
    this._controls = new OrbitControls(this.instance, this._experience.canvas);
    this._controls.enableDamping = true;
    this._controls.enablePan = false;
    this._controls.enableZoom = false;

    this._controls2 = new TrackballControls(this.instance, this._experience.canvas);
    this._controls2.noPan = true;
    this._controls2.noRotate = true;
    this._controls2.noZoom = false;
    this._controls2.zoomSpeed = 1.5;
  }

  public resize() {
    this.instance.aspect = this._experience.sizes.width / this._experience.sizes.height;
    this.instance.updateProjectionMatrix();
  }

  public update(time: number) {
    const target = this._controls.target;
    this._controls.update(time);

    this._controls2.target.set(target.x, target.y, target.z);
    this._controls2.update();
  }
}
