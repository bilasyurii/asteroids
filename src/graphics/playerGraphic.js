import Vec2 from "../utils/vec2.js";
import { playerSize } from "../entities/player.js";
import LineGraphic from "./lineGraphic.js";

export default class PlayerGraphic {
  constructor() {
    const halfPlayerSize = playerSize / 2;
    
    const lines = [];

    lines.push({
      from: new Vec2(halfPlayerSize, 0),
      to: new Vec2(-halfPlayerSize, -halfPlayerSize)
    });

    lines.push({
      from: new Vec2(halfPlayerSize, 0),
      to: new Vec2(-halfPlayerSize, halfPlayerSize)
    });

    lines.push({
      from: new Vec2(-halfPlayerSize * 0.5, -0.75 * halfPlayerSize),
      to: new Vec2(-halfPlayerSize * 0.5, 0.75 * halfPlayerSize)
    });

    this.shipGraphic = new LineGraphic(lines);
  }

  draw(ctx) {
    this.shipGraphic.draw(ctx);
  }
}
