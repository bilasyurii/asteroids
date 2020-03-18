import Utils from './utils.js';
import Vec2 from './vec2.js';

export default class Collider {
  constructor(position, tag) {
    this.position = position;
    this.tag = tag;
  }

  collides(other) {
    if (!Collider.getTagsCollisionRule(this.tag, other.tag)) {
      return false;
    }
  }

  static circle2circle(circle1, circle2) {
    return circle1.position.distance(circle2.position) < circle1.radius + circle2.radius;
  }

  static point2circle(point, circle) {
    return circle.position.distance(point.position) < circle.radius;
  }

  static isPointInNonRotatedRect(point, rect) {
    return Utils.isInRange(point.x - rect.position.x, -rect.size.x / 2, rect.size.x / 2) &&
           Utils.isInRange(point.y - rect.position.y, -rect.size.y / 2, rect.size.y / 2);
  }

  static point2rect(point, rect) {
    const rotatedPoint = point.position.rotate(rect.position, -rect.rotation);

    return Collider.isPointInNonRotatedRect(rotatedPoint, rect);
  }

  static circle2rect(circle, rect) {
    const rotatedCircleCenter = circle.position.rotate(rect.position, -rect.rotation);

    if(Collider.isPointInNonRotatedRect(rotatedCircleCenter, rect)) {
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

  static registerTagsCollisionRule(firstTag, secondTag, collide) {
    if (Collider.tagCollisionRules == undefined) {
      Collider.tagCollisionRules = {};
    }

    if (Collider.tagCollisionRules[firstTag] == undefined) {
      Collider.tagCollisionRules[firstTag] = {};
    }
    Collider.tagCollisionRules[firstTag][secondTag] = collide;
    
    if (Collider.tagCollisionRules[secondTag] == undefined) {
      Collider.tagCollisionRules[secondTag] = {};
    }
    Collider.tagCollisionRules[secondTag][firstTag] = collide;
  }

  static getTagsCollisionRule(firstTag, secondTag) {
    return Collider.tagCollisionRules[firstTag][secondTag];
  }
}
