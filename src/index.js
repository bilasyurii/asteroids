import MainMenuState from './stateMachine/mainMenuState.js';
import AudioPlayer from './audio/audioPlayer.js';
import GuiRenderer from './guiElements/guiRenderer.js';
import ScoresCollection from './scores/scoresCollection.js';
import Utils from './utils/utils.js';
import Vec2 from './utils/vec2.js';
import ParticlePool from './particles/particlePool.js';
import { Input } from './input/input.js';

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
    
    this.particlePool = new ParticlePool();
    this.audioPlayer = new AudioPlayer();
    this.scores = new ScoresCollection();
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

    this.particlePool.update(deltaTime);
    this.audioPlayer.backgroundMusic.update(deltaTime);
    this.state.handleInput(deltaTime);
    this.state.update(deltaTime);
    this.state.draw();
    this.particlePool.draw(this.ctx);
    this.guiRenderer.draw();

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

  get mapCenter() {
    return this.corners[2].multiply(0.5);
  }
}

new Game();
