import Experience from '../Experience';
import Environment from './Environment';
import Floor from './Floor';
import Fox from './Fox';

export default class World {
  constructor(experience: Experience) {
    this._experience = experience;

    // Wait for resources
    this._experience.resources.on('ready', () => {
      // Setup
      this.environment = new Environment(experience);

      // Floor
      this.floor = new Floor(experience);

      // Fox
      this.fox = new Fox(experience);
    });
  }

  private _experience: Experience;

  public environment: Environment;

  public floor: Floor;

  public fox: Fox;

  public update() {
    if (this.fox) {
      this.fox.update();
    }
  }
}
