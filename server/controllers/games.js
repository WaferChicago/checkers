/* eslint-disable new-cap, no-underscore-dangle, consistent-return */

import express from 'express';
import Game from '../models/game';
import startGameValidator from '../validators/games/startGame';
import moveValidator from '../validators/games/move';
// import paramsValidator from '../validators/players/params';
const router = module.exports = express.Router();

router.post('/', startGameValidator, (req, res) => {
  console.log('req.body', req.body);
  Game.startGame(req.body.player1, req.body.player2, (err, game) => {
    if (err) {
      console.log('err', err);
      return res.status(400).send(err.message);
    }
    return res.send({ game });
  });
});

router.put('/:id/move', moveValidator, (req, res) => {
  Game.findById(req.params.id)
  .populate('player1')
  .populate('player2')
  .exec((err, g) => {
    // get the populated player
    const player = (res.locals.player === g.player1._id.toString()) ? g.player1 : g.player2;
    // move the player's piece
    g.move(player, res.locals.to, res.locals.from, (err2, g2) => {
      if (err2) {
        return res.status(400).send(err2.message);
      }
      // save the board
      const updatedGame = new Game(g2);
      updatedGame.save(saveErr => {
        if (saveErr) {
          return res.status(400).send(saveErr.message);
        }
        return res.send({ game: g2 });
      });
    });
  });
});
