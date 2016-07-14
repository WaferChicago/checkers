/* eslint-disable no-unused-expressions, func-names */
const expect = require('chai').expect;
const Player = require('../../dst/models/player');

describe('Player', () => {
  describe('constructor', () => {
    it('should create a new player', (done) => {
      const p = new Player({ name: 'Pedro', color: 'Red' });
      p.validate(() => {
        expect(p.name).to.equal('Pedro');
        expect(p.color).to.equal('Red');
        done();
      });
    });
    it('should not create a new player with out a name', (done) => {
      const p = new Player();
      p.validate(err => {
        expect(err).to.be.ok;
        done();
      });
    });
    it('should not create a new player with invalid color', (done) => {
      const p = new Player({ name: 'Pedro', color: 'pink' });
      p.validate(err => {
        expect(err).to.be.ok;
        done();
      });
    });
  });
});
