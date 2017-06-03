var React = require('react');
var DungeonRow = require('./DungeonRow');

var Dungeon = React.createClass({
    getInitialState: function() {
        return {};
    },
    componentDidMount: function() {
    },

    render: function() {
      let dungeon = this.props.dungeon;
      if (!dungeon) {
        dungeon = [];
      }
        return (
            <div>
              <pre className="dungeon">Dungeon: Game Board goes here.<br />
              {dungeon.map(function(row, i) {
                  return (<DungeonRow row={row} key={i} rowid={i} />);
              }, this)}
              </pre>
            </div>
        )
    }

});

module.exports = Dungeon;
