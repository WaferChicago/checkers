/* eslint-disable no-unused-expressions, func-names, max-len */
const expect = require('chai').expect;
const Game = require('../../dst/models/game');
const Player = require('../../dst/models/player');

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
        done();
      });
    });
  });
});
