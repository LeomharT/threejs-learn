import Experience from '../Experience';

export default class Floor {
  constructor(experience: Experience) {
    this._experience = experience;
  }

  private _experience: Experience;
}
