var React = require('react');
var Dungeon = require('./Dungeon');

var App = React.createClass({
    getInitialState: function() {
        return {};
    },
    componentDidMount: function() {
      this.initializeDungeon();
    },

    initializeDungeon: function() {
      let dungeonSize = 101;
      //let dungeon = new Array(dungeonSize).fill(new Array(dungeonSize).fill(" "));
      let dungeon = new Array(dungeonSize).fill(" ");
      dungeon = dungeon.map((row) => { return new Array(dungeonSize).fill(" "); });
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

      this.setState({dungeon: dungeon});
    },

    render: function() {
        return (
            <Dungeon dungeon={this.state.dungeon} />
        )
    }

});

module.exports = App;
