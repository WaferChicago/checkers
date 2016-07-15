/* eslint-disable no-param-reassign,no-use-before-define, no-underscore-dangle,
consistent-return, func-names, new-cap */
import mongoose from 'mongoose';
import Piece from './piece';
import Player from './player';

const Schema = mongoose.Schema;


const gameSchema = new Schema({
  player1: { type: mongoose.Schema.ObjectId,
             ref: 'Player',
             required: true,
           },
  player2: { type: mongoose.Schema.ObjectId,
             ref: 'Player',
             required: true,
           },
  board: [
    [{}],
  ],
  playerTurn: { type: String, enum: ['Red', 'Black'], default: 'Black' },
  winner: { type: mongoose.Schema.ObjectId, ref: 'Player', default: null },
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
};

gameSchema.methods.populateStartingPieces = function (y, player) {
  this.board[y].forEach((square, x) => {
    if (this.isDarkSquare(x, y)) {
      const p = new Piece(player.color);
      this.board[y][x] = p;
    }
  });
};

gameSchema.methods.allPieces = function (color) {
  const allPlayerPieces = [];
  this.board.forEach(row => {
    const playerRow = row.map(square => {
      if ((square !== null) && (square.color === color)) {
        return square;
      }
      return null;
    });
    allPlayerPieces.push(playerRow);
  });
  return allPlayerPieces;
};

gameSchema.methods.gameHasWinner = function gameHasWinner(player) {
  const enemyColor = (player.color === 'Black') ? 'Red' : 'Black';
  const allPieces = this.allPieces(enemyColor);
  const filteredRows = allPieces.map(row => (row.filter(square => square !== null).length));
  const rd = filteredRows.reduce(((a, c) => a + c), 0);
  return rd === 0;
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
// should this be a stateless function not a instance method?
gameSchema.methods.isValidJump = function (player, to, from) {
  let jumpPiece = null;
  const fromPiece = this.board[from.y][from.x];
  const toPiece = this.board[to.y][to.x];
  // console.log('player color:', player.color, 'from:', from, 'to:', to, 'from-piece:', fromPiece, 'to-piece:', toPiece);
  // if black or kinged and jumping two squares diagonally and landing on unoccupied space
  if (((player.color === 'Black') || (fromPiece.isKinged))
  && (from.y - to.y === 2) && (toPiece === null)) {
    jumpPiece = this.board[from.y - 1][to.x - 1];
    // if square being jumped contains an opponent's piece
    if ((jumpPiece !== null) && (jumpPiece.color !== player.color)) {
      return { y: from.y - 1, x: to.x - 1 };
    }
  }
  // if red or kinged and jumping two squares diagonally and landing on unoccupied space
  if (((player.color === 'Red') || (fromPiece.isKinged))
  && (to.y - from.y === 2) && (toPiece === null)) {
    jumpPiece = this.board[from.y + 1][to.x - 1];
    // if square being jumped contains an opponent's piece
    if ((jumpPiece !== null) && (jumpPiece.color !== player.color)) {
      return { y: from.y + 1, x: to.x - 1 };
    }
  }
  return null;
};

gameSchema.methods.shouldBeKinged = function shouldBeKinged(player, to) {
  if (((player.color === 'Black') && (to.y === 0)) ||
  ((player.color === 'Red') && (to.y === 7))) {
    return true;
  }
  return false;
};

// should this be a stateless function not a instance method?
gameSchema.methods.validateMove = function (player, to, from) {
  // game has ended
  if (this.winner !== null) {
    return new Error('game is over');
  }
  // invalid coordinate
  if (to.x < 0 || to.x > 7 || to.y < 0 || to.y > 7 || from.x < 0
    || from.x > 7 || from.y < 0 || from.y > 7) {
    return new Error('invalid coordinate');
  }
  const fromPiece = this.board[from.y][from.x];
  // from has a piece
  if (fromPiece === null) {
    return new Error('not moving an existing piece');
  }
  // not forward
  if ((((fromPiece.color === 'Black') && (from.y - to.y < 0)) ||
  ((fromPiece.color === 'Red') && (to.y - from.y < 0))) &&
  (!fromPiece.isKinged)) {
    return new Error('cannot move backwards');
  }
  // not on black
  if (!this.isDarkSquare(to.x, to.y)) {
    return new Error('must remain on a dark square');
  }
  // wrong player
  if (player.color !== this.playerTurn) {
    return new Error('not player\'s turn');
  }
  // opponent's piece
  if (fromPiece.color !== this.playerTurn) {
    return new Error('not player\'s piece');
  }
  if (this.isValidJump(player, to, from) === null) {
    // occupied space
    if (this.board[to.y][to.x] !== null) {
      return new Error('occupied square');
    }
    // more than one space
    if (Math.abs(to.y - from.y) > 1) {
      return new Error('can only move 1 space');
    }
  }
  return null;
};

gameSchema.methods.newTurn = function () {
  this.playerTurn = (this.playerTurn === 'Black') ? 'Red' : 'Black';
};

gameSchema.methods.move = function (player, to, from, cb) {
  const error = this.validateMove(player, to, from);
  if (error !== null) {
    console.log('Move Error:', error.message);
    return cb(error);
  }
  const jumpPieceCoord = this.isValidJump(player, to, from);
  const p = this.board[from.y][from.x];
  if (this.shouldBeKinged(player, to)) {
    p.isKinged = true;
  }
  this.board[to.y][to.x] = p;
  this.board[from.y][from.x] = null;
  this.newTurn();
  if (jumpPieceCoord !== null) {
    this.board[jumpPieceCoord.y][jumpPieceCoord.x] = null;
    console.log('** Removed jumped piece at:', jumpPieceCoord);
  }
  // determine winner
  if (this.gameHasWinner(player)) {
    this.winner = player._id;
  }
  cb(null, this);
};

gameSchema.statics.getPlayer = function (pId, cb) {
  Player.findById({ _id: pId }, (err, player) => {
    cb(err, player);
  });
};

gameSchema.statics.startGame = function (p1Id, p2Id, cb) {
  if (!p1Id) return cb(new Error(`Missing or invaild player1 id: \'${p1Id}\'`));
  if (!p2Id) return cb(new Error(`Missing or invaild player2 id: \'${p2Id}\'`));
  gameSchema.statics.getPlayer(p1Id, (err, player1) => {
    if (err) {
      return cb(err);
    }
    gameSchema.statics.getPlayer(p2Id, (err2, player2) => {
      if (err2) {
        return cb(err2);
      }
      // validate player colors
      if (player1.color === player2.color) {
        return cb(new Error('players must be of different color.'));
      }
      // create the game
      const newGame = new this;
      newGame.player1 = player1;
      newGame.player2 = player2;
      newGame.setupBoard();
      // save the gameSchema
      cb(null, newGame);
    });
  });
};

module.exports = mongoose.model('Game', gameSchema);
