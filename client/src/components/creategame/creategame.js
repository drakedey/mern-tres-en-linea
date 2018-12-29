import React, { Component } from 'react';
import { Redirect, Link } from 'react-router-dom';

import { createGame } from '../../http/game';


export default class CreateGame extends Component {
  constructor(props) {
    super(props);
    this.state = {
      player1:'',
      player2:'',
      isSubmitting: false,
      gameId: null
    }
  }

  handleChange(event) {
    let obj = {}
    obj[event.target.id] = event.target.value;
    this.setState(obj);
  }

  handleSubmit(event) {
    event.preventDefault();
    this.setState({ isSubmitting: true })
    const { player1, player2 } = this.state;
    const obj = {
      playerOneName: player1,
      playerTwoName: player2
    };
    (async function() {
      const result = await createGame(obj);
      if (result)
        this.setState({ isSubmitting: false, gameId: result._id })
      console.log(result);
    }).bind(this)();
  }

  render() {
    return !this.state.gameId ?
    (
      <div className = "container">
        <Link to="/">Go back</Link>
        <form onSubmit = {(event) => this.handleSubmit(event)}>
          <div className="form-group">
            <label htmlFor="player1">Player 1 (X)</label>
            <input
            type="text" 
            className="form-control" 
            id="player1"
            aria-describedby="emailHelp" 
            placeholder="Enter Your Name Here"
            value = { this.state.player1 }
            onChange = { (e) => this.handleChange(e) }
            />
          </div>
          <div className="form-group">
            <label htmlFor="player2">Player 2 (O)</label>
            <input type="text"
            className="form-control" 
            id="player2" 
            aria-describedby="emailHelp" 
            placeholder="Enter Your Name Here"
            value={ this.state.player2 }
            onChange = { e => this.handleChange(e) }
            />
          </div>
          <button 
           type="submit"
           disabled = { this.state.player1.trim().length === 0 || this.state.player2.trim().length === 0 || this.state.isSubmitting }
           className="btn btn-primary">Start Game</button>
        </form>
      </div>
    ) : (<Redirect to = { `/game/${this.state.gameId}` }/>)
  }
}