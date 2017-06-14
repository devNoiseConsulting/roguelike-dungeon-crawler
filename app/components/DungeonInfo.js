var React = require('react');
var ListGroup = require('react-bootstrap').ListGroup;
var ListGroupItem = require('react-bootstrap').ListGroupItem;
var Badge = require('react-bootstrap').Badge;

class DungeonInfo extends React.Component {
  //state = {};

  componentDidMount() {
    //console.log(this.props.cell);
  }

  render() {
    /*
      level: 1,
      xp: 0,
      health: 100,
      armor: 0,
      attack: 1,
      */
    let dungeonLevel = this.props.dungeonLevel;
    let dungeonWon = <ListGroupItem bsStyle="success">You beat the Boss!</ListGroupItem>;
    if (!this.props.won) {
      dungeonWon = '';
    }
    return (
      <div>
        <ListGroup>
          <ListGroupItem header="Dungeon Info" bsStyle="info"></ListGroupItem>
          {dungeonWon}
          <ListGroupItem>Level
            <Badge>{dungeonLevel}</Badge>
          </ListGroupItem>
        </ListGroup>
      </div>
    );
  }
}

module.exports = DungeonInfo;
