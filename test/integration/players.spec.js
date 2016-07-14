/* eslint-disable no-unused-expressions, no-underscore-dangle, max-len */

const expect = require('chai').expect;
const request = require('supertest');
const app = require('../../dst/server');
const cp = require('child_process');
// const Player = require('../../dst/models/player');

describe('player', () => {
  beforeEach((done) => {
    cp.execFile(`${__dirname}/../scripts/populate.sh`, { cwd: `${__dirname}/../scripts` }, () => {
      done();
    });
  });
  describe('post /players', () => {
    it('should create a player', (done) => {
      request(app)
      .post('/players')
      .send({ name: 'Franco' })
      .end((err, rsp) => {
        expect(err).to.be.null;
        expect(rsp.status).to.equal(200);
        expect(rsp.body.player._id).to.not.be.null;
        done();
      });
    });

    it('should NOT create a player - must have a name', (done) => {
      request(app)
      .post('/players')
      .send({ })
      .end((err, rsp) => {
        expect(err).to.be.null;
        expect(rsp.status).to.equal(400);
        expect(rsp.body.messages).to.deep.equal(['"name" is required']);
        done();
      });
    });
  });
});
