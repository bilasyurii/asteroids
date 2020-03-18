import { OriginX, OriginY } from './screenVec2.js';

export default class GUIElement {
  constructor(screenPosition, screenSize) {
    this.screenPosition = screenPosition;
    this.screenSize = screenSize;
    this.visible = true;
  }

  translate(ctx, width, height) {
    const position = this.screenPosition.toAbsolute(width, height);
    const size = this.screenSize.toAbsolute(width, height);

    ctx.translate(position.x, position.y);

    switch (this.screenPosition.originX) {
      case OriginX.LEFT:
        break;
      case OriginX.RIGHT:
        ctx.translate(-size.x, 0);
        break;
      case OriginX.CENTER:
        ctx.translate(-size.x / 2, 0);
        break;
    }

    switch (this.screenPosition.originY) {
      case OriginY.TOP:
        ctx.translate(0, 0);
        break;
      case OriginY.BOTTOM:
        ctx.translate(0, -size.y);
        break;
      case OriginY.MIDDLE:
        ctx.translate(0, -size.y / 2);
        break;
    }
  }
}
