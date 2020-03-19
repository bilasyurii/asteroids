import GameState from './gameState.js';
import PlayingState from './playingState.js';
import Panel from '../guiElements/panel.js';
import TextLabel from '../guiElements/textLabel.js';
import { ScreenCoord, ScreenCoordType } from '../utils/screenCoord.js';
import { ScreenVec2, OriginX, OriginY } from '../utils/screenVec2.js';
import { Asteroid, asteroidStartCount } from '../entities/asteroid.js';

export default class MainMenuState extends GameState {
  constructor(game) {
    super(game);
  }

  update(deltaTime) {
    this.updateEntities(deltaTime);
    this.moveEntitiesThroughEdges();
  }

  initEntities() {
    this.entities = [];

    for (let i = 0; i < asteroidStartCount; ++i) {
      const spawnPosition = this.game.getAsteroidSpawnPosition();

      this.entities.push(new Asteroid(this.game.audioPlayer, spawnPosition));
    }
  }

  initInputHandling() {
    this.subscriptions.push(this.game.input.action.subscribe(true, () => {
      this.game.setState(new PlayingState(this.game));
    }));
  }

  initGUI() {
    super.initGUI();
    
    const currentScore = new TextLabel('00', 30, 
        new ScreenVec2(0.2, 0.1, OriginX.RIGHT, OriginY.BOTTOM));

    const latestScore = new TextLabel('' + this.game.scores.latestScore, 10,
        new ScreenVec2(0.5, 0.1, OriginX.CENTER, OriginY.BOTTOM));

    const highestScore = new TextLabel('' + this.game.scores.highestScore, 30,
        new ScreenVec2(0.8, 0.1, OriginX.LEFT, OriginY.BOTTOM));

    const copyright = new TextLabel('2020 YURA INC', 10,
        new ScreenVec2(0.5, 0.9));

    const playText = new TextLabel('1   COIN   1   PLAY', 30,
        new ScreenVec2(0.5, 0.8));

    const highScoresPanel = new Panel(new ScreenVec2(0.5, 0.25, OriginX.CENTER, OriginY.TOP),
        new ScreenVec2(0.3, 0.5));

    const scoresCount = this.game.scores.scores.length;

    if (scoresCount !== 0) {
      const highScoresText = new TextLabel('HIGH SCORES', 30,
          new ScreenVec2(0.5, new ScreenCoord(0, ScreenCoordType.ABSOLUTE), OriginX.CENTER, OriginY.TOP));

      highScoresPanel.addChild(highScoresText);

      for (let i = 0; i < scoresCount; ++i) {
        const record = this.game.scores.scores[i];

        const position = new ScreenVec2(0.5, new ScreenCoord(60 * (i + 1), ScreenCoordType.ABSOLUTE),
                                        OriginX.CENTER, OriginY.TOP);

        const concreteHighScore = new TextLabel(
            (i + 1) + '. ' + record.score + ' ' + record.initials, 30, position);
        
        highScoresPanel.addChild(concreteHighScore);
      }
    }
        
    this.game.guiRenderer.addElement('currentScore', currentScore);
    this.game.guiRenderer.addElement('latestScore', latestScore);
    this.game.guiRenderer.addElement('highestScore', highestScore);
    this.game.guiRenderer.addElement('copyright', copyright);
    this.game.guiRenderer.addElement('playText', playText);
    this.game.guiRenderer.addElement('highScoresPanel', highScoresPanel);
  }
}
