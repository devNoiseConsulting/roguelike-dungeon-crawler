var React = require('react');
var Dungeon = require('./Dungeon');

var App = React.createClass({
  getInitialState: function() {
    return {};
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
    let oldX = this.state.xLocation;
    let oldY = this.state.yLocation;
    let newX = oldX + keys[e.key].x;
    let newY = oldY + keys[e.key].y;
    console.log(newX, newY);
    let dungeon = this.state.dungeon;
    if (dungeon[newX][newY] == ' ') {
      dungeon[newX][newY] = '0';
      dungeon[oldX][oldY] = ' ';
      this.setState({dungeon: dungeon, xLocation: newX, yLocation: newY});
    }

  },
  initializeDungeon: function() {
    let dungeonSize = 41;
    //let dungeon = new Array(dungeonSize).fill(new Array(dungeonSize).fill(" "));
    let dungeon = new Array(dungeonSize).fill(" ");
    dungeon = dungeon.map((row) => {
      return new Array(dungeonSize).fill(" ");
    });
    //console.log(dungeon);

    for (let i = 0; i < dungeonSize; i += 10) {
      for (let j = 0; j < dungeonSize; j++) {
        //console.log(i, j);
        dungeon[j][i] = '#';
        dungeon[i][j] = '#';
      }
    }

    for (let i = 10; i < (dungeonSize - 5); i += 10) {
      for (let j = 5; j < (dungeonSize - 5); j += 10) {
        //console.log(i, j);
        dungeon[j][i] = ' ';
        dungeon[i][j] = ' ';
      }
    }

    dungeon[25][25] = '0';

    this.setState({dungeon: dungeon, xLocation: 25, yLocation: 25});
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
