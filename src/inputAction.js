import { Input } from "./input.js";
import InputSubscription from "./inputSubscription.js";

export default class InputAction {
  constructor(name) {
    this.name = name;
    this.pressed = false;
    this.keyDownSubscribers = {};
    this.keyUpSubscribers = {};
  }

  setPressedState(pressed) {
    this.pressed = pressed;

    if (pressed) {
      this.notify(this.keyDownSubscribers);
    } else {
      this.notify(this.keyUpSubscribers);
    }
  }

  notify(subscribers) {
    for (const subscriptionToken in subscribers) {
      subscribers[subscriptionToken]();
    }
  }

  subscribe(pressed, callback) {
    const subscriptionToken = '' + Input.newSubscriptionToken;

    if (pressed) {
      this.keyDownSubscribers[subscriptionToken] = callback;
    } else {
      this.keyUpSubscribers[subscriptionToken] = callback;
    }

    return new InputSubscription(subscriptionToken, pressed, this);
  }

  unsubscribe(subscriptionToken, pressed) {
    if (pressed) {
      for (const key in this.keyDownSubscribers) {
        if (this.keyDownSubscribers.hasOwnProperty(key)) {
          delete this.keyDownSubscribers[key];
          return true;
        }
      }
    } else {
      for (const key in this.keyUpSubscribers) {
        if (this.keyUpSubscribers.hasOwnProperty(key)) {
          delete this.keyUpSubscribers[key];
          return true;
        }
      }
    }

    return false;
  }
}
