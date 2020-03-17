export default class Utils {
  static clamp(value, min, max) {
    return Math.min(math.max(this, min), max);
  }

  static isInRange(value, min, max) {
    return value >= min && value <= max;
  }

  static randomInt(max) {
    return Math.floor(Math.random() * max);
  }
}