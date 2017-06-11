class Wall {
  constructor(x, y) {
    this.type = 'wall';
    this.x = x;
    this.y = y;
  }

  toString() {
    return '#';
  }
}

module.exports = Wall;
