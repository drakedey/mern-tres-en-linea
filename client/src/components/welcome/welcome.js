import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { checkCurrentGame } from '../../http/game';

import './welcome.css'



export default class Welcome extends Component {

  constructor(props) {
    super(props);
    this.state = {
      currentGame: null
    }
  }

  componentDidMount() {
    (async function() {
      const [currentGame] = await checkCurrentGame();
      if (currentGame)
        this.setState({ currentGame })
      console.log(this.state);
    }).bind(this)();
  }

  render() {
    return(
      <div className = "container mt-5">
        <h1 className = "text-center">Welcome to tic-tac-toe</h1>
        <div className = "parent-buttons btn-group-vertical mb-5">
          <Link className = "btn btn-primary" to="/start" >Start New Game</Link>
          <button disabled={this.state.currentGame===null} className = "btn btn-primary">
            { this.state.currentGame && <Link className = "btn btn-primary" to= { `/game/${this.state.currentGame._id}` } >Start previous Game</Link> }
            { !this.state.currentGame && 'Theres no game going on' }
          </button>
          <Link className = "btn btn-success" to="/history/all" >Match History</Link>
        </div>
        <h3 className="text-center">How To Play</h3>
        <p className="text-center">
          Hit start new game button, fill the user players name and star to play. To win you need to place three (3)
          X or O figures in a row.
        </p>
      </div>
    )
  }
}