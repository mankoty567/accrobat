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
  /**
   * Change challengeToVote status
   * @param {Number} id Id du challengeToVote à modifier
   * @param {status} status Nouveau status du challenge
   * @return Challenge mis à jour
   */
  changeToVote: (id, body) => {
    return fetch(`${host}/api/challengetovote/${id}`, {
      method: 'POST',
      headers: {
        Authorization:
          'Bearer ' + window.localStorage.getItem('token'),
        'content-type': 'application/json',
      },
      body: JSON.stringify(body),
    })
      .then(checkStatus)
      .then((res) => res.json());
  },
  /**
   * Récupère les challengesToVote ouverts au vote, ainsi que les votes de la personne
   * @return Liste des challengesToVote
   */
  getToVote: () => {
    return fetch(`${host}/api/challengetovote`, {
      method: 'GET',
      headers: {
        Authorization:
          'Bearer ' + window.localStorage.getItem('token'),
      },
    })
      .then(checkStatus)
      .then((res) => res.json());
  },
  /**
   * Vote pour un challengeToVote
   * @param {Number} id L'id du challenge à voter
   * @param {Number} vote Le vote
   * @return OK
   */
  vote: (id, vote) => {
    return fetch(`${host}/api/challengetovote/${id}/vote`, {
      method: 'POST',
      headers: {
        Authorization:
          'Bearer ' + window.localStorage.getItem('token'),
        'content-type': 'application/json',
      },
      body: JSON.stringify({ vote: vote }),
    })
      .then(checkStatus)
      .then((res) => res.text());
  },
};

export default challengeToVoteApi;
