var React = require('react');

class DungeonCell extends React.Component {
  //state = {};

  componentDidMount() {
    //console.log(this.props.cell);
  }

  render() {
    let cell = this.props.cell;
    if (!cell) {
      cell = '.';
    }
    return (
      <span>{cell}</span>
    )
  }
}

module.exports = DungeonCell;
