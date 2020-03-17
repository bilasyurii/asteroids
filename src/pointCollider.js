import Collider from "./collider.js";
import RectCollider from "./rectCollider.js";
import CircleCollider from "./circleCollider.js";

export default class PointCollider extends Collider {
  constructor(position, tag) {
    super(position, tag);
  }

  collides(other) {
    if (super.collides(other) === false) {
      return false;
    }

    if (other instanceof CircleCollider) {
      return Collider.point2circle(this, other);
    } else if (other instanceof RectCollider) {
      return Collider.point2rect(this, other);
    }
  }
}
