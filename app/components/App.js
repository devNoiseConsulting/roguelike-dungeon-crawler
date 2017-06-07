var React = require('react');
var Dungeon = require('./Dungeon');
var PlayerInfo = require('./PlayerInfo');
var DungeonInfo = require('./DungeonInfo');

var Grid = require('react-bootstrap').Grid;
var Row = require('react-bootstrap').Row;
var Col = require('react-bootstrap').Col;

var Button = require('react-bootstrap').Button;

var App = React.createClass({
  getInitialState: function() {
    return {
      dungeonSize: 41,
      dungeonLevel: 1,
      dungeonWon: false,
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

    let addPlayerExperience = function(player, attackLevel) {
      player.xp += attackLevel * 5;
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
      let playerAttack = attackAmount(player.attackLevel);
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
            console.log('monster', cell.attackLevel, cell.health);
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
    console.log("initializeDungeon", currentState.dungeonLevel, reset);

    dungeon = this.initializeWalls(dungeon, currentState);
    dungeon = this.initializePlayer(dungeon, currentState);
    dungeon = this.initializeTreasure(dungeon, currentState);
    dungeon = this.initializeMonsters(dungeon, currentState);
    dungeon = this.initializeLadder(dungeon, currentState);

    if (currentState.dungeonLevel == 4) {
      // add Boss.
      console.log("Shouldn't there be a boss?");
    }

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
    let Treasure = function(x, y, level) {
      this.type = 'treasure';
      this.x = x;
      this.y = y;
      this.health = level * 10;
      this.toString = function() {
        return '+';
      }
    };

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
          dungeon[x][y] = new Monster(x, y, 6);
        }
      }
    }

    return dungeon;
  },

  initializeLadder: function(dungeon, currentState) {
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
