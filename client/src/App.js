import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Redirect, Switch } from 'react-router-dom';
import Welcome from './components/welcome/welcome';
import CreateGame from './components/creategame/creategame';
import GameBoard from './components/gameboard/gameboard';
import History from './components/history/history';

class App extends Component {
  render() {
    return (
      <Router>
        <Switch >
          <Route path='/' exact component = { Welcome } />
          <Route path='/start' exact component = { CreateGame } />
          <Route path='/game/:id' component = { GameBoard }/>
          <Route path='/history/:status' component = { History }/>
          <Redirect from='/history' to='/history/all' />
          <Redirect from='*' to='/' />
        </Switch>
      </Router>
    );
  }
}

export default App;
