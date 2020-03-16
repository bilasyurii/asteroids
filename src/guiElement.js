import Vec2 from './vec2.js';

export default class GUIElement {
  constructor(screenPosition) {
    this.screenPosition = screenPosition;
    this.visible = true;
  }
}
