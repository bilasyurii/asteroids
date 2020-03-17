import Entity from './entity.js';
import Vec2 from './vec2.js';
import RectCollider from './rectCollider.js';
import PlayerGraphic from './playerGraphic.js';

export const playerSize = 20;
export const playerEnginePower = 0.0002;
export const playerRotationSpeed = 0.005;
export const playerMaxVelocity = 0.2;
export const playerDeceleration = 0.00005;

export class Player extends Entity {
  constructor(position) {
    const collider = new RectCollider(position, new Vec2(playerSize, playerSize));

    super(position, collider, new PlayerGraphic(), playerMaxVelocity);

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

  decelerate(amount) {
    let newVelocityLength = this.velocity.length - amount;

    if (newVelocityLength <= 0) {
      this.velocity = Vec2.zero;
    } else {
      this.velocity = this.velocity.normalized.multiply(newVelocityLength);
    }
  }

  update(deltaTime) {
    this.decelerate(playerDeceleration * deltaTime);
    
    super.update(deltaTime);
  }

  move(deltaTime) {
    this.addForce(Vec2.fromAngle(this.collider.rotation, playerEnginePower * deltaTime));
  }

  rotateLeft(deltaTime) {
    this.collider.rotate(-playerRotationSpeed * deltaTime);
  }

  rotateRight(deltaTime) {
    this.collider.rotate(playerRotationSpeed * deltaTime);
  }
}
