export default class LineGraphic {
  constructor(lines) {
    this.lines = lines;
  }

  draw(ctx) {
    for(const line of this.lines) {
      LineGraphic.drawLine(ctx, line.from, line.to);
    }
  }

  static drawLine(ctx, from, to) {
    ctx.beginPath();
    ctx.moveTo(from.x, from.y);
    ctx.lineTo(to.x, to.y);
    ctx.closePath();
    ctx.stroke();
  }
}
