import Collider from "./collider.js";
import PointCollider from "./pointCollider.js";
import CircleCollider from "./circleCollider.js";

export default class RectCollider extends Collider {
  constructor(position, tag, size, rotation) {
    super(position, tag);

    this.size = size;

    if (rotation == undefined) {
      this.rotation = 0;
    } else {
      this.rotation = rotation;
    }
  }

  rotate(angle) {
    this.rotation += angle;
  }

  collides(other) {
    if (super.collides(other) === false) {
      return false;
    }

    if (other instanceof CircleCollider) {
      return Collider.circle2rect(other, this);
    } else if (other instanceof PointCollider) {
      return Collider.point2rect(other, this);
    }
  }
}
