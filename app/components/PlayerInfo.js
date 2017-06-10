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
    let dead = <ListGroupItem bsStyle="danger">You have died!</ListGroupItem>;
    if (player.alive) {
      dead = '';
    }
    return (
      <div>
        <ListGroup>
          <ListGroupItem header="Player Info" bsStyle="info">
            Keys: w =&nbsp;
            <span className="glyphicon glyphicon-arrow-up" aria-label="up"></span>&nbsp;
            | s =&nbsp;
            <span className="glyphicon glyphicon-arrow-down" aria-label="down"></span>&nbsp;
            | a =&nbsp;
            <span className="glyphicon glyphicon-arrow-left" aria-label="left"></span>&nbsp;
            | d =&nbsp;
            <span className="glyphicon glyphicon-arrow-right" aria-label="right"></span>&nbsp;
          </ListGroupItem>
          {dead}
          <ListGroupItem>Health
            <Badge>{player.health}</Badge>
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
