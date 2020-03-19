import Entity from "./entity.js";
import PointCollider from "../colliders/pointCollider.js";
import BulletGraphic from "../graphics/bulletGraphic.js";

export const defaultBulletSpeed = 0.2;
export const bulletRange = 500;

export class Bullet extends Entity {
  constructor(audioPlayer, position, ownerTag, velocity) {
    const collider = new PointCollider(position, ownerTag);
    
    super(audioPlayer, position, collider, new BulletGraphic(), 0, Number.POSITIVE_INFINITY, velocity);

    this.distanceTravelled = 0;
  }

  update(deltaTime) {
    super.update(deltaTime);

    this.trackDistance(deltaTime);
  }

  trackDistance(deltaTime) {
    this.distanceTravelled += this.velocity.length * deltaTime;

    if (this.distanceTravelled >= bulletRange) {
      this.die();
    }
  }

  onCollision(other, scoreChangedCallback) {
    this.die();

    if (this.collider.tag === 'player_bullets') {
      scoreChangedCallback(other.killScore);
    }
  }
}
