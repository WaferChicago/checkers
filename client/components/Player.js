/* eslint-disable react/prop-types */
import React from 'react';

class Player extends React.Component {
  componentWillReceiveProps(nextProps) {
    const player = nextProps.player;
    this.state = { player };
  }

  render() {
    // console.log('this.state:', this.state);
    return (
      <div className="Player" >
        <div>Player: {this.state ? this.state.player.name : ''} </div>
      </div>
    );
  }
}
export default Player;
