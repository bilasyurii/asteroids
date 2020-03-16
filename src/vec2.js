export default class Vec2 {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }

  get length() {
    return Math.sqrt(x * x + y * y);
  }

  get normalized() {
    const length = this.length;

    if (length === 0) {
      return Vec2.zero;
    }

    return this.multiply(1 / this.length);
  }

  multiply(factor) {
    return new Vec2(this.x * factor, this.y * factor);
  }

  add(other) {
    return new Vec2(this.x + other.x, this.y + other.y);
  }

  substract(other) {
    return new Vec2(this.x - other.x, this.y - other.y);
  }

  equals(other) {
    return this.x === other.x && this.y === other.y;
  }

  static get zero() {
    return new Vec2(0, 0);
  }

  static get up() {
    return new Vec2(0, 1);
  }

  static get down() {
    return new Vec2(0, -1);
  }

  static get right() {
    return new Vec2(1, 0);
  }

  static get left() {
    return new Vec2(-1, 0);
  }
}
