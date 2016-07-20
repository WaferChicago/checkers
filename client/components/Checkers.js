/* eslint-disable no-console, max-len, no-underscore-dangle */
import React from 'react';
import Message from './Message';
import Player from './Player';
import Board from './Board';

class Game extends React.Component {
  constructor(props) {
    super(props);
    const board = new Array(8);
    for (let y = 0; y < 8; y++) {
      board[y] = new Array(8).fill(null);
    }
    this.from = undefined;
    this.state = {
      game: {
        board,
        player1: null,
        player2: null,
        playerTurn: 'Black',
      },
      message: '',
    };
    this.moveChecker = this.moveChecker.bind(this);
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
        this.setState({ game: j.game });
      });
  }
  getPlayer() {
    const player = (this.state.game.playerTurn === 'Black') ? this.state.game.player1 : this.state.game.player2;
    console.log('GetPlayer:', player);
    return player;
  }

  moveChecker(event) {
    const x = event.target.attributes.getNamedItem('data-x').value;
    const y = event.target.attributes.getNamedItem('data-y').value;
    if (this.from !== undefined) {
      console.log('moving checker from:', { y: this.from.y, x: this.from.x }, 'to:', { y, x });
      const player = this.getPlayer()._id;
      const body = JSON.stringify({ player,
            from: { y: this.from.y, x: this.from.x },
            to: { y, x } });
      this.from = undefined;
      fetch(`//localhost:3333/games/${this.state.game._id}/move`,
        { method: 'put',
          body,
          headers: { 'Content-Type': 'application/json' } })
        .then(r => {
          if (r.status === 200) {
            return r.json();
          }
          return r.text();
        })
        .then((j) => {
          if (typeof j === 'string') {
            throw new Error(j);
          }
          this.setState({ game: j.game, to: undefined, from: undefined });
        })
        .catch(err => {
          console.log('request failed', err);
          const msg = 'Error: '.concat(err.message).toUpperCase();
          this.setState({ message: msg });
        });
    } else {
      this.from = { x, y };
      this.setState({ message: '' });
    }
  }
  render() {
    // console.log('this.state.game:', this.state.game);
    return (
      <div>
        <Message message={this.state.message} />
        <Player player={this.state.game.player1} />
        <Board board={this.state.game.board} moveChecker={this.moveChecker} />
        <Player player={this.state.game ? this.state.game.player2 : null} />
      </div>
    );
  }
}
export default Game;
