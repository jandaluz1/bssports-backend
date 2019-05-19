const mongoose = require('mongoose');

const connectDb = () => {
  return mongoose.connect('mongodb://localhost:27017/boxscore', {
    useNewUrlParser: true
  });
};
const Game = require('./game');
module.exports = { connectDb, Game };
