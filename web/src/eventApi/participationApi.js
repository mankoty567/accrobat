import { checkStatus, host } from './api';

const participationApi = {
  /**
   * Permet d'obtenir toutes les participations de l'utilisateur
   * @returns Tableau de participation lié à l'utilisateur
   */
  getParticipations: () => {
    return fetch(`${host}/api/participation`, {
      method: 'POST',
      headers: {
        Authorization:
          'Bearer ' + window.localStorage.getItem('token'),
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data.participation),
    })
      .then(checkStatus)
      .then((res) => res.json());
  },
  /**
   * Permet à un utilisateur de participer à un challenge
   * @param {Object} data
   * @param {Number} data.ChallengeId Permet d'obtenir l'id d'un challenge
   * @returns La participation au challenge avec un status 200, ou alors un status 400
   */
  createParticipation: (data) => {
    return fetch(`${host}/api/participation`, {
      method: 'POST',
      headers: {
        Authorization:
          'Bearer ' + window.localStorage.getItem('token'),
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data.participation),
    })
      .then(checkStatus)
      .then((res) => res.json());
  },

  /**
   * Permet d'obtenir la progression d'un utilisateur sur une participation
   * @param {Object} data
   * @param {String} data.participation_id
   * @returns Un objet contenant toute la progression d'un utilisateur
   */
  getProgression: (data) => {
    return fetch(
      `${host}/api/participation/${data.participation_id}/whereiam`,
      {
        method: 'GET',
        headers: {
          Authorization:
            'Bearer ' + window.localStorage.getItem('token'),
        },
      },
    )
      .then(checkStatus)
      .then((res) => res.json());
  },
};

export default participationApi;
