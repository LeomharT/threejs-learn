import {
  ClampToEdgeWrapping,
  DirectionalLight,
  EquirectangularReflectionMapping,
  SRGBColorSpace,
} from 'three';
import Experience from '../Experience';

export default class Environment {
  constructor(experience: Experience) {
    this._experience = experience;

    this._setSunLight();
    this._setEnvironmentMap();
  }

  private _experience: Experience;

  private _sunLight: DirectionalLight;

  private _setSunLight() {
    this._sunLight = new DirectionalLight('#ffffff', 4.0);
    this._sunLight.castShadow = true;
    this._sunLight.shadow.camera.far = 15;
    this._sunLight.shadow.mapSize.set(1024, 1024);
    this._sunLight.shadow.normalBias = 0.05;
    this._sunLight.position.set(3.5, 2, -1.25);

    this._experience.scene.add(this._sunLight);
  }

  private _setEnvironmentMap() {
    const environmentMap = {
      texture: this._experience.resources.items.environmentMapTexture,
      intensity: 0.4,
      encoding: SRGBColorSpace,
    };

    environmentMap.texture.mapping = EquirectangularReflectionMapping;
    environmentMap.texture.wrapS = environmentMap.texture.wrapT = ClampToEdgeWrapping;

    this._experience.scene.environment = environmentMap.texture;
    this._experience.scene.environmentIntensity = environmentMap.intensity;
  }
}
