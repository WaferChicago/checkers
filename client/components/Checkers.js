/* eslint-disable no-console */
import React from 'react';
import Message from './Message';
import Player from './Player';
import Board from './Board';

class Game extends React.Component {
  constructor(props) {
    super(props);
    // build def
    const board = new Array(8);
    for (let y = 0; y < 8; y++) {
      board[y] = new Array(8).fill(null);
    }
    this.state = {
      game: {
        board,
        player1: null,
        player2: null,
      },
    };
    console.log('checkers state.game:', this.state.game);
  }
  componentWillMount() {
    const body = JSON.stringify({
      player1: '01234567890123456789abcd',
      player2: '01234567890123456789abc2',
    });
    fetch('//localhost:3333/games',
      { method: 'post',
        body,
        headers: { 'Content-Type': 'application/json' } })
      .then(r => r.json())
      .then(j => {
        console.log('returnNewGame-j:', j);
        this.setState({ game: j.game });
      });
  }
  render() {
    console.log('this.state.game:', this.state.game);
    return (
      <div>
        <Message />
        <Player player={this.state.game.player1} />
        <Board board={this.state.game.board} />
        <Player player={this.state.game ? this.state.game.player2 : null} />
      </div>
    );
  }
}
export default Game;
