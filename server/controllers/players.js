/* eslint-disable new-cap */

import express from 'express';
import Player from '../models/player';
import bodyValidator from '../validators/players/body';
// import queryValidator from '../validators/players/query';
// import paramsValidator from '../validators/players/params';
const router = module.exports = express.Router();

router.post('/', bodyValidator, (req, res) => {
  // console.log('post', req.body);
  Player.create(req.body, (err, player) => {
    res.send({ player });
  });
});
// create
// router.post('/', bodyValidator, (req, res) => {
//   Bookmark.create(res.locals, (err, bookmark) => {
//     res.send({ bookmark });
//   });
// });
