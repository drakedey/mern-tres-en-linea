const mongoose = require('mongoose');

class GameModel {
  constructor() {
    const gameSchema = new mongoose.Schema({
      playerOneName: { type: String, default: 'Player 1'},
      playerTwoName: { type: String, default: 'Player 2'},
      history: { 
        type: String, 
        required: true,
        default: '[]',
        validate: {
          validator: function() {
            return this.gameStatus !== 'FINISHED' || this.winner;
          },
          message: 'Can not actualize a finished game'
        }
      },
      gameStatus: { type: String, default: 'CURRENT', enum: ['CURRENT', 'FINISHED', 'PENDING'] },
      winner: { 
        type: String, 
        enum: ['Player1', 'Player2', 'none'],
        required: true,
        default: 'none',
      },
      date: { type: Date, default: Date.now }
    });

    this.Game = mongoose.model('Game', gameSchema);
  }

  /**
   * 
   * @param {queryObject} params 
   * determine where the user is setting invalid query Params
   */
  evaluateIncomingKeys(params) {
    const availableKeys = ['playerOneName', 'playerTwoName', 'gameStatus', 'winner', 'history', '_id'];
    let result = true;
    for (const key in params) {
      result = availableKeys.some(availableKey => { 
        return availableKey === key;
      });
      if (!result) {
        break;
      }
    }
    return result;
  }

  createGame(gameObj, res) {
    const game = new this.Game(gameObj);
    const err = game.validateSync();
    if (err) res.status(400).send(err.message);
    else {
      (async function() {
        try {
          await this.Game.updateMany({ gameStatus: 'CURRENT' }, {gameStatus: 'PENDING'});
          const result = await game.save();
          res.send({ status: true, result });
        } catch (error) {
          res.status(500).send({ status: false, error });
        }
      }).bind(this)();
    }
    return;
  }

  getGamesWhitLimitAndParams(limit, res, payload) {
    if(!this.evaluateIncomingKeys(payload)) {
      res.status(400).send({ status: false, error: 'invalid keys on params'});
      return;
    }
    (async function() {
      try {
        const result = await this.Game.find({ ...payload }).limit(limit).sort({ date: -1 });
        res.send({ status: true, result });        
      } catch (error) {
        res.status(500).send({ status: false, error });        
      }
    }).bind(this)();
    return;
  }
  
  updateGame(id, payload, res) {
    if(!this.evaluateIncomingKeys(payload)) {
      res.status(400).send({ status: false, error: 'invalid keys on params'});
      return;
    }
    (async function() {
      try {
        const game = await this.Game.findById(id);
        for (const key in payload) {
          if (payload.hasOwnProperty(key)) {
            const element = payload[key];
            //Flipping all current games to pending in case of updating pending one...
            if (key === 'gameStatus' && element === 'CURRENT') {
              await this.Game.updateMany({ gameStatus: 'CURRENT' }, { gameStatus: 'PENDING' });
            }
            game[key] = element;
          }
        }
        await game.validate();
        const result = await game.save();
        res.send({ status: true, result });  
      } catch (error) {
        res.status(500).send({ status: false, error });
      }  
    }).bind(this)();
  }

  deleteGameById(id, res) {
    (async function() {
      try {
        const result = await this.Game.deleteOne({ _id: id });
        res.send({ status: true, result });        
      } catch(error) {
        res.status(500).send({ status: false, error });        
      }
    }).bind(this)();
  }
}



module.exports = GameModel;