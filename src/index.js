import MainMenuState from './mainMenuState.js';
import GuiRenderer from './guiRenderer.js';

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

    this.setState(new MainMenuState(this))

    requestAnimationFrame((time) => this.update(time));
  }

  setState(newState) {
    this.state = newState;
    this.state.init();
  }

  onResize() {
    this.width = this.container.clientWidth;
    this.height = this.container.clientHeight;

    this.canvas.width = this.width;
    this.canvas.height = this.height;

    this.ctx.fillStyle = '#fff';
    this.ctx.strokeStyle = '#fff';
  }

  update(time) {
    const deltaTime = time - this.prevUpdateTime;
    this.prevUpdateTime = time;
    
    this.state.update(deltaTime);
    this.state.draw();

    requestAnimationFrame((time) => this.update(time));
  }
}

new Game();
