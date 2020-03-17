import Entity from './entity.js';
import RectCollider from './rectCollider.js';

export default class Player extends Entity {
  constructor(position) {
    const collider = new RectCollider(position, new Vec2(20, 20));

    super(position, collider);

    this.lifeCount = 3;
  }

  get alive() {
    return this.lifeCount > 0;
  }

  draw(ctx) {
    ctx.save();
    ctx.translate(this.position.x, this.position.y);
    ctx.rotate(this.collider.rotation);

    this.graphic.draw(ctx);

    ctx.restore();
  }
}
