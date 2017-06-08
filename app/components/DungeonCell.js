var React = require('react');

var DungeonCell = React.createClass({
  getInitialState: function() {
    return {};
  },
  componentDidMount: function() {
    //console.log(this.props.cell);

  },

  render: function() {
    let cell = this.props.cell;
    if (!cell) {
      cell = '.';
    }
    return (
      <span>{cell}</span>
    )
  }

});

module.exports = DungeonCell;
