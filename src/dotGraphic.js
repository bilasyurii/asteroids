import Vec2 from "./vec2.js";

export default class DotGraphic {
  constructor(dots) {
    if (dots == undefined) {
      this.dots = [Vec2.zero];
    } else {
      this.dots = dots;
    }
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
