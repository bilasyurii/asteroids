import GUIElement from "./guiElement.js";

export default class GraphicGUIElement extends GUIElement {
  constructor(screenPosition, graphic, rotation, screenSize) {
    super(screenPosition, screenSize);
    this.graphic = graphic;
    this.rotation = rotation;
  }

  draw(ctx, width, height) {
    if (this.visible === false) {
      return false;
    }

    const size = this.screenSize.toAbsolute(width, height);

    ctx.save();
    super.translate(ctx, width, height);

    ctx.rotate(this.rotation);

    this.graphic.draw(ctx);

    ctx.restore();
  }
}
