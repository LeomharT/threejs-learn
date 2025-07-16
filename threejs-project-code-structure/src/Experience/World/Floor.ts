import {
  CircleGeometry,
  Mesh,
  MeshStandardMaterial,
  RepeatWrapping,
  SRGBColorSpace,
  Texture,
} from 'three';
import Experience from '../Experience';

type FloorTextures = {
  color: Texture;
  normal: Texture;
};

export default class Floor {
  constructor(experience: Experience) {
    this._experience = experience;

    this._setGeometry();
    this._setTexture();
    this._setMaterial();
    this._setMesh();
  }

  private _experience: Experience;

  private _geometry: CircleGeometry;

  private _material: MeshStandardMaterial;

  private _texture: FloorTextures = {} as FloorTextures;

  private _mesh: Mesh;

  private _setGeometry() {
    this._geometry = new CircleGeometry(5, 64);
  }

  private _setTexture() {
    this._texture.color = this._experience.resources.items.grassColorTexture;
    this._texture.color.colorSpace = SRGBColorSpace;
    this._texture.color.repeat.set(1.5, 1.5);
    this._texture.color.wrapS = RepeatWrapping;
    this._texture.color.wrapT = RepeatWrapping;

    this._texture.normal = this._experience.resources.items.grassNormalTexture;
    this._texture.normal.repeat.set(1.5, 1.5);
    this._texture.normal.wrapS = RepeatWrapping;
    this._texture.normal.wrapT = RepeatWrapping;
  }

  private _setMaterial() {
    this._material = new MeshStandardMaterial({
      map: this._texture.color,
      normalMap: this._texture.normal,
    });
  }

  private _setMesh() {
    this._mesh = new Mesh(this._geometry, this._material);
    this._mesh.rotation.x = -Math.PI / 2;
    this._mesh.receiveShadow = true;

    this._experience.scene.add(this._mesh);
  }
}
