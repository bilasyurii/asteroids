export const ScreenCoordType = {
  RELATIVE: 'relative',
  ABSOLUTE: 'absolute'
};

export class ScreenCoord {
  constructor(value, type) {
    this.value = value;

    if (type == undefined) {
      this.type = ScreenCoordType.RELATIVE;
    } else {
      this.type = type;
    }
  }

  toAbsolute(parentSize) {
    if (this.type === ScreenCoordType.ABSOLUTE) {
      return this.value;
    } else {
      return this.value * parentSize;
    }
  }
}
