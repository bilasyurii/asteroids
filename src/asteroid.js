import Entity from './entity.js';
import Vec2 from './vec2.js';
import CircleCollider from './circleCollider.js';
import AsteroidGraphic from './asteroidGraphic.js';

export const AsteroidSize = {
  BIG: 50,
  MEDIUM: 20,
  SMALL: 10
};

export const StartAsteroidCount = 4;
export const StartAsteroidVelocity = 0.1;

export class Asteroid extends Entity {
  constructor(position, size, velocity) {
    if (size == undefined) {
      size = AsteroidSize.BIG;
    }

    if (velocity == undefined) {
      velocity = Vec2.random(StartAsteroidVelocity);
    }
      
    const collider = new CircleCollider(position, size);

    super(position, collider, new AsteroidGraphic(size), velocity);

    this.size = size;
  }

  onCollision() {
    
  }
}
