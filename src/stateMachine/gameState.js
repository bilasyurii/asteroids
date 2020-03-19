export default class GameState {
  constructor(game) {
    this.game = game;

    this.entities = [];
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

  removeDeadEntities() {
    this.entities = this.entities.filter(entity => entity.alive);
  }

  handleCollisions() {
    for (const entity of this.entities) {
      if (entity.alive) {
        for (const other of this.entities) {
          if (other != entity && other.alive) {
            if (entity.collides(other)) {
              entity.onCollision(other, (scoreChange) => this.handleScoreChange(scoreChange));
              other.onCollision(entity, (scoreChange) => this.handleScoreChange(scoreChange));
            }
          }
        }
      }
    }
  }

  handleScoreChange(scoreChange) {}

  moveEntitiesThroughEdges() {
    for (const entity of this.entities) {
      entity.position.x = this.moveCoordThroughEdge(entity.position.x, this.game.width);
      entity.position.y = this.moveCoordThroughEdge(entity.position.y, this.game.height);
    }
  }

  update(deltaTime) {}
  
  handleInput(deltaTime) {}

  initEntities() {}
  
  onDestroy() {
    for (const subscription of this.subscriptions) {
      subscription.unsubscribe();
    }
  }

  initGUI() {
    this.game.guiRenderer.removeAll();
  }

  clearCanvas() {
    this.game.ctx.clearRect(0, 0, this.game.width, this.game.height);
  }

  drawEntities() {
    for (const entity of this.entities) {
      entity.draw(this.game.ctx);
    }
  }
  
  draw() {
    this.clearCanvas();
    this.drawEntities();
  }
}
