import Utils from './utils.js';
import Vec2 from './vec2.js';

export default class Collider {
  constructor(position) {
    this.position = position;
  }

  updatePosition(position) {
    this.position.x = position.x;
    this.position.y = position.y;
  }

  static circle2circle(circle1, circle2) {
    return circle1.position.distance(circle2.position) < circle1.radius + circle2.radius;
  }

  static point2circle(point, circle) {
    return circle.position.distance(point.position) < circle.radius;
  }

  static isPointInNonRotatedRect(point, rect) {
    return Utils.isInRange(rotatedCircleCenter.x - rect.position.x, -rect.size.x / 2, rect.size.x / 2) &&
           Utils.isInRange(rotatedCircleCenter.y - rect.position.y, -rect.size.y / 2, rect.size.y / 2);
  }

  static point2rect(point, rect) {
    const rotatedPoint = point.position.rotate(rect.position, -rect.angle);

    return isPointInNonRotatedRect(rotatedCircleCenter, rect);
  }

  static circle2rect(circle, rect) {
    const rotatedCircleCenter = circle.position.rotate(rect.position, -rect.angle);

    if(isPointInNonRotatedRect(rotatedCircleCenter, rect)) {
      return true;
    }

    let closestPointOnRect = new Vec2(Utils.clamp(rotatedCircleCenter.x,
                                                  rect.position.x - rect.size.x / 2,
                                                  rect.position.x + rect.size.x / 2),
                                      Utils.clamp(rotatedCircleCenter.y,
                                                  rect.position.y - rect.size.y / 2,
                                                  rect.position.y + rect.size.y / 2));

    return rotatedCircleCenter.distance(closestPointOnRect) < circle.radius;
  }
}
