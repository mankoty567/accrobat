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
};

export default challengeToVoteApi;
