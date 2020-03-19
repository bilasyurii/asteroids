import GameState from './gameState.js';
import EndScreenState from './endScreenState.js';
import TextLabel from '../guiElements/textLabel.js';
import Panel from '../guiElements/panel.js';
import GraphicGUIElement from '../guiElements/graphicGuiElement.js';
import Collider from '../colliders/collider.js';
import Vec2 from '../utils/vec2.js';
import Utils from '../utils/utils.js';
import { ScreenVec2, OriginX, OriginY } from '../utils/screenVec2.js';
import { ScreenCoord, ScreenCoordType } from '../utils/screenCoord.js';
import { Player, playerInvincibilityTime, playerRespawnTime, playerMaxLifeCount, playerSize } from '../entities/player.js';
import { Asteroid, asteroidStartCount, AsteroidSize, asteroidSplitCount, asteroidSpawnDelay } from '../entities/asteroid.js';
import PlayerGraphic from '../graphics/playerGraphic.js';
import DotGraphic from '../graphics/dotGraphic.js';
import LineGraphic from '../graphics/lineGraphic.js';
import { ExplosionType } from '../particles/particle.js';

const endScreenDelay = 2000;
const maxAsteroidsPerWave = 11;
const asteroidsIncrementPerWave = 2;

export default class PlayingState extends GameState {
  constructor(game) {
    super(game);
    
    this.player = undefined;
    this.isPlayerRespawning = undefined;
    this.isPlayerInvincible = undefined;
    this.timeToRespawn = undefined;
    this.invincibilityTimeLeft = undefined;
    this.timeToGameStart = playerRespawnTime;
    this.timeToEndScreen = 0;
    this.currentScore = 0;
    this.asteroidCount = undefined;
    this.waveAsteroidCount = undefined;
    this.timeToAsteroidSpawn = undefined;
  }

  init() {
    super.init();
    
    this.registerTagsCollisionRules();
  }

