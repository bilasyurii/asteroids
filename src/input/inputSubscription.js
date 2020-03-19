export default class InputSubscription {
  constructor(token, pressed, action) {
    this.token = token;
    this.pressed = pressed;
    this.action = action;
  }

  unsubscribe() {
    return this.action.unsubscribe(this.token, this.pressed);
  }
}
