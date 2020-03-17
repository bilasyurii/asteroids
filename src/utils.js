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

  static randomPointOnLine(lineStart, lineEnd) {
    const direction = lineEnd.substract(lineStart);
    const length = direction.length;
    const coefficient = Math.random() * length;
    return direction.normalized.multiply(coefficient).add(lineStart);
  }
}
