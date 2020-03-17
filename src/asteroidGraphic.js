import Utils from './utils.js';

export default class AsteroidGraphic {
  constructor(size) {
    this.size = size;
    this.points = [];
    this.pointCount = Utils.randomInt(3) + 10;

    const halfSize = size / 2;
    for (let i = 0; i < this.pointCount; ++i) {
      this.points.push(Math.random() * halfSize + halfSize);
    }

    this.angleBetweenPoints = 2 * Math.PI / this.pointCount;
  }

  draw(ctx) {
    ctx.beginPath();

    ctx.moveTo(0, this.points[0]);

    for (let i = 1; i < this.pointCount; ++i) {
      ctx.rotate(this.angleBetweenPoints);
      ctx.lineTo(0, this.points[i]);
    }

    ctx.closePath();
    ctx.stroke();
  }
}
