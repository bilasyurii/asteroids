import DotGraphic from './dotGraphic.js';
import Vec2 from './vec2.js';

export default class BulletGraphic {
  constructor() {
    this.dotGraphic = new DotGraphic([Vec2.zero]);
  }

  draw(ctx) {
    this.dotGraphic.draw(ctx);
  }
}