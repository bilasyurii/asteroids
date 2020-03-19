import GameState from './gameState.js';
import { ScreenVec2, OriginX, OriginY } from './screenVec2.js';
import TextLabel from './textLabel.js';
import Panel from './panel.js';
import { ScreenCoord, ScreenCoordType } from './screenCoord.js';
import MainMenuState from './mainMenuState.js';

const maxInitials = 3;

export default class EndScreenState extends GameState {
  constructor(game, score) {
    super(game);
    this.score = score;
    this.isHighscore = undefined;
    this.initials = undefined;
    this.currentInitial = 0;
  }

  init() {
    super.init();

    if (this.isHighscore) {
      this.initials = [];
      for (let i = 0; i < maxInitials; ++i) {
        this.initials.push(undefined);
      }

      this.initInitial();
    }
  }

  initInitial() {
    this.initials[this.currentInitial] = 'A';

    this.updateInitialUI();
  }

  initInputHandling() {
    if (this.isHighscore) {
      this.subscriptions.push(this.game.input.up.subscribe(true, () => {
        this.letterUp();
      }));

      this.subscriptions.push(this.game.input.down.subscribe(true, () => {
        this.letterDown();
      }));

      this.subscriptions.push(this.game.input.action.subscribe(true, () => {
        this.confirm();
      }));
    } else {
      this.subscriptions.push(this.game.input.action.subscribe(true, () => {
        this.goToMainMenu();
      }));
    }
  }

  letterUp() {
    const currentCode = this.initials[this.currentInitial].charCodeAt(0);
    let newCode = currentCode + 1;
    if (newCode > 'Z'.charCodeAt(0)) {
      newCode = 'A'.charCodeAt(0);
    }
    this.initials[this.currentInitial] = String.fromCharCode(newCode);

    this.updateInitialUI();
  }

  letterDown() {
    const currentCode = this.initials[this.currentInitial].charCodeAt(0);
    let newCode = currentCode - 1;
    if (newCode < 'A'.charCodeAt(0)) {
      newCode = 'Z'.charCodeAt(0);
    }
    this.initials[this.currentInitial] = String.fromCharCode(newCode);

    this.updateInitialUI();
  }

  confirm() {
    ++this.currentInitial;

    if (this.currentInitial < maxInitials) {
      this.initInitial();
    } else {
      this.game.scores.registerScore(this.score, this.initials.join(''));
      this.goToMainMenu();
    }
  }

  goToMainMenu() {
    this.game.setState(new MainMenuState(this.game));
  }

  updateInitialUI() {
    this.game.guiRenderer
             .getElement('initialsPanel')
             .children[this.currentInitial]
             .text = this.initials[this.currentInitial];
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

    this.isHighscore = this.game.scores.isHighscore(this.currentScore);

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

      

      const initialsPanel = new Panel(new ScreenVec2(0.5, 0.8, OriginX.CENTER, OriginY.BOTTOM),
      new ScreenVec2(new ScreenCoord(200, ScreenCoordType.ABSOLUTE), 0.3));

      const initialsDistance = 1 / (maxInitials - 1);
          
      for (let i = 0; i < maxInitials; ++i) {
        const concreteInitialElement = new TextLabel('_', 30, 
            new ScreenVec2(initialsDistance * i, 1, OriginX.CENTER, OriginY.BOTTOM));
          
        initialsPanel.addChild(concreteInitialElement);
      }

      this.game.guiRenderer.addElement('initialsPanel', initialsPanel);
    } else {
      const betterLuck = new TextLabel('BETTER LUCK NEXT TIME', 30,
          new ScreenVec2(0.5, 0.25, OriginX.CENTER, OriginY.TOP));
          
      this.game.guiRenderer.addElement('betterLuck', betterLuck);

      const howToContinue = new TextLabel('PRESS SPACE/RETURN TO CONTINUE', 20,
          new ScreenVec2(0.5, 0.7, OriginX.CENTER, OriginY.TOP));
          
      this.game.guiRenderer.addElement('howToContinue', howToContinue);
    }
  }
}
