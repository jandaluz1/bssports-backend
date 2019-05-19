const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const gameSchema = new Schema({
  gameId: { type: String, required: true, unique: true },
  stats: {},
  updated: Date
});

const Game = mongoose.model('Game', gameSchema);

module.exports = Game;
