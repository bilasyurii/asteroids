import Collider from "./collider.js";
import RectCollider from "./rectCollider.js";

export default class PointCollider extends Collider {
  constructor(position) {
    super(position);
  }

  collides(other) {
    if (other instanceof CircleCollider) {
      return Collider.point2circle(this, other);
    } else if (other instanceof RectCollider) {
      return Collider.point2rect(this, other);
    }
  }
}
