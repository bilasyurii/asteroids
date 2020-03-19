import Vec2 from '../utils/vec2.js';

export const ExplosionType = {
  LINES: 'lines',
  DOTS: 'dots'
};

export class Particle {
  constructor() {
    this.position = undefined;
    this.graphic = undefined;
    this.velocity = undefined;
    this.lifeSpan = undefined;
    this.rotation = undefined;
    this.rotationSpeed = undefined;
    this.deceleration = undefined;
    this.timeToLive = undefined;
    this.alive = false;
  }

  init(position, graphic, velocity, lifeSpan, rotation, rotationSpeed, deceleration) {
    this.position = position;
    this.graphic = graphic;
    this.velocity = velocity;
    this.lifeSpan = lifeSpan;
    this.rotation = rotation;
    this.rotationSpeed = rotationSpeed;
    this.deceleration = deceleration;
    this.timeToLive = lifeSpan;
    this.alive = true;
  }

  update(deltaTime) {
    if (this.timeToLive > 0) {
      this.timeToLive -= deltaTime;

      if (this.timeToLive <= 0) {
        this.die();
        return;
      }
    }
    
    this.decelerate(this.deceleration * deltaTime);
    
    if (!this.velocity.equals(Vec2.zero)) {
      this.position = this.position.add(this.velocity.multiply(deltaTime));
    }
  }

  decelerate(amount) {
    let newVelocityLength = this.velocity.length - amount;

    if (newVelocityLength <= 0) {
      this.velocity = Vec2.zero;
    } else {
      this.velocity = this.velocity.normalized.multiply(newVelocityLength);
    }
  }

  draw(ctx) {
    if (this.graphic != undefined) {
      ctx.save();
      ctx.translate(this.position.x, this.position.y);
      ctx.rotate(this.rotation);

      this.graphic.draw(ctx);

      ctx.restore();
    }
  }

  die() {
    this.alive = false;
  }
}
