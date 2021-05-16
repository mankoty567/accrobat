import { checkStatus, host } from './api';

const challengeToVoteApi = {
  /**
   * Ajoute un challenge à voter
   * @param {String} description La description du challenge à voter
   * @return "OK"
   */
  addToVote: (description) => {
    return fetch(`${host}/api/challengetovote`, {
      method: 'POST',
      headers: {
        Authorization:
          'Bearer ' + window.localStorage.getItem('token'),
        'content-type': 'application/json',
      },
      body: JSON.stringify({ description: description }),
    })
      .then(checkStatus)
      .then((res) => res.text());
  },
  /**
   * Récupération de tous les challenges à voter
   * @return Tableau des challengeToVote
   */
  getToVoteAdmin: () => {
    return fetch(`${host}/api/challengetovote/admin`, {
      method: 'GET',
      headers: {
        Authorization:
          'Bearer ' + window.localStorage.getItem('token'),
      },
    })
      .then(checkStatus)
      .then((res) => res.json());
  },
};

export default challengeToVoteApi;
