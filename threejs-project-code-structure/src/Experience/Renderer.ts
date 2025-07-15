import { CineonToneMapping, PCFSoftShadowMap, SRGBColorSpace, WebGLRenderer } from 'three';
import { FolderApi } from 'tweakpane';
import Experience from './Experience';

export default class Renderer {
  constructor(experience: Experience) {
    this._experience = experience;

    this._setInstance();
    this._debugPane();
  }

  private _experience: Experience;

  private _pane: FolderApi;

  public instance: WebGLRenderer;

  private _setInstance() {
    this.instance = new WebGLRenderer({
      alpha: true,
      antialias: true,
    });
    this.instance.toneMapping = CineonToneMapping;
    this.instance.toneMappingExposure = 1.2;
    this.instance.outputColorSpace = SRGBColorSpace;
    this.instance.shadowMap.enabled = true;
    this.instance.shadowMap.type = PCFSoftShadowMap;
    this.instance.setClearColor('#211D20');
    this.instance.setSize(this._experience.sizes.width, this._experience.sizes.height);
    this.instance.setPixelRatio(this._experience.sizes.pixelRatio);
  }

  private _debugPane() {
    this._pane = this._experience.pane.addFolder({ title: '🎨 Renderer' });
    this._pane.addBinding(this.instance, 'toneMappingExposure', {
      step: 0.001,
      max: 5.0,
      min: 1.0,
    });
  }

  public render() {
    this.instance.render(this._experience.scene, this._experience.camera.instance);
  }

  public resize() {
    this.instance.setSize(this._experience.sizes.width, this._experience.sizes.height);
  }
}
