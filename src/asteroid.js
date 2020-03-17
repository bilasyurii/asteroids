import Entity from './entity.js';
import Vec2 from './vec2.js';
import CircleCollider from './circleCollider.js';
import AsteroidGraphic from './asteroidGraphic.js';

export const AsteroidSize = {
  BIG: 50,
  MEDIUM: 20,
  SMALL: 10
};

export const asteroidStartCount = 4;
export const asteroidStartVelocity = 0.1;
export const asteroidMaxVelocity = 0.1;
export const asteroidSplitCount = 2;

export class Asteroid extends Entity {
  constructor(position, size, splitAsteroidCallback, velocity) {
    if (size == undefined) {
      size = AsteroidSize.BIG;
    }

    if (velocity == undefined) {
      velocity = Vec2.random(asteroidStartVelocity);
    }
      
    const collider = new CircleCollider(position, 'asteroid', size);

    super(position, collider, new AsteroidGraphic(size), asteroidMaxVelocity, velocity);

    this.size = size;
    this.splitAsteroidCallback = splitAsteroidCallback;
  }

  onCollision() {
    this.die();
    this.splitAsteroidCallback(this);
  }
}
