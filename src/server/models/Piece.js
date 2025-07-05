class Piece {
  constructor(type, x = 4, y = 0) {
    this.type = type;
    this.x = x;
    this.y = y;
    this.rotation = 0;
    this.shapes = this.getShapes();
  }

  getShapes() {
    const shapes = {
      I: [[[1, 1, 1, 1]]],
      O: [[[1, 1], [1, 1]]],
      T: [[[0, 1, 0], [1, 1, 1]]],
      S: [[[0, 1, 1], [1, 1, 0]]],
      Z: [[[1, 1, 0], [0, 1, 1]]],
      J: [[[1, 0, 0], [1, 1, 1]]],
      L: [[[0, 0, 1], [1, 1, 1]]]
    };
    return shapes[this.type] || shapes.I;
  }

  rotate() {
    this.rotation = (this.rotation + 1) % 4;
  }

  move(dx, dy) {
    this.x += dx;
    this.y += dy;
  }

  getCurrentShape() {
    return this.shapes[this.rotation] || this.shapes[0];
  }
}

module.exports = Piece;
