const PORT = 5000;
const BASE_URL = `http://localhost:${ PORT }/api`;
const GAME_BOARD_END = '/gameboard';

export async function checkCurrentGame() {
  const options = {
    method: 'GET',
    mode: 'cors',
  }
  try {
    const data = await fetch(BASE_URL + GAME_BOARD_END + '?gameStatus=CURRENT', options)
                             .then( response => response.text());
    const { result } = await JSON.parse(data);
    return result;
  } catch (error) {
    console.log(error);
    return null;
  }
}

export async function deleteGameById(gameId) {
  const options = {
    method: 'DELETE',
    mode: 'cors'
  };

  try {
    const data = await fetch(BASE_URL + GAME_BOARD_END + `/${ gameId }`, options)
                             .then( response => response.text());
    const { result } = await JSON.parse(data);
    return result;
  } catch (error) {
    console.log(error);
    return null;
  }
}

export async function createGame(gameObj) {
  // eslint-disable-next-line
  const options = {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(gameObj)
  };

  console.log(options);
  try {
    const response = await fetch(BASE_URL + GAME_BOARD_END, options).then(resp => resp.text());
    const { result } = await JSON.parse(response);
    return result;
  } catch (error) {
    console.log(error)
    return false;
  }
}

export async function getGameById(gameId) {
  const options = {
    method: 'GET',
    mode: 'cors',
  }
  try {
    const data = await fetch(BASE_URL + GAME_BOARD_END + `?_id=${ gameId }`, options)
    .then( response => response.text());
    const { result } = await JSON.parse(data);
    return result;
  } catch (error) {
    console.log(error);
    return null;
  }
}

export async function updateGameStatus(gameStatus, id) {
  const payload = {
    gameStatus
  };

  const body = JSON.stringify(payload);
  const options = {
    method: 'PUT',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    body
  };

  try {
    const data = await fetch(BASE_URL + GAME_BOARD_END + `/${id}`, options)
    .then( response => response.text());
    const { result } = await JSON.parse(data);
    return result;
  } catch (error) {
    console.log(error);
    return null;
  }
}

export async function getGamesByGameStatus(gameStatus) {
  const queryString = gameStatus !== 'all' ? `?gameStatus=${gameStatus}` : '';
  const options = {
    method: 'GET',
    mode: 'cors'
  };

  try {
    const data = await fetch(BASE_URL + GAME_BOARD_END + `/${queryString}`, options)
                        .then( response => response.text());
    const { result } = JSON.parse(data);
    return result;
  } catch (error) {
    console.log(error);
    return null;
  }
}

export function updateGameHistory(historyArray, winner, gameStatus, id) {
  const payload = {
    history: JSON.stringify(historyArray),
    gameStatus,
    winner: winner ? winner : null
  }
  console.log(payload);
  const body = JSON.stringify(payload);
  const options = {
    method: 'PUT',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    body
  };

  return fetch(BASE_URL + GAME_BOARD_END + `/${id}`, options);
}
