import { AnimationAction, AnimationClip, AnimationMixer, Group, Mesh } from 'three';
import { FolderApi } from 'tweakpane';
import Experience from '../Experience';

type FoxAnimation = {
  mixer: AnimationMixer;
  action: AnimationAction;
};

export default class Fox {
  constructor(experience: Experience) {
    this._experience = experience;

    this._setModel();
    this._setAnimation();
    this._debugPane();
  }

  private _experience: Experience;

  private _model: Group;

  private _modelAnimations: AnimationClip[];

  private _animation: FoxAnimation;

  private _pane: FolderApi;

  private _setModel() {
    // Setup model scene
    this._model = this._experience.resources.items.foxModel.scene;
    this._model.scale.setScalar(0.02);

    // Setup model animations
    this._modelAnimations = this._experience.resources.items.foxModel.animations;

    // Cast shadow
    this._model.traverse((mesh) => {
      if (mesh instanceof Mesh) {
        mesh.castShadow = true;
      }
    });

    this._experience.scene.add(this._model);
  }

  private _setAnimation(index: number = 0) {
    const mixer = new AnimationMixer(this._model);
    const action = mixer.clipAction(this._modelAnimations[index]);

    this._animation = {
      mixer,
      action,
    };

    this._animation.action.play();
  }

  private _debugPane() {
    this._pane = this._experience.pane.addFolder({ title: '🦊 Fox' });
    this._pane
      .addButton({
        title: 'Animation 1',
      })
      .on('click', () => {
        this._setAnimation(0);
      });
    this._pane
      .addButton({
        title: 'Animation 2',
      })
      .on('click', () => {
        this._setAnimation(1);
      });
  }

  public update() {
    this._animation.mixer.update(this._experience.time.delta * 0.001);
  }
}
