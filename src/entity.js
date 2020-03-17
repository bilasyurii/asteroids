import Vec2 from './vec2.js';

export default class Entity {
  constructor(position, collider, graphic, velocity) {
    this.position = position;
    this.collider = collider;
    this.graphic = graphic;

    if (velocity == undefined) {
      this.velocity = Vec2.zero;
    } else {
      this.velocity = velocity;
    }
  }

  addForce(forceVelocity) {
    this.velocity = this.velocity.add(forceVelocity);
  }

  update(deltaTime) {
    if (!this.velocity.equals(Vec2.zero)) {
      this.position = this.position.add(this.velocity.multiply(deltaTime));
    }

    if (this.collider != undefined) {
      this.collider.position = this.position;
    }
  }
  
  draw(ctx) {
    if (this.graphic != undefined) {
      ctx.save();
      ctx.translate(this.position.x, this.position.y);

      this.graphic.draw(ctx);

      ctx.restore();
    }
  }
}