const React = require('react');
const Dungeon = require('./Dungeon');
const PlayerInfo = require('./PlayerInfo');
const DungeonInfo = require('./DungeonInfo');

const Grid = require('react-bootstrap').Grid;
const Row = require('react-bootstrap').Row;
const Col = require('react-bootstrap').Col;

const Button = require('react-bootstrap').Button;

// Objects for dungeon cell types
let Ladder = function(x, y, level) {
  this.type = 'ladder';
  this.x = x;
  this.y = y;
  this.level = level;
  this.toString = function() {
    return (level < 0)
      ? '<'
      : '>';
  }
};

let Monster = function(x, y, level, boss = false) {
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
  this.toString = function() {
    return this.kind;
  }
};

let Treasure = function(x, y, level) {
  this.type = 'treasure';
  this.x = x;
  this.y = y;
  this.health = level * 10;
  this.toString = function() {
    return '+';
  }
};

let Wall = function(x, y) {
  this.type = 'wall';
  this.x = x;
  this.y = y;
  this.toString = function() {
    return '#';
  }
};

const App = React.createClass({
  getInitialState: function() {
    return {
      dungeonSize: 51,
      dungeonLevel: 1,
      dungeonWon: false,
      dungeons: [],
      player: {
        type: 'player',
        x: 25,
        y: 25,
        level: 1,
        xp: 0,
        alive: true,
        health: 100,
        armor: 0,
        attackLevel: 1,
        toString: function() {
          return (this.alive)
            ? 'P'
            : 'd';
        }
      }
    };
  },

  componentDidMount: function() {
    dungeon = this.initializeDungeon();
    this.setState({dungeon: dungeon});

    window.addEventListener('keydown', this.handleKeypress);
  },

  handleKeypress: function(e) {
    let keys = {
      'w': {
        'x': -1,
        'y': 0
      },
      'k': {
        'x': -1,
        'y': 0
      },
      'ArrowUp': {
        'x': -1,
        'y': 0
      },
      'a': {
        'x': 0,
        'y': -1
      },
      'h': {
        'x': 0,
        'y': -1
      },
      'ArrowLeft': {
        'x': 0,
        'y': -1
      },
      's': {
        'x': 1,
        'y': 0
      },
      'j': {
        'x': 1,
        'y': 0
      },
      'ArrowDown': {
        'x': 1,
        'y': 0
      },
      'd': {
        'x': 0,
        'y': 1
      },
      'l': {
        'x': 0,
        'y': 1
      },
      'ArrowRight': {
        'x': 0,
        'y': 1
      }
    };
    let dungeon = this.state.dungeon;
    let dungeonWon = this.state.dungeonWon;
    let player = this.state.player;

    let movePlayer = function(x, y) {
      dungeon[x][y] = player;
      dungeon[player.x][player.y] = ' ';

      player.x = x;
      player.y = y;

      return player;
    };

    let addPlayerExperience = function(player, monsterLevel) {
      player.xp += monsterLevel * 5;
      nextLevel = Math.pow(player.level + 1, 2) * 10;
      if (player.xp >= nextLevel) {
        player.level++;
        player.health = (player.health < 100)
          ? 100
          : player.health;
      }

      return player;
    };

    let attackAmount = function(level) {
      let attacks = new Array(level).fill(0);
      return attacks.map(v => Math.floor(Math.random() * 4)).reduce((acc, v) => acc + 4, 0) + 4;
    };

    let monsterFight = function(x, y) {
      let monsterDie = false;
      let monster = dungeon[x][y];
      let monsterAttack = attackAmount(monster.attackLevel);
      let playerAttack = attackAmount(player.level + player.attackLevel);
      monster.health -= playerAttack;
      player.health -= monsterAttack;
      if (monster.health <= 0) {
        monsterDie = true;
        player.attackLevel = (player.attackLevel < monster.attackLevel)
          ? monster.attackLevel
          : player.attackLevel;
        player = addPlayerExperience(player, monster.attackLevel);
        if (monster.kind == 'B') {
          dungeonWon = true;
        }
      }
      if (player.health <= 0) {
        player.alive = false;
        monsterDie = false;
      }
      dungeon[x][y] = monster;
      return monsterDie;
    };

    if (keys.hasOwnProperty(e.key) && player.alive) {
      let newX = player.x + keys[e.key].x;
      let newY = player.y + keys[e.key].y;
      let cell = dungeon[newX][newY];
      //console.log(newX, newY, cell);

      // Need to determine how to handle occupied cell
      // If wall do nothing.
      // If treasure, pick up and heal
      // If monter, fight
      if (cell == ' ') {
        player = movePlayer(newX, newY);
      } else {
        switch (cell.type) {
          case 'treasure':
            player.health += cell.health;
            player.health = (player.health < 100)
              ? player.health
              : 100;
            player = movePlayer(newX, newY);
            break;
          case 'monster':
            console.log('monster', cell.kind, cell.attackLevel, cell.health);
            if (monsterFight(newX, newY)) {
              player = movePlayer(newX, newY);
            }
            break;
          case 'ladder':
            dungeon = this.initializeDungeon(false);
            break;
          default:
            // do nothing. Assuming a wall or other objet I haven't dealt with yet.
            break;
        }

      }

      this.setState({dungeon: dungeon, dungeonWon: dungeonWon, player: player});
    }
  },

  initializeDungeon: function(reset = true) {
    let currentState = reset
      ? this.getInitialState()
      : this.state;
    let dungeonSize = currentState.dungeonSize;
    currentState.dungeonLevel = reset
      ? currentState.dungeonLevel
      : currentState.dungeonLevel + 1;

    //let dungeon = new Array(dungeonSize).fill(new Array(dungeonSize).fill(' '));
    let dungeon = new Array(dungeonSize).fill(' ');
    dungeon = dungeon.map((row) => {
      return new Array(dungeonSize).fill(' ');
    });

    dungeon = this.initializeWalls(dungeon, currentState);
    dungeon = this.initializeRooms(dungeon, currentState);
    dungeon = this.initializePlayer(dungeon, currentState);
    dungeon = this.initializeTreasure(dungeon, currentState);
    dungeon = this.initializeMonsters(dungeon, currentState);
    dungeon = this.initializeLadder(dungeon, currentState);

    this.setState({dungeonLevel: currentState.dungeonLevel});
    return dungeon;
  },

  initializePlayer: function(dungeon, currentState) {
    let player = currentState.player;
    console.log("initializePlayer", player.x, player.y);
    dungeon[player.x][player.y] = player;
    return dungeon;
  },

  initializeTreasure: function(dungeon, currentState) {
    let treasureLimit = Math.sqrt(currentState.dungeonSize);
    let treasureLevel = currentState.dungeonLevel;
    for (let i = 0; i < treasureLimit; i++) {
      let x = Math.floor(Math.random() * currentState.dungeonSize);
      let y = Math.floor(Math.random() * currentState.dungeonSize);
      //console.log("Treasure at ", x, y);
      if (dungeon[x][y] == ' ') {
        dungeon[x][y] = new Treasure(x, y, treasureLevel);
      } else {
        i--;
      }
    }

    return dungeon;
  },

  initializeMonsters: function(dungeon, currentState) {
    let monsterLimit = Math.sqrt(currentState.dungeonSize / 2);
    let monsterLevel = currentState.dungeonLevel;
    for (let i = 0; i < monsterLimit; i++) {
      let x = Math.floor(Math.random() * currentState.dungeonSize);
      let y = Math.floor(Math.random() * currentState.dungeonSize);
      //console.log("Monster at ", x, y);
      if (dungeon[x][y] == ' ') {
        dungeon[x][y] = new Monster(x, y, monsterLevel);
      }
    }

    if (currentState.dungeonLevel == 4) {
      for (let i = 0; i < 1; i++) {
        let x = Math.floor(Math.random() * currentState.dungeonSize);
        let y = Math.floor(Math.random() * currentState.dungeonSize);
        if (dungeon[x][y] == ' ') {
          dungeon[x][y] = new Monster(x, y, this.state.player.level * 2, true);
        }
      }
    }

    return dungeon;
  },

  initializeLadder: function(dungeon, currentState) {
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
  },

  initializeWalls: function(dungeon, currentState) {
    let dungeonSize = currentState.dungeonSize;

    for (let i = 0; i < dungeonSize; i++) {
      for (let j = 0; j < dungeonSize; j++) {
        dungeon[i][j] = new Wall(i, j);
      }
    }

    let roomStart = Math.floor(dungeonSize / 2) - 6;
    let roomEnd = Math.ceil(dungeonSize / 2) + 6;
    for (let i = roomStart; i < roomEnd; i++) {
      for (let j = roomStart; j < roomEnd; j++) {
        dungeon[i][j] = ' ';
      }
    }

    return dungeon;
  },

  initializeRooms: function(dungeon, currentState) {
    let dungeonSize = currentState.dungeonSize;
    let dungeonCenter = Math.ceil(dungeonSize / 2);

    let getDirection = function(oldDirection) {
      let direction = oldDirection;
      while (direction == oldDirection) {
        direction = Math.floor(Math.random() * 4) + 1;
      }
      return direction;
    }

    let addRoom = function(dungeon, x, y, width, height, direction) {
      let xDirection = 1;
      let yDirection = 1;
      switch (direction) {
        case 3:
          xDirection = -1;
          yDirection = 1;
          break;
        case 4:
          xDirection = 1;
          yDirection = -1;
          break;
      }
      let endX = x + (xDirection * width);
      let endY = y + (yDirection * height);
      if (x > endX) {
        let oldX = x;
        x = endX;
        endX = oldX;
      }
      if (y > endY) {
        let oldY = y;
        y = endY;
        endY = oldY;
      }
      for (let i = x; i < endX; i++) {
        for (let j = y; j < endY; j++) {
          dungeon[i][j] = ' ';
        }
      }
      return dungeon;
    };

    let width = 12;
    let height = 12;
    let direction = 1;
    let x = dungeonCenter - Math.floor(width / 2);
    let y = dungeonCenter - Math.floor(height / 2);

    for (let i = 0; i < 10; i++) {
      dungeon = addRoom(dungeon, x, y, width, height, direction);
      direction = getDirection(direction);

      if ((i % 2) === 0) {
        width -= 2;
        height -= 2;
      }
      console.log("addRooms", width, height);
    }

    return dungeon;
  },

  resetGame: function() {
    console.log("resetGame");
    let resetState = this.getInitialState();
    resetState['dungeon'] = this.initializeDungeon();
    this.setState(resetState);
  },

  continueGame: function() {
    console.log("continueGame");
    let player = this.state.player;
    player.alive = true;
    player.health = 100;
    this.setState({player: player});
  },

  render: function() {
    let player = this.state.player;
    let dungeon = this.state.dungeon;
    let dungeonWon = this.state.dungeonWon;
    let resetStyle = (dungeonWon)
      ? "primary"
      : "warning";
    let resetText = (dungeonWon)
      ? "New Game"
      : "Restart Game";
    let continueStatus = (player.alive)
      ? true
      : false;
    return (
      <Grid>
        <Row>
          <Col xs={12} md={6}>
            <Dungeon dungeon={dungeon} player={player} won={dungeonWon}/>
          </Col>
          <Col xs={12} md={6}>
            <DungeonInfo dungeonLevel={this.state.dungeonLevel} won={dungeonWon}/>
            <PlayerInfo player={player}/>
            <Row>
              <Col xs={12} md={6}>
                <Button bsStyle={resetStyle} bsSize="large" block onClick={this.resetGame}>{resetText}</Button>
              </Col>
              <Col xs={12} md={6}>
                <Button bsStyle="success" bsSize="large" disabled={continueStatus} block onClick={this.continueGame}>Continue</Button>
              </Col>
            </Row>
          </Col>
        </Row>
      </Grid>
    );
  }

});

module.exports = App;
