class Treasure {
  constructor(x, y, level) {
    this.type = 'treasure';
    this.x = x;
    this.y = y;
    this.health = level * 10;
  }

  toString() {
    return '+';
  }
}

module.exports = Treasure;
