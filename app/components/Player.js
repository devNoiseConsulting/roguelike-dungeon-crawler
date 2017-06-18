class Player {
  constructor(x, y) {
    this.type = 'player';
    this.x = x;
    this.y = y;
    this.level = 1;
    this.xp = 0;
    this.alive = true;
    this.health = 100;
    this.armor = 0;
    this.attackLevel = 1;
  }

  toString() {
    return (this.alive)
      ? 'P'
      : 'd';
  }
}

module.exports = Player;
