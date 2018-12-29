const express = require('express');
const app = express();
const mongoose = require('mongoose');

const gameRoutes = require('./routes/game');

app.use(express.json());
// Add headers
app.use(function (req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.getHeader('Access-Control-Allow-Origin');
  next();
});

app.use('/api/gameboard', gameRoutes);

const port = process.env.PORT || 5000;
const conn = mongoose.connect('mongodb://localhost/tictactoe', { useNewUrlParser: true });
conn
  .then( () => {
    console.log('Connected to MongoDB');
    app.listen(port, () => {
      console.log('linstenging on Port: ', port);
    });
  })
  .catch( err => {
    console.log(err);
  });
