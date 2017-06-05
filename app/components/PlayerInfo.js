var React = require('react');
var ListGroup = require('react-bootstrap').ListGroup;
var ListGroupItem = require('react-bootstrap').ListGroupItem;
var Badge = require('react-bootstrap').Badge;

var PlayerInfo = React.createClass({
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
    let player = this.props.player;
    return (
      <div>
        <ListGroup>
          <ListGroupItem header="Player Info" bsStyle="info"></ListGroupItem>
          <ListGroupItem>Health
            <Badge>{player.health}</Badge>
          </ListGroupItem>
          <ListGroupItem>Armor
            <Badge>{player.armor}</Badge>
          </ListGroupItem>
          <ListGroupItem>Attack
            <Badge>{player.attackLevel}</Badge>
          </ListGroupItem>
          <ListGroupItem>Level
            <Badge>{player.level}</Badge>
          </ListGroupItem>
          <ListGroupItem>XP
            <Badge>{player.xp}</Badge>
          </ListGroupItem>
          <ListGroupItem>Location
            <Badge>{player.x}, {player.y}</Badge>
          </ListGroupItem>
        </ListGroup>
      </div>
    );
  }

});

module.exports = PlayerInfo;