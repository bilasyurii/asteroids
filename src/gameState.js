export default class GameState {
  constructor(game) {
    this.game = game;

    this.subscriptions = [];
  }

  init() {
    this.initGUI();
    this.initInputHandling();
    this.initEntities();
  }

  updateEntities(deltaTime) {
    for (const entity of this.entities) {
      entity.update(deltaTime);
    }
  }

  moveCoordThroughEdge(coord, edgeSize) {
    return (coord + edgeSize) % edgeSize;
  }

  moveEntitiesThroughEdges() {
    for (const entity of this.entities) {
      entity.position.x = this.moveCoordThroughEdge(entity.position.x, this.game.width);
      entity.position.y = this.moveCoordThroughEdge(entity.position.y, this.game.height);
    }
  }

  handleInput(deltaTime) {}
  
  onDestroy() {
    for (const subscription of this.subscriptions) {
      subscription.unsubscribe();
    }
  }

  initGUI() {
    this.game.guiRenderer.removeAll();
  }
}
