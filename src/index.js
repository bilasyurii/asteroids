import MainMenuState from './mainMenuState.js';
import GuiRenderer from './guiRenderer.js';
import Utils from './utils.js';
import Vec2 from './vec2.js';
import { Input } from './input.js';

export default class Game {
  constructor() {
    this.container = document.getElementById('content');
    this.canvas = document.getElementById('canvas');
    this.ctx = this.canvas.getContext('2d');

    this.prevUpdateTime = 0;
    this.height = 0;
    this.width = 0;

    this.init();
  }

  init() {
    window.addEventListener("resize", x => this.onResize());
    this.onResize();

    this.guiRenderer = new GuiRenderer(this.ctx);
    this.input = new Input();

    this.setState(new MainMenuState(this))

    requestAnimationFrame((time) => this.update(time));
  }

  setState(newState) {
    if (this.state != undefined) {
      this.state.onDestroy();
    }
    this.state = newState;
    this.state.init();
  }

  onResize() {
    this.width = this.container.clientWidth;
    this.height = this.container.clientHeight;

    this.canvas.width = this.width;
    this.canvas.height = this.height;

    this.corners = [
      new Vec2(0, 0),
      new Vec2(this.width, 0),
      new Vec2(this.width, this.height),
      new Vec2(0, this.height)
    ];

    this.ctx.fillStyle = '#fff';
    this.ctx.strokeStyle = '#fff';
  }

  update(time) {
    const deltaTime = time - this.prevUpdateTime;
    this.prevUpdateTime = time;
    
    this.state.handleInput(deltaTime);
    this.state.update(deltaTime);
    this.state.draw();

    requestAnimationFrame((time) => this.update(time));
  }

  getEdge(edgeIndex) {
    return {
      firstCorner: this.corners[edgeIndex],
      secondCorner: this.corners[(edgeIndex + 1) % 4]
    };
  }

  getAsteroidSpawnPosition() {
    const edgeIndex = Utils.randomInt(4);
    const edge = this.getEdge(edgeIndex);

    return Utils.randomPointOnLine(edge.firstCorner, edge.secondCorner);
  }
}

new Game();
