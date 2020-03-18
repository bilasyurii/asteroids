import GameState from './gameState.js';
import TextLabel from './textLabel.js';
import Vec2 from './vec2.js';
import Collider from './collider.js';
import { Player, playerInvincibilityTime, playerRespawnTime } from './player.js';
import { ScreenVec2, OriginX } from './screenVec2.js';
import { Asteroid, asteroidStartCount, AsteroidSize, asteroidSplitCount, asteroidFirstSpawnDelay } from './asteroid.js';

export default class PlayingState extends GameState {
  constructor(game) {
    super(game);
    
    this.entities = [];
    this.player = undefined;
    this.isPlayerRespawning = undefined;
    this.isPlayerInvincible = undefined;
    this.timeToRespawn = undefined;
    this.invincibilityTimeLeft = undefined;
    this.timeToFirstAsteroidSpawn = asteroidFirstSpawnDelay;
  }

  init() {
    super.init();
    
    this.registerTagsCollisionRules();
  }

  handleInput(deltaTime) {
    if (!this.isPlayerRespawning) {
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
  }

  update(deltaTime) {
    this.handleTimings(deltaTime);
    this.updateEntities(deltaTime);
    this.moveEntitiesThroughEdges();
    this.handleCollisions();
    this.removeDeadEntities();
  }

  handleTimings(deltaTime) {
    if (this.timeToRespawn > 0) {
      this.timeToRespawn -= deltaTime;

      if (this.timeToRespawn <= 0) {
        this.isPlayerRespawning = false;

        this.player.position = this.game.mapCenter;
        this.player.velocity = Vec2.zero;
        this.entities.push(this.player);
      }
    }

    if (this.invincibilityTimeLeft > 0) {
      this.invincibilityTimeLeft -= deltaTime;

      if (this.invincibilityTimeLeft <= 0) {
        this.isPlayerInvincible = false;

        this.enablePlayerCollisions();
      }
    }

    if (this.timeToFirstAsteroidSpawn > 0) {
      this.timeToFirstAsteroidSpawn -= deltaTime;

      if (this.timeToFirstAsteroidSpawn <= 0) {
        this.spawnAsteroids(asteroidStartCount);
      }
    }
  }

  initEntities() {
    this.player = new Player(this.game.mapCenter, () => this.playerHit());
    this.respawnPlayer(playerRespawnTime);
  }

  spawnAsteroids(asteroidCount) {
    for (let i = 0; i < asteroidCount; ++i) {
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

  playerHit() {
    if (this.player.alive) {
      this.respawnPlayer(playerRespawnTime);
      this.makePlayerInvincible(playerInvincibilityTime + playerRespawnTime);
    }
  }

  respawnPlayer(respawnTime) {
    this.isPlayerRespawning = true;
    this.timeToRespawn = respawnTime;
    this.removePlayer();
  }

  removePlayer() {
    const entitiesCount = this.entities.length;
    for (let i = 0; i < entitiesCount; ++i) {
      if (this.entities[i] instanceof Player) {
        this.entities.splice(i, 1);
        break;
      }
    }
  }

  makePlayerInvincible(invincibilityTime) {
    this.isPlayerInvincible = true;
    this.invincibilityTimeLeft = invincibilityTime;

    this.disablePlayerCollisions();
  }

  disablePlayerCollisions() {
    Collider.registerTagsCollisionRule('player', 'asteroid', false);
    Collider.registerTagsCollisionRule('enemy', 'player', false);
  }

  enablePlayerCollisions() {
    Collider.registerTagsCollisionRule('player', 'asteroid', true);
    Collider.registerTagsCollisionRule('enemy', 'player', true);
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

  registerTagsCollisionRules() {
    Collider.registerTagsCollisionRule('player', 'player', false);
    Collider.registerTagsCollisionRule('asteroid', 'asteroid', false);
    Collider.registerTagsCollisionRule('enemy', 'enemy', false);
    Collider.registerTagsCollisionRule('player', 'asteroid', true);
    Collider.registerTagsCollisionRule('enemy', 'player', true);
    Collider.registerTagsCollisionRule('enemy', 'asteroid', false);
  }
}
