import { BoxGeometry, Mesh, MeshStandardMaterial } from 'three';
import Experience from '../Experience';
import Environment from './Environment';
import Floor from './Floor';

export default class World {
  constructor(experience: Experience) {
    this._experience = experience;

    // Wait for resources
    this._experience.resources.on('ready', () => {
      // Setup
      this.environment = new Environment(experience);

      // Floor
      this.floor = new Floor(experience);

      // Test
      const testGeometry = new BoxGeometry(1, 1, 1);
      const testMaterial = new MeshStandardMaterial();
      const test = new Mesh(testGeometry, testMaterial);

      this._experience.scene.add(test);
    });
  }

  private _experience: Experience;

  public environment: Environment;

  public floor: Floor;
}
