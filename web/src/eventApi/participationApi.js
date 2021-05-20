import { checkStatus, host } from './api';

const participationApi = {
  /**
   * Permet d'obtenir toutes les participations de l'utilisateur
   * @returns Tableau de participation lié à l'utilisateur
   */
  getParticipations: () => {
    return fetch(`${host}/api/participation`, {
      method: 'GET',
      headers: {
        Authorization:
          'Bearer ' + window.localStorage.getItem('token'),
        'Content-Type': 'application/json',
      },
    })
      .then(checkStatus)
      .then((res) => res.json());
  },

  /**
   * Permet à un utilisateur de participer à un challenge
   * @param {Number} challenge_id L'id du challenge à s'inscrire
   * @returns La participation au challenge avec un status 200, ou alors un status 400
   */
  createParticipation: (challenge_id) => {
    return fetch(`${host}/api/participation`, {
      method: 'POST',
      headers: {
        Authorization:
          'Bearer ' + window.localStorage.getItem('token'),
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ ChallengeId: challenge_id }),
    })
      .then(checkStatus)
      .then((res) => res.json());
  },

  /**
   * Permet d'obtenir la progression d'un utilisateur sur une participation
   * @param {Number} participation_id id de la progression
   * @returns Un objet contenant toute la progression d'un utilisateur
   */
  getProgression: (participation_id) => {
    return fetch(
      `${host}/api/participation/${participation_id}/whereiam`,
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
