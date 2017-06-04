var React = require('react');
var Dungeon = require('./Dungeon');
var PlayerInfo = require('./PlayerInfo');

var Grid = require('react-bootstrap').Grid;
var Row = require('react-bootstrap').Row;
var Col = require('react-bootstrap').Col;

var App = React.createClass({
  getInitialState: function() {
    return {
      dungeonSize: 41,
      dungeonLevel: 1,
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
    this.initializeDungeon();
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
        player.attackLevel = (player.attackLevel < monster.attackLevel) ? monster.attackLevel : player.attackLevel;
        player.xp += monster.attackLevel * 5;
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
      //console.log(newX, newY);
      if (dungeon[newX][newY] == ' ') {
        player = movePlayer(newX, newY);
      } else {
        let cell = dungeon[newX][newY];
        console.log(cell.type);
        // Need to determine how to handle occupied cell
        // If wall do nothing.
        // If treasure, pick up and heal
        // If monter, fight
        switch (cell.type) {
          case 'treasure':
            player.health += cell.health;
            player = movePlayer(newX, newY);
            break;
          case 'monster':
            // fight
            console.log(cell.health);
            if (monsterFight(newX, newY)) {
              player = movePlayer(newX, newY);
            }
            break;
        }
      }
      this.setState({dungeon: dungeon, player: player});
    }

  },

  initializeDungeon: function() {
    let dungeonSize = this.state.dungeonSize;

    //let dungeon = new Array(dungeonSize).fill(new Array(dungeonSize).fill(" "));
    let dungeon = new Array(dungeonSize).fill(" ");
    dungeon = dungeon.map((row) => {
      return new Array(dungeonSize).fill(" ");
    });
    console.log("initializeDungeon", dungeon.length);

    dungeon = this.initializeWalls(dungeon);
    dungeon = this.initializePlayer(dungeon);
    dungeon = this.initializeTreasure(dungeon);
    dungeon = this.initializeMonsters(dungeon);
    // Setup dungeon stair to enter the next level.

    this.setState({dungeon: dungeon});
  },

  initializePlayer: function(dungeon) {
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
    for (let i = 0; i < treasureLimit; i++) {
      let x = Math.floor(Math.random() * this.state.dungeonSize);
      let y = Math.floor(Math.random() * this.state.dungeonSize);
      //console.log("Treasure at ", x, y);
      if (dungeon[x][y] == ' ') {
        dungeon[x][y] = new Treasure(x, y, this.state.dungeonLevel);
      } else {
        i--;
      }
    }

    return dungeon;
  },

  initializeMonsters : function(dungeon) {
    let Monster = function(x, y, level) {
      this.type = 'monster';
      this.x = x;
      this.y = y;
      this.health = (level + 1) * 10;
      this.attackLevel = level + 1;
      this.toString = function() {
        return 'M';
      }
    };

    let monsterLimit = Math.sqrt(this.state.dungeonSize / 2);
    for (let i = 0; i < monsterLimit; i++) {
      let x = Math.floor(Math.random() * this.state.dungeonSize);
      let y = Math.floor(Math.random() * this.state.dungeonSize);
      //console.log("Monster at ", x, y);
      if (dungeon[x][y] == ' ') {
        dungeon[x][y] = new Monster(x, y, this.state.dungeonLevel);
      }
    }

    return dungeon;
  },

  initializeWalls : function(dungeon) {
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

  render : function() {
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
          </Col>
        </Row>
      </Grid>
    );
  }

});

module.exports = App;
