var React = require('react');
var DungeonCell = require('./DungeonCell');

var DungeonRow = React.createClass({
    getInitialState: function() {
        return {};
    },
    componentDidMount: function() {
    },

    render: function() {
      let row = this.props.row;
      if (!row) {
        row = [];
      }
        return (
            <span>
              {row.map(function(cell, i) {
                  return (<DungeonCell cell={cell} key={i} rowid={i} />);
              }, this)}
              <br />
            </span>
        )
    }

});

module.exports = DungeonRow;
