var React = require('react');
var DungeonCell = require('./DungeonCell');

var DungeonRow = React.createClass({
  getInitialState: function() {
    return {};
  },
  componentDidMount: function() {},

  render: function() {
    let row = this.props.row;
    if (!row) {
      row = [];
    }
    var dungeonRowCells = row.map((cell, i) => {
      let cellId = this.props.rowid + ',' + i;
      if (typeof cell == 'string') {
        return (
          <span className={'cell, floor' + cell} key={cellId}>{cell}</span>
        );
      } else {
        return (
          <span className={'cell, ' + cell.type} key={cellId}>{cell.toString()}</span>
        );
      }
    });
    return (
      <span>
        {dungeonRowCells}<br/>
      </span>
    );
  }

});

module.exports = DungeonRow;
