/* eslint-disable no-unused-expressions, no-underscore-dangle, max-len */

const expect = require('chai').expect;
const request = require('supertest');
const app = require('../../dst/server');
const cp = require('child_process');
// const Player = require('../../dst/models/player');

describe('games', () => {
  beforeEach((done) => {
    cp.execFile(`${__dirname}/../scripts/populate.sh`, { cwd: `${__dirname}/../scripts` }, () => {
      done();
    });
  });
  describe('post /games', () => {
    it('should start a new game', (done) => {
      request(app)
      .post('/games')
      .send({ player1: '01234567890123456789abcd', player2: '01234567890123456789abc2' })
      .end((err, rsp) => {
        expect(err).to.be.null;
        expect(rsp.status).to.equal(200);
        expect(rsp.body.game._id).to.not.be.null;
        expect(rsp.body.game.playerTurn).to.equal('Black');
        expect(rsp.body.game.board[0]).to.be.length(8);
        done();
      });
    });
    it('should not start a new game with one player', (done) => {
      request(app)
      .post('/games')
      .send({ player1: '01234567890123456789abcd' })
      .end((err, rsp) => {
        expect(err).to.be.null;
        expect(rsp.body.messages[0]).to.contain('"player2" is required');
        expect(rsp.status).to.equal(400);
        done();
      });
    });
  });
  describe('put /games/:id/move - standard piece', () => {
    it('should move a piece to a new coordinate', (done) => {
      request(app)
      .put('/games/5787f7a7d23f4fb0533a6972/move')
      .send({ player: '01234567890123456789abcd', from: { y: 5, x: 4 }, to: { y: 4, x: 3 } })
      .end((err, rsp) => {
        expect(err).to.be.null;
        expect(rsp.status).to.equal(200);
        expect(rsp.body.game._id).to.not.be.null;
        expect(rsp.body.game.playerTurn).to.equal('Red');
        expect(rsp.body.game.board[5][4]).to.be.null;
        expect(rsp.body.game.board[4][3]).to.be.ok;
        done();
      });
    });
    it('should not move a piece -- invalid coordinate', (done) => {
      request(app)
      .put('/games/5787f7a7d23f4fb0533a6972/move')
      .send({ player: '01234567890123456789abcd', from: { y: 9, x: 4 }, to: { y: 4, x: 3 } })
      .end((err, rsp) => {
        expect(rsp.status).to.equal(400);
        expect(rsp.text).to.equal('invalid coordinate');
        done();
      });
    });
    it('should not move a piece -- move to occupied space', (done) => {
      request(app)
      .put('/games/5787f7a7d23f4fb0533a6972/move')
      .send({ player: '01234567890123456789abcd', from: { y: 6, x: 3 }, to: { y: 5, x: 4 } })
      .end((err, rsp) => {
        expect(rsp.status).to.equal(400);
        expect(rsp.text).to.equal('occupied square');
        done();
      });
    });
    it('should not move a piece -- move more than one space', (done) => {
      request(app)
      .put('/games/5787f7a7d23f4fb0533a6972/move')
      .send({ player: '01234567890123456789abcd', from: { y: 5, x: 2 }, to: { y: 3, x: 4 } })
      .end((err, rsp) => {
        expect(rsp.status).to.equal(400);
        expect(rsp.text).to.equal('can only move 1 space');
        done();
      });
    });
    it('should not move a piece -- standard piece not moving forward', (done) => {
      request(app)
      .put('/games/5787f7a7d23f4fb0533a6973/move')
      .send({ player: '01234567890123456789abcd', from: { y: 4, x: 1 }, to: { y: 5, x: 0 } })
      .end((err, rsp) => {
        expect(rsp.status).to.equal(400);
        expect(rsp.text).to.equal('cannot move backwards');
        done();
      });
    });
    it('should not move a piece -- not moving to a dark square', (done) => {
      request(app)
      .put('/games/5787f7a7d23f4fb0533a6972/move')
      .send({ player: '01234567890123456789abcd', from: { y: 5, x: 0 }, to: { y: 4, x: 0 } })
      .end((err, rsp) => {
        expect(rsp.status).to.equal(400);
        expect(rsp.text).to.equal('must remain on a dark square');
        done();
      });
    });
    it('should not move a piece -- not players turn', (done) => {
      request(app)
      .put('/games/5787f7a7d23f4fb0533a6973/move')
      .send({ player: '01234567890123456789abc2', from: { y: 5, x: 4 }, to: { y: 4, x: 3 } })
      .end((err, rsp) => {
        expect(rsp.status).to.equal(400);
        expect(rsp.text).to.equal('not player\'s turn');
        done();
      });
    });
  });
  describe('put /games/:id/move - jumping an opponents piece', () => {
    it('should have a black piece jump a red piece', (done) => {
      request(app)
      .put('/games/5787f7a7d23f4fb0533a6974/move')
      .send({ player: '01234567890123456789abcd', from: { y: 4, x: 1 }, to: { y: 2, x: 3 } })
      .end((err, rsp) => {
        expect(err).to.be.null;
        expect(rsp.status).to.equal(200);
        expect(rsp.body.game._id).to.not.be.null;
        expect(rsp.body.game.playerTurn).to.equal('Red');
        expect(rsp.body.game.board[4][1]).to.be.null;
        expect(rsp.body.game.board[3][2]).to.be.null;
        expect(rsp.body.game.board[2][3]).to.be.ok;
        done();
      });
    });
    it('should have a red piece jump a black piece', (done) => {
      request(app)
      .put('/games/5787f7a7d23f4fb0533a6978/move')
      .send({ player: '01234567890123456789abc2', from: { y: 0, x: 3 }, to: { y: 2, x: 5 } })
      .end((err, rsp) => {
        expect(err).to.be.null;
        expect(rsp.status).to.equal(200);
        expect(rsp.body.game._id).to.not.be.null;
        expect(rsp.body.game.playerTurn).to.equal('Black');
        expect(rsp.body.game.board[0][3]).to.be.null;
        expect(rsp.body.game.board[1][4]).to.be.null;
        expect(rsp.body.game.board[2][5]).to.be.ok;
        done();
      });
    });
    it('should not have a red piece - move two spaces non-diagonally', (done) => {
      request(app)
      .put('/games/5787f7a7d23f4fb0533a6978/move')
      .send({ player: '01234567890123456789abc2', from: { y: 0, x: 3 }, to: { y: 2, x: 1 } })
      .end((err, rsp) => {
        expect(err).to.be.null;
        expect(rsp.status).to.equal(400);
        expect(rsp.text).to.equal('can only move 1 space');
        done();
      });
    });
  });
  describe('put /games/:id/move - kinging a piece', () => {
    it('should have a black piece move to the kings row and be kinged', (done) => {
      request(app)
      .put('/games/5787f7a7d23f4fb0533a6976/move')
      .send({ player: '01234567890123456789abcd', from: { y: 1, x: 2 }, to: { y: 0, x: 3 } })
      .end((err, rsp) => {
        expect(err).to.be.null;
        expect(rsp.status).to.equal(200);
        expect(rsp.body.game._id).to.not.be.null;
        expect(rsp.body.game.playerTurn).to.equal('Red');
        expect(rsp.body.game.board[1][2]).to.be.null;
        expect(rsp.body.game.board[0][3]).to.be.ok;
        expect(rsp.body.game.board[0][3].isKinged).to.be.true;
        done();
      });
    });
    it('should have a kinged black piece move backwards', (done) => {
      request(app)
      .put('/games/5787f7a7d23f4fb0533a6977/move')
      .send({ player: '01234567890123456789abcd', from: { y: 0, x: 3 }, to: { y: 1, x: 2 } })
      .end((err, rsp) => {
        expect(err).to.be.null;
        expect(rsp.status).to.equal(200);
        expect(rsp.body.game._id).to.not.be.null;
        expect(rsp.body.game.playerTurn).to.equal('Red');
        expect(rsp.body.game.board[0][3]).to.be.null;
        expect(rsp.body.game.board[1][2]).to.be.ok;
        done();
      });
    });
    it('should have a kinged black piece jump a red piece backwards', (done) => {
      request(app)
      .put('/games/5787f7a7d23f4fb0533a6977/move')
      .send({ player: '01234567890123456789abcd', from: { y: 0, x: 3 }, to: { y: 2, x: 5 } })
      .end((err, rsp) => {
        expect(err).to.be.null;
        expect(rsp.status).to.equal(200);
        expect(rsp.body.game._id).to.not.be.null;
        expect(rsp.body.game.playerTurn).to.equal('Red');
        expect(rsp.body.game.board[0][3]).to.be.null;
        expect(rsp.body.game.board[1][4]).to.be.null;
        expect(rsp.body.game.board[2][5]).to.be.ok;
        done();
      });
    });
  });
  describe('put /games/:id/move - winning a game', () => {
    it('should calculate that on completion of the turn, the opposition has no pieces and has last', (done) => {
      request(app)
      .put('/games/5787f7a7d23f4fb0533a6978/move')
      .send({ player: '01234567890123456789abc2', from: { y: 0, x: 3 }, to: { y: 2, x: 5 } })
      .end((err, rsp) => {
        expect(err).to.be.null;
        expect(rsp.status).to.equal(200);
        expect(rsp.body.game._id).to.not.be.null;
        expect(rsp.body.game.playerTurn).to.equal('Black');
        expect(rsp.body.game.board[0][3]).to.be.null;
        expect(rsp.body.game.board[2][5]).to.be.ok;
        expect(rsp.body.game.winner).to.equal('01234567890123456789abc2');
        done();
      });
    });
    it('should not declare winner, the opposition has pieces', (done) => {
      request(app)
      .put('/games/5787f7a7d23f4fb0533a6979/move')
      .send({ player: '01234567890123456789abc2', from: { y: 0, x: 3 }, to: { y: 2, x: 5 } })
      .end((err, rsp) => {
        expect(err).to.be.null;
        expect(rsp.status).to.equal(200);
        expect(rsp.body.game._id).to.not.be.null;
        expect(rsp.body.game.playerTurn).to.equal('Black');
        expect(rsp.body.game.board[0][3]).to.be.null;
        expect(rsp.body.game.board[2][5]).to.be.ok;
        expect(rsp.body.game.winner).to.be.null;
        done();
      });
    });
    it('should not allow a move if a winner has been declared', (done) => {
      request(app)
      .put('/games/5787f7a7d23f4fb0533a6980/move')
      .send({ player: '01234567890123456789abc2', from: { y: 0, x: 3 }, to: { y: 2, x: 5 } })
      .end((err, rsp) => {
        expect(err).to.be.null;
        expect(rsp.status).to.equal(400);
        expect(rsp.text).to.equal('game is over');
        done();
      });
    });
  });
});
