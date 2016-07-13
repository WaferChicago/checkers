/* eslint-disable no-param-reassign,no-use-before-define, no-underscore-dangle,
consistent-return, func-names */
import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const playerSchema = new Schema({
  name: { type: String, required: true },
  color: { type: String, enum: ['Red', 'Black'], default: 'Red' },
});

module.exports = mongoose.model('Player', playerSchema);
