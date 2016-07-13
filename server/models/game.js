/* eslint-disable no-param-reassign,no-use-before-define, no-underscore-dangle,
consistent-return, func-names */
import mongoose from 'mongoose';
import Piece from './piece';
const Schema = mongoose.Schema;


const gameSchema = new Schema({
  player1: { type: mongoose.Schema.ObjectId, ref: 'Player', required: true },
  player2: { type: mongoose.Schema.ObjectId, ref: 'Player', required: true },
  board: [
    [{ type: mongoose.Schema.ObjectId, ref: 'Piece' }],
  ],
  playerTurn: { type: Number },
});


gameSchema.methods.setupBoard = function () {
  // build the board matrix
  this.board = new Array(8);
  for (let y = 0; y < 8; y++) {
    this.board[y] = new Array(8).fill(null);
  }
  // place the pieces
  this.populateStartingPieces(0, this.player2);
  this.populateStartingPieces(1, this.player2);
  this.populateStartingPieces(2, this.player2);
  this.populateStartingPieces(5, this.player1);
  this.populateStartingPieces(6, this.player1);
  this.populateStartingPieces(7, this.player1);
  console.log('board:', this.board);
};

gameSchema.methods.populateStartingPieces = function (y, player) {
  this.board[y].forEach((square, x) => {
    if (this.isDarkSquare(x, y)) {
      const p = new Piece(player.color);
      this.board[y][x] = p;
    }
  });
};

gameSchema.methods.isDarkSquare = function (x, y) {
  const rowIsOdd = (y % 2 !== 0);
  if (rowIsOdd) {
    if (x % 2 === 0) {
      return true;
    }
    if (x % 2 !== 0) {
      return false;
    }
  } else {
    if (x % 2 === 0) {
      return false;
    }
    if (x % 2 !== 0) {
      return true;
    }
  }
};

module.exports = mongoose.model('Game', gameSchema);
