export default class GUIRenderer {
  constructor(ctx) {
    this.ctx = ctx;
    this.elements = {};
  }

  addElement(key, element) {
    this.elements[key] = element;
  }

  getElement(key) {
    return this.elements[key];
  }

  draw() {
    const width = this.ctx.canvas.clientWidth;
    const height = this.ctx.canvas.clientHeight;

    for (const key in this.elements) {
      const element = this.elements[key];
      element.draw(this.ctx, width, height);
    }
  }
}
