const Wall = require('./Wall');
const Ladder = require('./Ladder');
const Monster = require('./Monster');
const Treasure = require('./Treasure');
const Room = require('./Room');

class DungeonFactory {
  makeDungeon(currentState) {
    let dungeon = this.initializeFloors(currentState);
    dungeon = this.initializeRooms(dungeon, currentState);
    dungeon = this.initializePlayer(dungeon, currentState);
    dungeon = this.initializeTreasure(dungeon, currentState);
    dungeon = this.initializeMonsters(dungeon, currentState);
    dungeon = this.initializeLadder(dungeon, currentState);

    return dungeon;
  }

  initializePlayer(dungeon, currentState) {
    let player = currentState.player;
    dungeon[player.x][player.y] = player;

    return dungeon;
  }

  initializeTreasure(dungeon, currentState) {
    let treasureLimit = Math.sqrt(currentState.dungeonSize);
    let treasureLevel = currentState.dungeonLevel;
    for (let i = 0; i < treasureLimit; i++) {
      let x = Math.floor(Math.random() * currentState.dungeonSize);
      let y = Math.floor(Math.random() * currentState.dungeonSize);

      if (dungeon[x][y] == ' ') {
        dungeon[x][y] = new Treasure(x, y, treasureLevel);
      } else {
        i--;
      }
    }

    return dungeon;
  }

  initializeMonsters(dungeon, currentState) {
    let monsterLimit = Math.sqrt(currentState.dungeonSize / 2);
    let monsterLevel = currentState.dungeonLevel;

    for (let i = 0; i < monsterLimit; i++) {
      let x = Math.floor(Math.random() * currentState.dungeonSize);
      let y = Math.floor(Math.random() * currentState.dungeonSize);

      if (dungeon[x][y] == ' ') {
        dungeon[x][y] = new Monster(x, y, monsterLevel);
      } else {
        i--;
      }
    }

    if (currentState.dungeonLevel == 4) {
      for (let i = 0; i < 1; i++) {
        let x = Math.floor(Math.random() * currentState.dungeonSize);
        let y = Math.floor(Math.random() * currentState.dungeonSize);

        if (dungeon[x][y] == ' ') {
          dungeon[x][y] = new Monster(x, y, currentState.player.level * 2, true);
        } else {
          i--;
        }
      }
    }

    return dungeon;
  }

  initializeLadder(dungeon, currentState) {
    if (currentState.dungeonLevel < 4) {
      for (let i = 0; i < 1; i++) {
        let x = Math.floor(Math.random() * currentState.dungeonSize);
        let y = Math.floor(Math.random() * currentState.dungeonSize);

        if (dungeon[x][y] == ' ') {
          dungeon[x][y] = new Ladder(x, y, 1);
        } else {
          i--;
        }
      }
    }

    return dungeon;
  }

  verticalWall(dungeon, x, y, height) {
    for (let i = x; i < (x + height); i++) {
      dungeon[i][y] = new Wall(i, y);
    }

    return dungeon;
  }

  horizontalWall(dungeon, x, y, width) {
    for (let i = y; i < (y + width); i++) {
      dungeon[x][i] = new Wall(i, y);
    }

    return dungeon;
  }

  initializeFloors(currentState) {
    let dungeonSize = currentState.dungeonSize;

    let dungeon = new Array(dungeonSize).fill(' ');
    dungeon = dungeon.map((row) => {
      return new Array(dungeonSize).fill(' ');
    });

    return dungeon;
  }

  initializeRooms(dungeon, currentState) {
    // There are only 50 elements in the array so for creating rooms, the dungeon size is -1;
    let dungeonSize = currentState.dungeonSize - 1;
    dungeon[dungeonSize][dungeonSize] = new Wall(dungeonSize, dungeonSize);

    let dungeonRoom = new Room(0, 0, dungeonSize, dungeonSize);
    dungeonRoom.split();
    let dungeonRooms = dungeonRoom.traverse();

    // Make the Walls
    dungeonRooms.forEach(room => {
      //console.log(room);
      //console.log(dungeon[room.x]);
      dungeon = this.verticalWall(dungeon, room.x, room.y, room.width);
      dungeon = this.verticalWall(dungeon, room.x, (room.y + room.height), room.width);
      dungeon = this.horizontalWall(dungeon, room.x, room.y, room.height);
      dungeon = this.horizontalWall(dungeon, (room.x + room.width), room.y, room.height);

    });
    // Make the doors
    dungeonRooms.forEach(room => {
      if (room.door.x !== null) {
        dungeon[room.door.x][room.door.y] = ' ';
      }
    });

    return dungeon;
  }

  movePlayer(currentState, x, y) {
    let dungeon = currentState.dungeon;
    let player = currentState.player;

    dungeon[x][y] = player;
    dungeon[player.x][player.y] = ' ';

    player.x = x;
    player.y = y;
    currentState.player = player;

    return currentState;
  }

  getLoot(currentState, x, y) {
    let player = currentState.player;
    let treasure = currentState.dungeon[x][y];

    player.health += treasure.health;
    player.health = (player.health < 100)
      ? player.health
      : 100;
    currentState.player = player;
    currentState = this.movePlayer(currentState, x, y);

    return currentState;
  }

  addPlayerExperience(player, monsterLevel) {
    player.xp += monsterLevel * 5;
    let nextLevel = Math.pow(player.level + 1, 2) * 10;
    if (player.xp >= nextLevel) {
      player.level++;
      player.health = (player.health < 100)
        ? 100
        : player.health;
    }

    return player;
  }

  attackAmount(level) {
    let attacks = new Array(level).fill(0);
    return attacks.map(v => Math.floor(Math.random() * 4)).reduce((acc, v) => acc + 4, 0) + 4;
  }

  monsterFight(currentState, x, y) {
    let player = currentState.player;
    let dungeon = currentState.dungeon;

    let monsterDie = false;
    let monster = dungeon[x][y];
    let monsterAttack = this.attackAmount(monster.attackLevel);
    let playerAttack = this.attackAmount(player.level + player.attackLevel);
    monster.health -= playerAttack;
    player.health -= monsterAttack;

    if (monster.health <= 0) {
      monsterDie = true;
      player.attackLevel = (player.attackLevel < monster.attackLevel)
        ? monster.attackLevel
        : player.attackLevel;
      player = this.addPlayerExperience(player, monster.attackLevel);
      if (monster.kind == 'B') {
        currentState.dungeonWon = true;
      }
    } else {
      dungeon[x][y] = monster;
    }

    if (player.health <= 0) {
      player.alive = false;
      monsterDie = false;
    }

    currentState.dungeon = dungeon;
    currentState.player = player;

    if (monsterDie) {
      currentState = this.movePlayer(currentState, x, y);
    }

    return currentState;
  }
};

module.exports = DungeonFactory;
