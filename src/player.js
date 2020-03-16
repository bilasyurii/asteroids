import Entity from './entity.js';

export default class Player extends Entity {
  constructor(position) {
    super(position);

    this.lifeCount = 3;
  }

  get alive() {
    return this.lifeCount > 0;
  }
}
