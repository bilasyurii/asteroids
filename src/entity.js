import Vec2 from './vec2.js';

export default class Entity {
  constructor(position, velocity, collider) {
    this.position = position;

    if (velocity == undefined) {
      this.velocity = Vec2.zero;
    } else {
      this.velocity = velocity;
    }

    this.collider = collider;
  }

  addForce(forceVelocity) {
    this.velocity = this.velocity.add(forceVelocity);
  }

  update(deltaTime) {
    if (!this.velocity.equals(Vec2.zero)) {
      this.position.add(this.velocity.multiply(deltaTime));
    }
  }
}
