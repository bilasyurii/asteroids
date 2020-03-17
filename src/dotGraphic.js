export default class DotGraphic {
  constructor(dots) {
    this.dots = dots;
  }

  draw(ctx) {
    for(const dot of this.dots) {
      DotGraphic.drawDot(ctx, dot);
    }
  }

  static drawDot(ctx, position) {
    ctx.fillRect(position.x, position.y, 1, 1);
  }
}
