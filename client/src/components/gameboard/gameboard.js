import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import {  getGameById, updateGameHistory, updateGameStatus } from '../../http/game';

import './gameboard.css';

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a] === 'X' ? 'Player1':'Player2';
    }
  }
  return 'none';
}

const Square = props => {
  const { winner, looser } = props;
  const color = !winner && !looser ? 'black' : winner ? 'green' : 'red';
  return(
    <button
      className="square"
      onClick={ () => props.onClick() }
      style = {{ color }}
    >
      { props.value }
    </button>
  );
}

export default class GameBoard extends Component{
  constructor(props) {
    super(props);
    this.state = {
      historyGame: [Array(9).fill(null)],
      currentGame: Array(9).fill(null),
      isPlayerOneturn: true,
      winner: 'none',
      gameFinished: false,
      currentGamePointer: 0,
      playerOneName: 'Player One',
      playerTwoName: 'Player Two',
      updatedFromServer: false
    }
  }

  componentDidMount() {
    const { id } = this.props.match.params;
    (async function() {
      const [result] = await getGameById(id);
      const { gameStatus } = result;
      if (gameStatus === 'PENDING') {
        console.log('UPDATING PENDING GAME TO CURRENT');
        const result = await updateGameStatus('CURRENT', id);
        console.log(result);
        this.setGameStateFromAPI(result);
      } else {
        this.setGameStateFromAPI(result)
      }
    }).bind(this)();
  }

  setGameStateFromAPI(result) {
    const { playerOneName, playerTwoName, history, gameStatus } = result;
    let historyGameParsed = JSON.parse(history);
    const historyGame = historyGameParsed.length > 0 ? historyGameParsed : [Array(9).fill(null)];
    const currentGame = historyGame.length > 0 ? historyGame[historyGame.length - 1] : Array(9).fill(null);
    const currentGamePointer = historyGame.length > 0 ? historyGame.length - 1 : 0;
    const gameFinished = gameStatus === 'FINISHED';
    const winner = result.winner;
    this.setState({ playerOneName, playerTwoName, historyGame, currentGame, currentGamePointer, gameFinished, winner });
  }

  handleSquareClick(index) {
    const { id } = this.props.match.params;
    if (this.state.gameFinished) {
      alert('Game finished');
      return;
    }
    const currentGame = this.state.currentGame.slice();
    if (currentGame[index]) return; //Checking for values
    const historyGame = this.state.historyGame.slice(0, this.state.currentGamePointer + 1);
    currentGame[index] = this.state.isPlayerOneturn ? 'X' : 'O';
    const winner = calculateWinner(currentGame);
    // Checking for filled board
    const gameFinished = winner !== 'none' || !currentGame.some( val => val === null);
    const gameStatus = gameFinished ? 'FINISHED' : 'CURRENT';
    historyGame.push(currentGame);
    const currentGamePointer = historyGame.length - 1;
    (async function() {
      try {
        const response = await updateGameHistory(historyGame, winner, gameStatus, id)
                        .then(response => response.text());
        const { result } = JSON.parse(response);
        console.log('at update', result);
        this.setGameStateFromAPI(result);
      } catch (error) {
        console.log('something went wrong... working locally');
      }
    }).bind(this)();
    this.setState({ 
      currentGame, 
      historyGame, 
      isPlayerOneturn: !this.state.isPlayerOneturn,
      gameFinished,
      winner,
      currentGamePointer
    });
    return;
  }

  handleHistoryClick(index) {
    const historyGame = this.state.historyGame.slice();
    const currentGame = historyGame[index];
    const isPlayerOneturn = index % 2 === 0
    this.setState({ currentGame, currentGamePointer: index, isPlayerOneturn });
  }

  handleExitClick(event) {
    if (!this.state.gameFinished) {
      event.preventDefault();
      if(window.confirm('Are you sure you want to leave this game? (process will be saved)')) {
        window.location.href="/";
      }
    }
    return;
  }

  renderSquares(value, index) {
    const winnerString = this.state.winner && this.state.winner !== 'none' 
    ? this.state.winner === 'Player1' ? 'X':'O' : null;
    const looser = winnerString ? winnerString !== value : null;
    const winner = winnerString ? winnerString === value : null;
    return (
      <Square 
        value = { value } 
        onClick = { () => this.handleSquareClick(index) }
        key = { index }
        winner = { winner }
        looser = { looser }
      />
    )
  }

  render() {
    const winner = this.state.winner && this.state.winner !== 'none' 
    ? this.state.winner === 'Player1' ? this.state.playerOneName: this.state.playerTwoName : null;
    const header = winner ? `Winner is: ${ winner }` : 
    this.state.gameFinished ? 'Game finished' : `Turn For: ${ this.state.isPlayerOneturn ? 'X' : 'O' }`
    return(
      <div className = "container">
        <Link to="/" onClick = {(e) => this.handleExitClick(e)}>Go Menú</Link>
        <Link to="/start">{this.state.gameFinished && 'Start New Game'}</Link>
        <div>
          <h1 className="text-center">{`${ this.state.playerOneName }(X) vs ${ this.state.playerTwoName }(O)`}</h1>
          <h3 className="text-center">{ header }</h3>
          <div className="game-container mt-5">
            <div>
              <div className = "board-row">
                { this.state.currentGame && this.state.currentGame.slice(0,3).map((value, index) => {
                  return this.renderSquares(value, index);
                }) }
              </div>
              <div className = "board-row">
                { this.state.currentGame && this.state.currentGame.slice(3,6).map((value, index) => {
                  return this.renderSquares(value, (index + 3));
                }) }
              </div>
              <div className = "board-row">
                { this.state.currentGame && this.state.currentGame.slice(6,9).map((value, index) => {
                  return this.renderSquares(value, (index + 6));
                }) }
              </div>
            </div>
          </div>
          <div className='game-history mt-3'>
            <ul className = "list-group ">
              { this.state.historyGame.map((element, index) => {
                return(
                  <li className = { `list-group-item ${index === this.state.currentGamePointer ? 'list-group-item-info': ''}` }
                      onClick = {() => this.handleHistoryClick(index) }
                      key = {index}>
                    Turn {index}
                  </li>
                )
              }) }
            </ul>
          </div>
        </div>
      </div>
    )
  }
  
}