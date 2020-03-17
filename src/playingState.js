import GameState from './gameState.js';
import TextLabel from './textLabel.js';
import Vec2 from './vec2.js';
import { Player } from './player.js';
import { ScreenVec2, OriginX } from './screenVec2.js';
import { Asteroid, asteroidStartCount, AsteroidSize, asteroidSplitCount } from './asteroid.js';

export default class PlayingState extends GameState {
  constructor(game) {
    super(game);
    
    this.entities = [];
    this.player = undefined;
  }

  handleInput(deltaTime) {
    if (this.game.input.up.pressed) {
      this.player.move(deltaTime);
    }
    if (this.game.input.left.pressed) {
      this.player.rotateLeft(deltaTime);
    }
    if (this.game.input.right.pressed) {
      this.player.rotateRight(deltaTime);
    }
  }

  update(deltaTime) {
    this.updateEntities(deltaTime);
    this.moveEntitiesThroughEdges();
    this.handleCollisions();
    this.removeDeadEntities();
  }

  draw() {
    this.game.ctx.clearRect(0, 0, this.game.width, this.game.height);

    for (const entity of this.entities) {
      entity.draw(this.game.ctx);
    }

    this.game.guiRenderer.draw();
  }

  initEntities() {
    // spawn player at the center
    this.player = new Player(this.game.corners[2].multiply(0.5));
    this.entities.push(this.player);

    for (let i = 0; i < asteroidStartCount; ++i) {
      const spawnPosition = this.game.getAsteroidSpawnPosition();

      this.entities.push(new Asteroid(spawnPosition, AsteroidSize.BIG, 
                                      (asteroid) => this.splitAsteroid(asteroid)));
    }
  }

  splitAsteroid(asteroid) {
    if(asteroid.size === AsteroidSize.SMALL) {
      return;
    }

    const newSize = (asteroid.size === AsteroidSize.BIG ? AsteroidSize.MEDIUM : AsteroidSize.SMALL);

    for (let i = 0; i < asteroidSplitCount; ++i) {
      const newVelocity = Vec2.random(asteroid.velocity.length);

      this.entities.push(new Asteroid(asteroid.position, newSize, 
                                      (asteroid) => this.splitAsteroid(asteroid),
                                      newVelocity));
    }
  }

  initInputHandling() {
    this.subscriptions.push(this.game.input.action.subscribe(true, () => {
      const bullet = this.player.shoot();
      if (bullet != undefined) {
        this.entities.push(bullet);
      }
    }));
  }

  initGUI() {
    super.initGUI();
    
    const latestScore = new TextLabel('00', 30, 
        new ScreenVec2(0.2, 0.1, OriginX.RIGHT));

    const highestScore = new TextLabel('00', 10,
        new ScreenVec2(0.5, 0.1));

    const copyright = new TextLabel('2020 YURA INC', 10,
        new ScreenVec2(0.5, 0.9));
        
    this.game.guiRenderer.addElement('latestScore', latestScore);
    this.game.guiRenderer.addElement('highestScore', highestScore);
    this.game.guiRenderer.addElement('copyright', copyright);
  }
}
