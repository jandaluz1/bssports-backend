const router = require('express').Router();

router.get('/mlb', (req, res, next) => {
  res.send('/API/MLB');
});

router.get('/nba', (req, res, next) => {
  res.send('/API/NBA');
});

module.exports = router;
