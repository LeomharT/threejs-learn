import { AnimationAction, AnimationClip, AnimationMixer, Group, Mesh } from 'three';
import { FolderApi } from 'tweakpane';
import Experience from '../Experience';

type FoxAnimation = {
  mixer: AnimationMixer;
  action: {
    idle: AnimationAction;
    walking: AnimationAction;
    running: AnimationAction;
    current: AnimationAction;
  };
  play: (name: 'idle' | 'walking' | 'running' | 'current') => void;
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

  private _setAnimation() {
    const mixer = new AnimationMixer(this._model);
    const action = {
      idle: mixer.clipAction(this._modelAnimations[0]),
      walking: mixer.clipAction(this._modelAnimations[1]),
      running: mixer.clipAction(this._modelAnimations[2]),
      current: mixer.clipAction(this._modelAnimations[0]),
    };

    const play = (name: keyof typeof action) => {
      const newAction = this._animation.action[name];
      const oldAction = this._animation.action.current;

      newAction.reset();
      newAction.play();
      newAction.crossFadeFrom(oldAction, 1);

      this._animation.action.current = newAction;
    };

    this._animation = {
      mixer,
      action,
      play,
    };

    this._animation.play('idle');
  }

  private _debugPane() {
    this._pane = this._experience.pane.addFolder({ title: '🦊 Fox' });
    this._pane
      .addButton({
        title: 'Animation 1',
      })
      .on('click', () => {
        this._animation.play('idle');
      });
    this._pane
      .addButton({
        title: 'Animation 2',
      })
      .on('click', () => {
        this._animation.play('walking');
      });
    this._pane
      .addButton({
        title: 'Animation 3',
      })
      .on('click', () => {
        this._animation.play('running');
      });
  }

  public update() {
    this._animation.mixer.update(this._experience.time.delta * 0.001);
  }
}
