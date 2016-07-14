/* eslint-disable consistent-return, no-param-reassign */

import joi from 'joi';

const schema = {
  player1: joi.string().required(),
  player2: joi.string().required(),
};

module.exports = (req, res, next) => {
  const result = joi.validate(req.body, schema);
  if (result.error) {
    const errMsgs = { messages: result.error.details.map(d => d.message) };
    res.status(400).send(errMsgs);
  } else {
    res.locals = result.value;
    next();
  }
};
