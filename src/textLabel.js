import GUIElement from './guiElement.js';

export default class TextLabel extends GUIElement {
  constructor(text, size, screenPosition) {
    super(screenPosition);
    this.text = text;
    this.size = size;
  }

  draw(ctx, width, height) {
    if (!this.visible) {
      return;
    }
    
    ctx.font = this.size + 'px "Pixeled"';
    ctx.textAlign = this.screenPosition.originX;
    ctx.textBaseline = this.screenPosition.originY;

    const position = this.screenPosition.toAbsolute(width, height);

    ctx.fillText(this.text, position.x, position.y);
  }
}
