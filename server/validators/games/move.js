/* eslint-disable consistent-return, no-param-reassign */

import joi from 'joi';

const schema = {
  player: joi.string().required(),
  from: joi.object({
    x: joi.number().required(),
    y: joi.number().required(),
  }),
  to: joi.object({
    x: joi.number().required(),
    y: joi.number().required(),
  }),
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
