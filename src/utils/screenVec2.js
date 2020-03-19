import Vec2 from './vec2.js';
import { ScreenCoord } from './screenCoord.js';

export const OriginX = {
  CENTER: 'center',
  LEFT: 'left',
  RIGHT: 'right'
};

export const OriginY = {
  MIDDLE: 'middle',
  TOP: 'hanging',
  BOTTOM: 'bottom'
};

export class ScreenVec2 {
  constructor(x, y, originX, originY) {
    this.x = x;
    this.y = y;
    
    if (originX == undefined) {
      this.originX = OriginX.CENTER
    } else {
      this.originX = originX;
    }
    
    if (originY == undefined) {
      this.originY = OriginY.MIDDLE
    } else {
      this.originY = originY;
    }
  }

  getAbsoluteCoord(coord, parentSize) {
    if (coord instanceof ScreenCoord) {
      return coord.toAbsolute(parentSize);
    } else {
      return coord * parentSize;
    }
  }

  toAbsolute(width, height) {
    return new Vec2(this.getAbsoluteCoord(this.x, width), 
                    this.getAbsoluteCoord(this.y, height));
  }
}
