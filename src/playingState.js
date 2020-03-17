import GameState from './gameState.js';
import TextLabel from './textLabel.js';
import { ScreenVec2, OriginX } from './screenVec2.js';
import { Asteroid, StartAsteroidCount } from './asteroid.js';

export default class PlayingState extends GameState {
  constructor(game) {
    super(game);
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
    this.entities = [];

    for (let i = 0; i < StartAsteroidCount; ++i) {
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
