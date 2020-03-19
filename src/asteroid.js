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
export const asteroidSpawnDelay = 1000;

const asteroidKillScores = [
  20,
  50,
  100
];

export class Asteroid extends Entity {
  constructor(audioPlayer, position, size, splitAsteroidCallback, velocity) {
    if (size == undefined) {
      size = AsteroidSize.BIG;
    }

    if (velocity == undefined) {
      velocity = Vec2.random(asteroidStartVelocity);
    }
      
    const collider = new CircleCollider(position, 'asteroid', size);

    super(audioPlayer, position, collider, new AsteroidGraphic(size), 
          Asteroid.getAsteroidKillScore(size), asteroidMaxVelocity, velocity);

    this.size = size;
    this.splitAsteroidCallback = splitAsteroidCallback;
  }

  static getAsteroidKillScore(size) {
    switch (size) {
      case AsteroidSize.BIG:
        return asteroidKillScores[0];
      case AsteroidSize.MEDIUM:
        return asteroidKillScores[1];
      case AsteroidSize.SMALL:
        return asteroidKillScores[2];
    }
  }

  onCollision(other, scoreChangedCallback) {
    this.die();

    switch (this.size) {
      case AsteroidSize.BIG:
        this.audioPlayer.playClip('bangLarge');
      case AsteroidSize.MEDIUM:
        this.audioPlayer.playClip('bangMedium');
      case AsteroidSize.SMALL:
        this.audioPlayer.playClip('bangSmall');
    }

    this.splitAsteroidCallback(this);
  }
}
