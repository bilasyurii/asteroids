export default class GameState {
  constructor(game) {
    this.game = game;
  }

  init() {
    this.initGUI();
    this.initEntities();
  }
}
