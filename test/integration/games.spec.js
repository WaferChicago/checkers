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
  describe('put /games/:id/move', () => {
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
});
