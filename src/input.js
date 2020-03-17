import InputAction from "./inputAction.js";

export const Key = {
  W: 87,
  A: 65,
  S: 83,
  D: 68,
  UP_ARROW: 38,
  LEFT_ARROW: 37,
  DOWN_ARROW: 40,
  RIGHT_ARROW: 39,
  SPACE: 32,
  RETURN: 13
}

export class Input {
  constructor() {
    this.left = new InputAction('left');
    this.right = new InputAction('right');
    this.up = new InputAction('up');
    this.down = new InputAction('down');
    this.action = new InputAction('action');

    this.init();
  }

  init() {
    this.subscribeToKeyboardEvents();
  }

  subscribeToKeyboardEvents() {
    document.addEventListener('keydown', 
                              (event) => this.onKeyEvent(event, true),
                              false);

    document.addEventListener('keyup', 
                              (event) => this.onKeyEvent(event, false),
                              false);
  }

  onKeyEvent(event, pressed) {
    switch (event.keyCode) {
      case Key.W:
      case Key.UP_ARROW:
        this.up.setPressedState(pressed);
        event.preventDefault();
        break;
      
      case Key.A:
      case Key.LEFT_ARROW:
        this.left.setPressedState(pressed);
        event.preventDefault();
        break;

      case Key.S:
      case Key.DOWN_ARROW:
        this.down.setPressedState(pressed);
        event.preventDefault();
        break;

      case Key.D:
      case Key.RIGHT_ARROW:
        this.right.setPressedState(pressed);
        event.preventDefault();
        break;

      case Key.SPACE:
      case Key.RETURN:
        this.action.setPressedState(pressed);
        event.preventDefault();
        break;
    }
  }

  static get newSubscriptionToken() {
    if (Input.subscriptionToken == undefined) {
      Input.subscriptionToken = 0;
    }
    return Input.subscriptionToken++;
  }
}
