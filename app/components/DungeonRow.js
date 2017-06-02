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
              {row.join('')}
              <br />
            </span>
        )
    }

});

module.exports = DungeonRow;
