var React = require('react');
var Dungeon = require('./Dungeon');
var PlayerInfo = require('./PlayerInfo');
var DungeonInfo = require('./DungeonInfo');

var Grid = require('react-bootstrap').Grid;
var Row = require('react-bootstrap').Row;
var Col = require('react-bootstrap').Col;

var App = React.createClass({
  getInitialState: function() {
    return {
      dungeonSize: 41,
      dungeonLevel: 0,
      dungeons: [],
      player: {
        x: 25,
        y: 25,
        level: 1,
        xp: 0,
        alive: true,
        health: 100,
        armor: 0,
        attackLevel: 1,
        toString: function() {
          return 'P'
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
    let player = this.state.player;

    let movePlayer = function(x, y) {
      dungeon[x][y] = player;
      dungeon[player.x][player.y] = ' ';

      player.x = x;
      player.y = y;

      return player;
    };

    let addPlayerExperience = function(player, attackLevel) {
      player.xp += attackLevel * 5;
      nextLevel = Math.pow(player.level + 1, 2) * 10;
      if (player.xp == nextLevel) {
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
      let playerAttack = attackAmount(player.attackLevel);
      monster.health -= playerAttack;
      player.health -= monsterAttack;
      if (monster.health <= 0) {
        monsterDie = true;
        player.attackLevel = (player.attackLevel < monster.attackLevel)
          ? monster.attackLevel
          : player.attackLevel;
        player = addPlayerExperience(player, monster.attackLevel);
      }
      if (player.health <= 0) {
        player.alive = false;
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
            player = movePlayer(newX, newY);
            break;
          case 'monster':
            console.log('monster', cell.health);
            if (monsterFight(newX, newY)) {
              player = movePlayer(newX, newY);
            }
            break;
          case 'ladder':
              dungeon = this.initializeDungeon();
              break;
          default:
            // do nothing. Assuming a wall or other objet I haven't dealt with yet.
            break;
        }

      }

      this.setState({dungeon: dungeon, player: player});
    }
  },

  initializeDungeon: function() {
    let dungeonLevel = this.state.dungeonLevel + 1;
    let dungeonSize = this.state.dungeonSize;

    //let dungeon = new Array(dungeonSize).fill(new Array(dungeonSize).fill(' '));
    let dungeon = new Array(dungeonSize).fill(' ');
    dungeon = dungeon.map((row) => {
      return new Array(dungeonSize).fill(' ');
    });
    console.log("initializeDungeon", dungeonLevel);

    dungeon = this.initializeWalls(dungeon);
    dungeon = this.initializePlayer(dungeon);
    dungeon = this.initializeTreasure(dungeon);
    dungeon = this.initializeMonsters(dungeon);
    dungeon = this.initializeLadder(dungeon);

    if (dungeonLevel == 4) {
      // add Boss.
      console.log("Shouldn't there be a boss?");
    }

    this.setState({dungeonLevel: dungeonLevel});
    return dungeon;
  },

  initializePlayer: function(dungeon) {
    // Once we randomize the dungeon, we may have to keep track of entry points.
    dungeon[this.state.player.x][this.state.player.y] = this.state.player;
    return dungeon;
  },

  initializeTreasure: function(dungeon) {
    let Treasure = function(x, y, level) {
      this.type = 'treasure';
      this.x = x;
      this.y = y;
      this.health = level * 20;
      this.toString = function() {
        return '+';
      }
    };

    let treasureLimit = Math.sqrt(this.state.dungeonSize);
    let treasureLevel = this.state.dungeonLevel + 1;
    for (let i = 0; i < treasureLimit; i++) {
      let x = Math.floor(Math.random() * this.state.dungeonSize);
      let y = Math.floor(Math.random() * this.state.dungeonSize);
      //console.log("Treasure at ", x, y);
      if (dungeon[x][y] == ' ') {
        dungeon[x][y] = new Treasure(x, y, treasureLevel);
      } else {
        i--;
      }
    }

    return dungeon;
  },

  initializeMonsters: function(dungeon) {
    let Monster = function(x, y, level) {
      this.type = 'monster';
      this.x = x;
      this.y = y;
      this.health = (level + 1) * 10;
      this.attackLevel = level + 1;
      this.kind = 'M';
      if (level > 4) {
        this.kind = 'B';
      }
      this.toString = function() {
        return this.kind;
      }
    };

    let monsterLimit = Math.sqrt(this.state.dungeonSize / 2);
    let monsterLevel = this.state.dungeonLevel + 1;
    for (let i = 0; i < monsterLimit; i++) {
      let x = Math.floor(Math.random() * this.state.dungeonSize);
      let y = Math.floor(Math.random() * this.state.dungeonSize);
      //console.log("Monster at ", x, y);
      if (dungeon[x][y] == ' ') {
        dungeon[x][y] = new Monster(x, y, monsterLevel);
      }
    }

    if (this.state.dungeonLevel == 3) {
      for (let i = 0; i < 1; i++) {
        let x = Math.floor(Math.random() * this.state.dungeonSize);
        let y = Math.floor(Math.random() * this.state.dungeonSize);
        if (dungeon[x][y] == ' ') {
          dungeon[x][y] = new Monster(x, y, 6);
        }
      }
    }

    return dungeon;
  },

  initializeLadder: function(dungeon) {
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

    if (this.state.dungeonLevel < 3) {
      for (let i = 0; i < 1; i++) {
        let x = Math.floor(Math.random() * this.state.dungeonSize);
        let y = Math.floor(Math.random() * this.state.dungeonSize);
        if (dungeon[x][y] == ' ') {
          dungeon[x][y] = new Ladder(x, y, 1);
        } else {
          i--;
        }
      }
    }

    return dungeon;
  },

  initializeWalls: function(dungeon) {
    let dungeonSize = this.state.dungeonSize;
    let Wall = function(x, y) {
      this.type = 'wall';
      this.x = x;
      this.y = y;
      this.toString = function() {
        return '#';
      }
    };

    for (let i = 0; i < dungeonSize; i += 10) {
      for (let j = 0; j < dungeonSize; j++) {
        //console.log(i, j);
        dungeon[j][i] = new Wall(i, j);
        dungeon[i][j] = new Wall(i, j);
      }
    }

    for (let i = 10; i < (dungeonSize - 5); i += 10) {
      for (let j = 5; j < (dungeonSize - 5); j += 10) {
        //console.log(i, j);
        dungeon[j][i] = ' ';
        dungeon[i][j] = ' ';
      }
    }

    return dungeon;
  },

  render: function() {
    let player = this.state.player;
    let dungeon = this.state.dungeon;
    return (
      <Grid>
        <Row>
          <Col xs={12} md={6}>
            <Dungeon dungeon={dungeon} player={player}/>
          </Col>
          <Col xs={12} md={6}>
            <PlayerInfo player={player}/>
            <DungeonInfo dungeonLevel={this.state.dungeonLevel}/>
          </Col>
        </Row>
      </Grid>
    );
  }

});

module.exports = App;
