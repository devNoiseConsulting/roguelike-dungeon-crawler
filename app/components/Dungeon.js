var React = require('react');
var DungeonRow = require('./DungeonRow');

class Dungeon extends React.Component {
  //state = {};
  componentDidMount() {}

  hideDungeonCells(dungeon, player) {
    dungeon = dungeon.map((row, x) => {
      return row.map((cell, y) => {
        let diffX = Math.abs(player.x - x);
        let diffY = Math.abs(player.y - y);
        let distance = Math.sqrt(Math.pow(diffX, 2) + Math.pow(diffY, 2));
        if (distance < 7) {
          return cell;
        } else {
          return 'X';
        }
      })
    });

    return dungeon;
  };

  render() {
    let dungeon = this.props.dungeon;
    let won = this.props.won;
    if (!dungeon) {
      dungeon = [];
    } else if (!won) {
      dungeon = this.hideDungeonCells(dungeon, this.props.player);
    }
    return (
      <div>
        <pre className="dungeon">
              {dungeon.map(function(row, i) {
                  return (<DungeonRow row={row} key={i} rowid={i} />);
              }, this)}
              </pre>
      </div>
    )
  }
}

module.exports = Dungeon;
