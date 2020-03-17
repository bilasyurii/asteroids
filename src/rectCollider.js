import Collider from "./collider.js";
import PointCollider from "./pointCollider.js";

export default class RectCollider extends Collider {
  constructor(position, size, rotation) {
    super(position);

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
    if (other instanceof CircleCollider) {
      return Collider.circle2rect(other, this);
    } else if (other instanceof PointCollider) {
      return Collider.point2rect(other, this);
    }
  }
}
