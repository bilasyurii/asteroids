import GameState from './gameState.js';
import TextLabel from './textLabel.js';
import { Player } from './player.js';
import { ScreenVec2, OriginX } from './screenVec2.js';
import { Asteroid, asteroidStartCount } from './asteroid.js';

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

      this.entities.push(new Asteroid(spawnPosition));
    }
  }

  initInputHandling() {
    /*this.game.input.action.subscribe(true, () => {
      this.game.setState(new PlayingState());
    });*/
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
