/* eslint-disable no-unused-expressions, func-names, max-len,
no-underscore-dangle, prefer-arrow-callback */
const expect = require('chai').expect;
const Game = require('../../dst/models/game');
const Player = require('../../dst/models/player');
const sinon = require('sinon');

function testStartingRow(rowNum, board) {
  const row = board[rowNum];
  const rowIsOdd = (rowNum % 2 !== 0);
  for (let i = 0; i < 8; i++) {
    const square = row[i];
    if (rowIsOdd) {
      if ((i % 2 === 0) && (square === null)) {
        return false;
      }
      if ((i % 2 !== 0) && (square !== null)) {
        return false;
      }
    } else {
      if ((i % 2 === 0) && (square !== null)) {
        return false;
      }
      if ((i % 2 !== 0) && (square === null)) {
        return false;
      }
    }
  }
  return true;
}

describe('Game', () => {
  describe('constructor', () => {
    it('should create a new Game', (done) => {
      const p1 = new Player({ _id: '578694ff05798c1293256ce3', name: 'p1', color: 'Red' });
      const p2 = new Player({ _id: '57869665e24ed3bd9360f3de', name: 'p2', color: 'Black' });
      const g = new Game({ player1: p1, player2: p2 });
      g.validate(() => {
        expect(g.id).to.be.ok;
        expect(g.board).to.be.ok;
        done();
      });
    });
    it('should NOT create a new Game with only one registered player', (done) => {
      const g = new Game({ player1: '578694ff05798c1293256ce3' });
      g.validate(err => {
        expect(err).to.be.ok;
        done();
      });
    });
  });
  describe('#IsDarkSquare', () => {
    it('should return true if a coordinate represents a dark square on the board', (done) => {
      const p1 = new Player({ _id: '578694ff05798c1293256ce3', name: 'p1', color: 'Red' });
      const p2 = new Player({ _id: '57869665e24ed3bd9360f3de', name: 'p2', color: 'Black' });
      const g = new Game({ player1: p1, player2: p2 });
      g.setupBoard();
      g.validate(() => {
        // const b = g.board;
        expect(g.isDarkSquare(0, 0)).to.be.false;
        expect(g.isDarkSquare(1, 0)).to.be.true;
        expect(g.isDarkSquare(7, 7)).to.be.false;
        done();
      });
    });
  });
  describe('#setupBoard', () => {
    it('should create a board with overlay and starting pieces', (done) => {
      const p1 = new Player({ _id: '578694ff05798c1293256ce3', name: 'p1', color: 'Red' });
      const p2 = new Player({ _id: '57869665e24ed3bd9360f3de', name: 'p2', color: 'Black' });
      const g = new Game({ player1: p1, player2: p2 });
      g.setupBoard();
      g.validate(() => {
        const b = g.board;
        expect(testStartingRow(0, b)).to.be.true;
        expect(testStartingRow(1, b)).to.be.true;
        expect(testStartingRow(2, b)).to.be.true;
        expect(b[3].every(s => s === null)).to.be.true;
        expect(b[4].every(s => s === null)).to.be.true;
        expect(testStartingRow(5, b)).to.be.true;
        expect(testStartingRow(6, b)).to.be.true;
        expect(testStartingRow(7, b)).to.be.true;
        expect(g.board).to.be.ok;
        expect(g.playerTurn).to.equal('Black');
        done();
      });
    });
  });
  describe('.startGame', () => {
    it('should create a game that is ready to play', sinon.test(function (done) {
      const p1 = new Player({ name: 'p1', color: 'Red' });
      const p2 = new Player({ name: 'p2', color: 'Black' });
      const playerFindCB = sinon.stub(Player, 'findById');
      playerFindCB.onCall(0).yields(null, p1);
      playerFindCB.onCall(1).yields(null, p2);
      Game.startGame(p1._id, p2._id, (err, game) => {
        Player.findById.restore();
        expect(game.board).to.be.ok;
        expect(game.playerTurn).to.equal('Black');
        done();
      });
    }));
    // players of same color
    it('should Not create a game when players have same color', sinon.test(function (done) {
      const p1 = new Player({ name: 'p1', color: 'Red' });
      const p2 = new Player({ name: 'p2', color: 'Red' });
      const playerFindCB = this.stub(Player, 'findById');
      playerFindCB.onCall(0).yields(null, p1);
      playerFindCB.onCall(1).yields(null, p2);
      Game.startGame(p1._id, p2._id, (err) => {
        // Player.findById.restore();
        expect(err).to.be.ok;
        done();
      });
    }));
    // player not found
    it('should Not create a game when player id not found', sinon.test(function (done) {
      const p1 = new Player({ name: 'p1', color: 'Red' });
      const playerFindCB = this.stub(Player, 'findById');
      playerFindCB.onCall(0).yields(null, p1);
      playerFindCB.onCall(1).yields(new Error('not found'));
      Game.startGame(p1._id, 'bad', (err) => {
        // Player.findById.restore();
        expect(err).to.be.ok;
        done();
      });
    }));
  });
});
