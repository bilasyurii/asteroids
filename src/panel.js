import GUIElement from './guiElement.js';

export default class Panel extends GUIElement {
  constructor(screenPosition, screenSize, children) {
    super(screenPosition, screenSize);

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
    if (this.visible === false) {
      return false;
    }

    const size = this.screenSize.toAbsolute(width, height);

    ctx.save();
    super.translate(ctx, width, height);

    //TODO remove cause its only for debug
    //ctx.strokeRect(0, 0, size.x, size.y);

    for (const child of this.children) {
      child.draw(ctx, size.x, size.y);
    }

    ctx.restore();
  }
}
