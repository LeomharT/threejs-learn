import { AnimationClip, Camera, Group, Texture, TextureLoader } from 'three';
import { GLTFLoader, RGBELoader } from 'three/examples/jsm/Addons.js';
import sources from '../sources.json' assert { type: 'json' };
import EventEmitter from './EventEmitter';

type GLTF = {
  animations: AnimationClip[];
  scene: Group;
  scenes: Group[];
  cameras: Camera[];
  asset: {
    copyright?: string | undefined;
    generator?: string | undefined;
    version?: string | undefined;
    minVersion?: string | undefined;
    extensions?: any;
    extras?: any;
  };
  userData: Record<string, any>;
};

export type ResourcesLoaders = {
  gltfLoader: GLTFLoader;
  rgbeLoader: RGBELoader;
  textureLoader: TextureLoader;
};

export type ResourcesItems = {
  environmentMapTexture: Texture;
  grassColorTexture: Texture;
  grassNormalTexture: Texture;
  foxModel: GLTF;
};

export default class Resources extends EventEmitter {
  constructor() {
    super();

    this._setLoaders();
    this._startLoading();
  }

  public loaders: ResourcesLoaders = {} as ResourcesLoaders;

  public items: ResourcesItems = {} as ResourcesItems;

  public toLoad: number = sources.length;

  public loaded: number = 0;

  private _setLoaders() {
    this.loaders.gltfLoader = new GLTFLoader();
    this.loaders.gltfLoader.setPath('/threejs-project-code-structure/assets/models/');

    this.loaders.rgbeLoader = new RGBELoader();
    this.loaders.rgbeLoader.setPath('/threejs-project-code-structure/assets/texture/');

    this.loaders.textureLoader = new TextureLoader();
    this.loaders.textureLoader.setPath('/threejs-project-code-structure/assets/texture/');
  }

  private _startLoading() {
    for (const source of sources) {
      switch (source.type) {
        case 'texture': {
          this.loaders.textureLoader.load(source.path, (data) => {
            this._sourceLoaded(source, data);
          });
          break;
        }

        case 'rgbeTexture': {
          this.loaders.rgbeLoader.load(source.path, (data) => {
            this._sourceLoaded(source, data);
          });
          break;
        }

        case 'gltfModel': {
          this.loaders.gltfLoader.load(source.path, (data) => {
            this._sourceLoaded(source, data);
          });
        }

        default:
          break;
      }
    }
  }

  private _sourceLoaded<T>(source: (typeof sources)[number], data: T) {
    this.items[source.name] = data;

    this.loaded++;

    if (this.loaded === this.toLoad) {
      this.trigger('ready');
    }
  }
}
