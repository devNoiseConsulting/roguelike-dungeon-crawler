class Ladder {
  constructor(x, y, level) {
    this.type = 'ladder';
    this.x = x;
    this.y = y;
    this.level = level;
  }

  toString() {
    return (this.level < 0)
      ? '<'
      : '>';
  }
}

module.exports = Ladder;
