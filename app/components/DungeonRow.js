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
          <span className={'cell floor' + cell} key={cellId}></span>
        );
      } else {
        let cellType = (cell.kind == 'B')
          ? 'boss'
          : cell.type;
        return (
          <span className={'cell ' + cellType} key={cellId}></span>
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
