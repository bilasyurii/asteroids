import GUIElement from './guiElement.js';
import Vec2 from './vec2.js';
import { ScreenVec2, OriginX, OriginY } from './screenVec2.js';

export default class Panel extends GUIElement {
  constructor(screenPosition, screenSize, children) {
    super(screenPosition);

    if (screenSize == undefined) {
      this.screenSize = new ScreenVec2(new Vec2(1, 1));
    } else {
      this.screenSize = screenSize;
    }
    
    if (children == undefined) {
      this.children = [];
    } else {
      this.children = children;
    }
  }

  addChild(child) {
    this.children.push(child);
  }

  draw(ctx, width, height) {
    if (!this.visible) {
      return;
    }

    const position = this.screenPosition.toAbsolute(width, height);
    const size = this.screenSize.toAbsolute(width, height);
    
    ctx.save();

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

    for (const child of this.children) {
      child.draw(ctx, size.x, size.y);
    }

    //TODO remove cause its only for debug
    //ctx.strokeRect(0, 0, size.x, size.y);

    ctx.restore();
  }
}
