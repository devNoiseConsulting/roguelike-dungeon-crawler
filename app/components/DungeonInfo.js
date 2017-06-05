var React = require('react');
var ListGroup = require('react-bootstrap').ListGroup;
var ListGroupItem = require('react-bootstrap').ListGroupItem;
var Badge = require('react-bootstrap').Badge;

var DungeonInfo = React.createClass({
  getInitialState: function() {
    return {};
  },
  componentDidMount: function() {
    //console.log(this.props.cell);
  },

  render: function() {
    /*
      level: 1,
      xp: 0,
      health: 100,
      armor: 0,
      attack: 1,
      */
    let dungeonLevel = this.props.dungeonLevel;
    return (
      <div>
        <ListGroup>
          <ListGroupItem header="Dungeon Info" bsStyle="info"></ListGroupItem>
          <ListGroupItem>Level
            <Badge>{dungeonLevel}</Badge>
          </ListGroupItem>
        </ListGroup>
      </div>
    );
  }

});

module.exports = DungeonInfo;