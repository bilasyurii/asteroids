import GameState from './gameState.js';
import { ScreenVec2, OriginX, OriginY } from './screenVec2.js';
import TextLabel from './textLabel.js';
import Panel from './panel.js';
import { ScreenCoord, ScreenCoordType } from './screenCoord.js';
import { Asteroid, StartAsteroidCount } from './asteroid.js';
import PlayingState from './playingState.js';

export default class MainMenuState extends GameState {
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
    this.subscriptions.push(this.game.input.action.subscribe(true, () => {
      this.game.setState(new PlayingState(this.game));
    }));
  }

  initGUI() {
    super.initGUI();
    
    const latestScore = new TextLabel('00', 30, 
        new ScreenVec2(0.2, 0.1, OriginX.RIGHT));

    const highestScore = new TextLabel('00', 10,
        new ScreenVec2(0.5, 0.1));

    const worldBest = new TextLabel('00', 30,
        new ScreenVec2(0.8, 0.1, OriginX.LEFT));

    const copyright = new TextLabel('2020 YURA INC', 10,
        new ScreenVec2(0.5, 0.9));

    const playText = new TextLabel('1   COIN   1   PLAY', 30,
        new ScreenVec2(0.5, 0.8));

    const highScoresPanel = new Panel(new ScreenVec2(0.5, 0.25, OriginX.CENTER, OriginY.TOP),
                                       new ScreenVec2(0.3, 0.5));

    const highScoresText = new TextLabel('HIGH SCORES', 30,
        new ScreenVec2(0.5, new ScreenCoord(0, ScreenCoordType.ABSOLUTE), OriginX.CENTER, OriginY.TOP));

    highScoresPanel.addChild(highScoresText);
    
    for (let i = 0; i < 5; ++i) {
      const randScore = Math.floor((Math.random() * 9000 + 1000)) * 10;
      const concreteHighScore = new TextLabel((i + 1) + '. ' + randScore + ' SAM', 30,
        new ScreenVec2(0.5, new ScreenCoord(60 * (i + 1), ScreenCoordType.ABSOLUTE), OriginX.CENTER, OriginY.TOP));
      
      highScoresPanel.addChild(concreteHighScore);
    }
        
    this.game.guiRenderer.addElement('latestScore', latestScore);
    this.game.guiRenderer.addElement('highestScore', highestScore);
    this.game.guiRenderer.addElement('worldBest', worldBest);
    this.game.guiRenderer.addElement('copyright', copyright);
    this.game.guiRenderer.addElement('playText', playText);
    this.game.guiRenderer.addElement('highScoresPanel', highScoresPanel);
  }
}