  handleInput(deltaTime) {
    if (!this.isPlayerRespawning && this.player.alive) {
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

    if (this.timeToGameStart > 0) {
      this.timeToGameStart -= deltaTime;

      if (this.timeToGameStart <= 0) {
        this.waveAsteroidCount = asteroidStartCount;
        this.spawnAsteroids(asteroidStartCount);
        this.game.guiRenderer.removeElement('player1Text');
        this.game.audioPlayer.backgroundMusic.setMinSpeed();
        this.game.audioPlayer.backgroundMusic.play();
      }
    }

    if (this.timeToEndScreen > 0) {
      this.timeToEndScreen -= deltaTime;

      if (this.timeToEndScreen <= 0) {
        this.game.setState(new EndScreenState(this.game, this.currentScore));
      }
    }

    if (this.timeToAsteroidSpawn > 0) {
      this.timeToAsteroidSpawn -= deltaTime;

      if (this.timeToAsteroidSpawn <= 0) {
        this.waveAsteroidCount = (this.waveAsteroidCount + asteroidsIncrementPerWave) % maxAsteroidsPerWave;
        this.spawnAsteroids(this.waveAsteroidCount);
        this.game.audioPlayer.backgroundMusic.setMinSpeed();
        this.game.audioPlayer.backgroundMusic.play();
      }
    }
  }

  initEntities() {
    this.player = new Player(this.game.audioPlayer, this.game.mapCenter, () => this.playerHit());
    this.respawnPlayer(playerRespawnTime);
  }

  spawnAsteroids(asteroidCount) {
    this.asteroidCount = asteroidCount;

    for (let i = 0; i < asteroidCount; ++i) {
      const spawnPosition = this.game.getAsteroidSpawnPosition();

      this.entities.push(new Asteroid(this.game.audioPlayer, spawnPosition, AsteroidSize.BIG, 
                                      (asteroid) => this.splitAsteroid(asteroid)));
    }
  }

  splitAsteroid(asteroid) {
    this.handleExplosion(ExplosionType.DOTS, asteroid, asteroid.size);

    if (asteroid.size === AsteroidSize.SMALL) {
      --this.asteroidCount;

      if (this.asteroidCount === 0) {
        this.timeToAsteroidSpawn = asteroidSpawnDelay;
      }

      return;
    }

    ++this.asteroidCount;

    const newSize = (asteroid.size === AsteroidSize.BIG ? AsteroidSize.MEDIUM : AsteroidSize.SMALL);

    for (let i = 0; i < asteroidSplitCount; ++i) {
      const newVelocityLength = asteroid.velocity.length * Utils.random(1.25, 1.5);
      const newVelocity = Vec2.random(newVelocityLength);

      this.entities.push(new Asteroid(this.game.audioPlayer, asteroid.position, newSize, 
                                      (asteroid) => this.splitAsteroid(asteroid),
                                      newVelocity));
    }
  }

  playerHit() {
    this.handleExplosion(ExplosionType.LINES, this.player, playerSize / 2);

    if (this.player.alive) {
      this.respawnPlayer(playerRespawnTime);
      this.makePlayerInvincible(playerInvincibilityTime + playerRespawnTime);
    } else {
      this.endPlaying();
    }
    this.removeLifeFromUI();
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

  removeLifeFromUI() {
    this.game.guiRenderer.getElement('lifesPanel').children.pop();
  }

  endPlaying() {
    this.timeToEndScreen = endScreenDelay;

    const gameOver = new TextLabel('GAME OVER', 30,
        new ScreenVec2(0.5, 0.4));
    this.game.guiRenderer.addElement('gameOver', gameOver);
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
      if (!this.isPlayerRespawning && this.player.alive) {
        const bullet = this.player.shoot();

        if (bullet != undefined) {
          this.entities.push(bullet);
        }
      }
    }));
  }

  handleScoreChange(scoreChange) {
    if (scoreChange !== 0) {
      this.currentScore += scoreChange;
      this.updateScoreUI();
    }
  }

  updateScoreUI() {
    this.game.guiRenderer.getElement('currentScore').text = '' + this.currentScore;
  }
  
  onDestroy() {
    super.onDestroy();

    this.game.audioPlayer.backgroundMusic.stop();
  }

  handleExplosion(explosionType, owner, size) {
    const particleCount = size;
    
    for (let i = 0; i < particleCount; ++i) {
      const velocityLength = Utils.random(0.05, 0.2);
      const velocity = Vec2.fromAngle(Utils.random(0, 2 * Math.PI), velocityLength);
      const particle = this.game.particlePool.newParticle;
      let lifeSpan;
      if (owner instanceof Player) {
        lifeSpan = Utils.random(400, 700);
      } else {
        lifeSpan = Utils.random(200, 400);
      }
      const rotation = Utils.random(0, 2 * Math.PI);
      const rotationSpeed = Utils.random(0.01, 0.02);
      
      let graphic;

      switch (explosionType) {
        case ExplosionType.DOTS:
          graphic = new DotGraphic();
          break;
        case ExplosionType.LINES:
          graphic = new LineGraphic([{
            from: new Vec2(-5, 0),
            to: new Vec2(5, 0)
          }]);
          break;
      }
    
      particle.init(owner.position, graphic, velocity, lifeSpan, rotation, rotationSpeed, 0.00005);
    }
  }

  initGUI() {
    super.initGUI();
    
    const currentScore = new TextLabel('00', 30, 
        new ScreenVec2(0.2, 0.1, OriginX.RIGHT, OriginY.BOTTOM));

    const latestScore = new TextLabel(this.game.scores.latestScore, 10,
        new ScreenVec2(0.5, 0.1, OriginX.CENTER, OriginY.BOTTOM));

    const highestScore = new TextLabel(this.game.scores.highestScore, 30,
        new ScreenVec2(0.8, 0.1, OriginX.LEFT, OriginY.BOTTOM));

    const copyright = new TextLabel('2020 YURA INC', 10,
        new ScreenVec2(0.5, 0.9));

    const player1Text = new TextLabel('PLAYER 1', 30,
        new ScreenVec2(0.5, 0.2));

    const lifesPanel = new Panel(new ScreenVec2(0.2, 0.11, OriginX.LEFT, OriginY.TOP),
        new ScreenVec2(0, 0));

    for (let i = 0; i < playerMaxLifeCount; ++i) {
      const position = new ScreenVec2(new ScreenCoord(-1.5 * playerSize * i, ScreenCoordType.ABSOLUTE), 
                                      new ScreenCoord(playerSize / 2, ScreenCoordType.ABSOLUTE),
                                      OriginX.RIGHT, OriginY.TOP);

      const size = new ScreenVec2(new ScreenCoord(playerSize, ScreenCoordType.ABSOLUTE), 
                                  new ScreenCoord(playerSize, ScreenCoordType.ABSOLUTE));

      const playerLifeGraphic = new GraphicGUIElement(position, new PlayerGraphic(), -Math.PI / 2, size);

      lifesPanel.addChild(playerLifeGraphic);
    }

    this.game.guiRenderer.addElement('currentScore', currentScore);
    this.game.guiRenderer.addElement('latestScore', latestScore);
    this.game.guiRenderer.addElement('highestScore', highestScore);
    this.game.guiRenderer.addElement('copyright', copyright);
    this.game.guiRenderer.addElement('player1Text', player1Text);
    this.game.guiRenderer.addElement('lifesPanel', lifesPanel);
  }

  registerTagsCollisionRules() {
    Collider.registerTagsCollisionRule('player', 'player', false);
    Collider.registerTagsCollisionRule('asteroid', 'asteroid', false);
    Collider.registerTagsCollisionRule('enemy', 'enemy', false);
    Collider.registerTagsCollisionRule('player_bullets', 'player_bullets', false);
    Collider.registerTagsCollisionRule('player', 'asteroid', true);
    Collider.registerTagsCollisionRule('enemy', 'player', true);
    Collider.registerTagsCollisionRule('enemy', 'asteroid', false);
    Collider.registerTagsCollisionRule('player_bullets', 'player', true);
    Collider.registerTagsCollisionRule('player_bullets', 'asteroid', true);
    Collider.registerTagsCollisionRule('player_bullets', 'enemy', true);
  }
}
