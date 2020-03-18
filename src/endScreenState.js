import GameState from './gameState.js';
import { ScreenVec2, OriginX, OriginY } from './screenVec2.js';
import TextLabel from './textLabel.js';
import Panel from './panel.js';
import { ScreenCoord, ScreenCoordType } from './screenCoord.js';
import PlayingState from './playingState.js';

export default class EndScreenState extends GameState {
  constructor(game, score) {
    super(game);
    this.score = score;
    this.isHighscore = undefined;
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
        
    this.game.guiRenderer.addElement('currentScore', currentScore);
    this.game.guiRenderer.addElement('latestScore', latestScore);
    this.game.guiRenderer.addElement('highestScore', highestScore);
    this.game.guiRenderer.addElement('copyright', copyright);

    this.isHighscore = this.game.scores.registerScore(this.currentScore);

    if (this.isHighscore) {
      const infoPanel = new Panel(new ScreenVec2(0.5, 0.25, OriginX.CENTER, OriginY.TOP),
      new ScreenVec2(0.8, 0.3));
  
      const congratulations = new TextLabel('YOUR SCORE IS ONE OF THE TEN BEST', 20,
          new ScreenVec2(0.5, new ScreenCoord(0, ScreenCoordType.ABSOLUTE), OriginX.CENTER, OriginY.TOP));
      
      const enterInitials = new TextLabel('PLEASE ENTER YOUR INITIALS', 20,
          new ScreenVec2(0.5, new ScreenCoord(60, ScreenCoordType.ABSOLUTE), OriginX.CENTER, OriginY.TOP));
      
      const selectLetter = new TextLabel('PRESS W/S OR UP/DOWN ARROWS TO SELECT LETTER', 20,
          new ScreenVec2(0.5, new ScreenCoord(120, ScreenCoordType.ABSOLUTE), OriginX.CENTER, OriginY.TOP));
      
      const letterCorrect = new TextLabel('PRESS SPACE/RETURN WHEN LETTER IS CORRECT', 20,
          new ScreenVec2(0.5, new ScreenCoord(180, ScreenCoordType.ABSOLUTE), OriginX.CENTER, OriginY.TOP));
      
      infoPanel.addChild(congratulations);
      infoPanel.addChild(enterInitials);
      infoPanel.addChild(selectLetter);
      infoPanel.addChild(letterCorrect);

      this.game.guiRenderer.addElement('infoPanel', infoPanel);
    } else {
      const betterLuck = new TextLabel('BETTER LUCK NEXT TIME', 30,
          new ScreenVec2(0.5, 0.25, OriginX.CENTER, OriginY.TOP));
          
      this.game.guiRenderer.addElement('betterLuck', betterLuck);
    }
  }
}
