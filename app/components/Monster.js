class Monster {
  constructor(x, y, level, boss = false) {
    this.type = 'monster';
    this.x = x;
    this.y = y;
    this.health = (level + 1) * 10;
    this.attackLevel = level + 1;
    if (boss) {
      this.kind = 'B';
    } else {
      this.kind = 'M';
    }
  }

  toString() {
    return this.kind;
  }
}

module.exports = Monster;
