import Entity from './entity.js';
import Vec2 from '../utils/vec2.js';
import RectCollider from '../colliders/rectCollider.js';
import PlayerGraphic from '../graphics/playerGraphic.js';
import RepeatableAudioClip from '../audio/repeatableAudioClip.js';
import { Bullet } from './bullet.js';

export const playerSize = 20;
export const playerEnginePower = 0.0002;
export const playerRotationSpeed = 0.005;
export const playerMaxVelocity = 0.2;
export const playerDeceleration = 0.00005;
export const playerReloadTime = 200;
export const playerInvincibilityTime = 2000;
export const playerRespawnTime = 2000;
export const playerMaxLifeCount = 3;

const thrustEndDelay = 200;

export class Player extends Entity {
  constructor(audioPlayer, position, onHitCallback) {
    const collider = new RectCollider(position, 'player', new Vec2(playerSize, playerSize));

    super(audioPlayer, position, collider, new PlayerGraphic(), 0, playerMaxVelocity);

    this.lifeCount = playerMaxLifeCount;
    this.timeToReloaded = 0;
    this.onHitCallback = onHitCallback;
    this.thrustClip = new RepeatableAudioClip('thrust', audioPlayer);
    this.thrustClip.audioClip.playbackRate = 0.5;
    this.timeToThrustEnd = 0;
  }

  draw(ctx) {
    if (this.graphic != undefined) {
      ctx.save();
      ctx.translate(this.position.x, this.position.y);
      ctx.rotate(this.collider.rotation);

      this.graphic.draw(ctx);

      ctx.restore();
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

  update(deltaTime) {
    if (this.timeToReloaded > 0) {
      this.timeToReloaded -= deltaTime;
    }
    
    this.decelerate(playerDeceleration * deltaTime);
    
    super.update(deltaTime);

    if (this.timeToThrustEnd > 0) {
      this.timeToThrustEnd -= deltaTime;

      if (this.timeToThrustEnd <= 0) {
        this.thrustClip.stop();
      }
    }
  }

  move(deltaTime) {
    this.timeToThrustEnd = thrustEndDelay;
    this.thrustClip.play();

    this.addForce(Vec2.fromAngle(this.collider.rotation, playerEnginePower * deltaTime));
  }

  rotateLeft(deltaTime) {
    this.collider.rotate(-playerRotationSpeed * deltaTime);
  }

  rotateRight(deltaTime) {
    this.collider.rotate(playerRotationSpeed * deltaTime);
  }

  get shootingPoint() {
    return new Vec2(playerSize / 2, 0).rotate(Vec2.zero, this.collider.rotation).add(this.position);
  }

  shoot() {
    if (this.timeToReloaded > 0) {
      return;
    }
    this.audioPlayer.playClip('fire');
    this.timeToReloaded = playerReloadTime;
    const bulletVelocity = Vec2.fromAngle(this.collider.rotation, Bullet.defaultBulletSpeed);
    return new Bullet(this.audioPlayer, this.shootingPoint, this.collider.tag + '_bullets', bulletVelocity);
  }

  onCollision(other, scoreChangedCallback) {
    --this.lifeCount;

    if (this.lifeCount <= 0) {
      this.die();
    }

    this.thrustClip.stop();

    scoreChangedCallback(other.killScore);

    this.onHitCallback();
  }
}
