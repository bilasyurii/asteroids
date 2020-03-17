import Collider from "./collider.js";
import RectCollider from "./rectCollider.js";
import PointCollider from "./pointCollider.js";

export default class CircleCollider extends Collider {
  constructor(position, radius) {
    super(position);
    this.radius = radius;
  }

  collides(other) {
    if (other instanceof CircleCollider) {
      return Collider.circle2circle(this, other);
    } else if (other instanceof RectCollider) {
      return Collider.circle2rect(this, other);
    } else if (other instanceof PointCollider) {
      return Collider.point2circle(other, this);
    }
  }
}
