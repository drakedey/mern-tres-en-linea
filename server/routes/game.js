const express = require('express');
const gameModel = require('../models/game');
const router = express.Router();

const game = new gameModel();

router.get('/', (req, res) => {
  let limit = parseInt(req.query.limit);
  const queries = req.query;
  delete queries.limit;
  const params = {
    ...queries
  };
  game.getGamesWhitLimitAndParams(limit, res, params);
  return;
});

router.post('/', (req, res) => {
  const { playerOneName, playerTwoName } = req.body;
  game.createGame({ playerOneName, playerTwoName }, res);
  return;
});

router.delete('/:id', (req, res) => {
  game.deleteGameById(req.params.id, res);
  return;
});

router.put('/:id', (req, res) => {
  const id = req.params.id;
  game.updateGame(id, req.body, res);
});

module.exports = router;