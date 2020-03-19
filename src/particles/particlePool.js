import { Particle } from './particle.js';

export default class ParticlePool {
  constructor() {
    this.alive = [];
    this.dead = [];
  }

  get newParticle() {
    let particle = this.dead.pop();

    if (particle == undefined) {
      particle = new Particle();
    }

    this.alive.push(particle);

    return particle;
  }

  update(deltaTime) {
    this.updateParticles(deltaTime);
    this.handleDeadParticles();
  }

  updateParticles(deltaTime) {
    for (const particle of this.alive) {
      particle.update(deltaTime);
    }
  }

  handleDeadParticles() {
    this.alive = this.alive.filter(particle => {
      if (!particle.alive) {
        this.dead.push(particle);
      }
      return particle.alive;
    });
  }

  draw(ctx) {
    for (const particle of this.alive) {
      particle.draw(ctx);
    }
  }
}
