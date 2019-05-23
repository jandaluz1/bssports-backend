const router = require('express').Router();
const axios = require('axios');
const { Game } = require('../db');
const redis = require('redis');
const client = require('../redis');

// check redis cache for gameId

const redisMiddleware = (req, res, next) => {
  client.get(req.params.id, (err, reply) => {
    if (err) {
      console.error(err);
      throw err;
    }
    if (reply) {
      res.json(JSON.parse(reply));
    } else {
      next();
    }
  });
};

router.get('/mlb/:id', redisMiddleware, async (req, res, next) => {
  let game = await Game.findOne({ gameId: req.params.id });

  // check if the game stored in the database is completed
  // if it is complete return game from the database

  if (game && game.stats.event_information.status === 'completed') {
    res.status(200).json(game);
  }
  if (game && game.stats.event_information.status !== 'completed') {
    // if game in database is not completed
    // fetch game from api, update game in database, set redis cache with update game
    const { data } = await axios.get(
      `https://chumley.barstoolsports.com/dev/data/games/${req.params.id}.json`
    );
    game.stats = { ...data };
    game.updated = Date.now();
    await game.save();

    // set redis cache key: gameId, value: updated game doc
    // cache expires in 15 seconds
    client.set(game.gameId, JSON.stringify(game), 'EX', 15, redis.print);
    res.status(202).json(game);
  }
  if (!game) {
    const { data } = await axios.get(
      `https://chumley.barstoolsports.com/dev/data/games/${req.params.id}.json`
    );
    game = new Game({
      gameId: req.params.id,
      stats: { ...data },
      updated: Date.now()
    });
    await game.save();
    client.set(game.gameId, JSON.stringify(game), 'EX', 15, redis.print);
    res.status(201).json(game);
  }
});

router.get('/nba/:id', redisMiddleware, async (req, res, next) => {
  let game = await Game.findOne({ gameId: req.params.id });

  if (game && game.stats.event_information.status === 'completed') {
    res.status(200).json(game);
  }

  if (game && game.stats.event_information.status !== 'completed') {
    const { data } = await axios.get(
      `https://chumley.barstoolsports.com/dev/data/games/${req.params.id}.json`
    );
    game.stats = { ...data };
    game.updated = Date.now();
    await game.save();
    client.set(game.gameId, JSON.stringify(game), 'EX', 15, redis.print);
    res.status(202).json(game);
  }

  if (!game) {
    const { data } = await axios.get(
      `https://chumley.barstoolsports.com/dev/data/games/${req.params.id}.json`
    );
    game = new Game({
      gameId: req.params.id,
      stats: { ...data },
      updated: Date.now()
    });
    await game.save();
    client.set(game.gameId, JSON.stringify(game), 'EX', 15, redis.print);
    res.status(201).json(game);
  }
});

module.exports = router;
