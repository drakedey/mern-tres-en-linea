import React, { Component } from 'react';
import { Link, Redirect, withRouter } from 'react-router-dom';

import { getGamesByGameStatus, deleteGameById } from '../../http/game';

import './history.css';

const Menu = props => (
  <ul className="nav nav-tabs nav-justified">
    <li className="nav-item">
      <Link className = { `nav-link ${ props.match.params.status ==='all' ? 'active':'' }` } to="/history/all">All</Link>
    </li>
    <li className="nav-item">
      <Link className = { `nav-link ${ props.match.params.status ==='FINISHED' ? 'active':'' }` } to="/history/FINISHED">Finished</Link>
    </li>
    <li className="nav-item">
      <Link className= { `nav-link ${ props.match.params.status ==='PENDING' ? 'active':'' }` } to="/history/PENDING">Pending</Link>
    </li>
</ul>
)

const validateStatusParams = (status) => {
  const allowedStatusesParams = ['all', 'FINISHED', 'PENDING'];
  return allowedStatusesParams.some( allowedStatus => allowedStatus === status);

}

class History extends Component {
  constructor(props) {
    super(props);
    this.state = {
      history: [],
      validStatus: true,
      status: this.props.match.params.status
    };

    this.unlisten = this.props.history.listen((location, action) => {
      const status = location.pathname.split('/')[2];
      this.setState({ status });
      this.fetchGameByParams(status);
    });
  }

  componentDidMount() {
    const { status } = this.state;
    this.fetchGameByParams(status);
    this.setState({ validStatus: validateStatusParams(status) });
  }

  componentWillUnmount() {
      this.unlisten();
  }

  handleDelete(gameId) {
    if (window.confirm('Are you sure you want to delete this game?')) {
      (async function() {
        try {
          const { n } = await deleteGameById(gameId);
          if (n > 0) {
            const { status } = this.state;
            await this.fetchGameByParams(status)
          }
        } catch (error) {
          console.log(error);
        }
      }).bind(this)();
    }
    return;
  }

  fetchGameByParams(status) {
    return (async function() {
      try {
        let history = await getGamesByGameStatus(status);
        history = history ? history : [];
        this.setState({ history });
        return history;
      } catch (error) {
        return null;
      }
    }).bind(this)();
  }

  renderHistoryList(historyEl, i) {
    let [date, time] = historyEl.date.split('T');
    const [hours, minutes] = time.split(':');
    time = `${ hours }:${ minutes }`;
    const color = historyEl.gameStatus === 'FINISHED' ? 'text-success' : 'text-warning';
    const backgroundColor = i % 2 === 0 ? '#ccc' : 'rgb(243, 237, 237)';
    return (
      <div key = {i} className="parent" style = {{ backgroundColor }}>
        <div className="descr">
          <h6>{ `${ historyEl.playerOneName } vs ${ historyEl.playerTwoName }` }</h6>
          <small className = { color }>{ historyEl.gameStatus }</small><br/>
          <small>{ date + ' ' + time }</small>
        </div>
        <div className="button">
          <Link to={ `/game/${historyEl._id}` } className="btn btn-primary btn-sm">{ historyEl.gameStatus !== 'FINISHED' ? 'play' : 'check' }</Link>
          <button className=" btn btn-danger btn-sm" onClick={ () => this.handleDelete(historyEl._id) } >Delete</button>
        </div>
      </div>
    );
  }

  render() {
    const { history } = this.state;
    if (this.state.validStatus)
      return(
        <div className ="container">
          <Link to="/">Go Back</Link>
          <Menu selected = { this.state.status } {...this.props}/>
          <div className="mt-5" id="history-list">
            { history.length > 0 ? 
              history.map( (el, i) => this.renderHistoryList(el, i))
              : <h2>There're no games available to see</h2> }
          </div>
        </div>      
      );
    else
      return(<Redirect to="/history"/>)
  }
}

export default withRouter(History);