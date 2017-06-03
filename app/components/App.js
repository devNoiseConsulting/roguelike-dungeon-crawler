var React = require('react');
var Dungeon = require('./Dungeon');

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
        health: 100,
        armor: 0,
        attack: 1,
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
      'W': {
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
      'A': {
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
      'S': {
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
      'D': {
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
    }

    if (keys.hasOwnProperty(e.key)) {
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

    this.setState({dungeon: dungeon});
  },

  initializePlayer: function(dungeon) {
    dungeon[this.state.player.x][this.state.player.y] = this.state.player;
    return dungeon;
  },

  initializeTreasure: function(dungeon) {
    let Treasure = function() {
      this.type = 'treasure';
      this.health = 20;
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
        dungeon[x][y] = new Treasure;
      }
    }

    return dungeon;
  },

  initializeMonsters: function(dungeon) {
    let Monster = function() {
      this.type = 'monster';
      this.health = 20;
      this.attack = 2;
      this.toString = function() {
        return 'M';
      }
    };

    let treasureLimit = Math.sqrt(this.state.dungeonSize / 2);
    for (let i = 0; i < treasureLimit; i++) {
      let x = Math.floor(Math.random() * this.state.dungeonSize);
      let y = Math.floor(Math.random() * this.state.dungeonSize);
      //console.log("Monster at ", x, y);
      if (dungeon[x][y] == ' ') {
        dungeon[x][y] = new Monster;
      }
    }

    return dungeon;
  },

  initializeWalls: function(dungeon) {
    let dungeonSize = this.state.dungeonSize;
    let Wall = function() {
      this.type = 'wall';
      this.toString = function() {
        return '#';
      }
    };

    for (let i = 0; i < dungeonSize; i += 10) {
      for (let j = 0; j < dungeonSize; j++) {
        //console.log(i, j);
        dungeon[j][i] = new Wall();
        dungeon[i][j] = new Wall();
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
    return (
      <div>
        <Dungeon dungeon={this.state.dungeon}/>
        <p>X: {this.state.xLocation}, Y: {this.state.yLocation}</p>
      </div>
    )
  }

});

module.exports = App;
