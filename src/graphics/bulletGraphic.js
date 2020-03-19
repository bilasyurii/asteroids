import DotGraphic from './dotGraphic.js';

export default class BulletGraphic {
  constructor() {
    this.dotGraphic = new DotGraphic();
  }

  draw(ctx) {
    this.dotGraphic.draw(ctx);
  }
}
