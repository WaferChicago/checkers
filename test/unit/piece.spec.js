const expect = require('chai').expect;
const Piece = require('../../dst/models/piece');

describe('Piece', () => {
  describe('constructor', () => {
    it('should create a new Piece', () => {
      const p = new Piece('Red');
      expect(p.color).to.equal('Red');
    });
  });
});
