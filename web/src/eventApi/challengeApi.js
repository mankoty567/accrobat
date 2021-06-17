import { checkStatus, host } from './api';

const challengeApi = {
  /**
   * Permet d'obtenir la liste des challenges publiés
   * @returns Tableau de challenges
   */
  getChallenges: () => {
    return fetch(`${host}/api/challenge`, {
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
   * Permet d'obtenir tout les challenges, publiés ou non
   * @returns Tableau de challenges
   */
  getAdminChallenges: () => {
    return fetch(`${host}/api/challenge/admin`, {
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
   * Permet de récupérer un challenge avec un id précis
   * @param {Object} data
   * @param {Number} data.challenge_id L'id du challenge voulu
   * @param {String} data.include Les inclusions possibles (point, pointsegment ou pointsegmentobstacle)
   * @returns Un challenge
   */
  getChallenge: (data) => {
    return fetch(
      `${host}/api/challenge/${data.challenge_id}?include=${data.include}`,
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

  /**
   * Permet de créer un challenge
   * @param {Object} challenge Challenge à créer
   * @param {String} [challenge.img_avatar] Image d'avatar du challenge encodée en base64
   * @param {String} challenge.title Titre du challenge
   * @param {String} challenge.description Description du challenge
   * @param {Number} challenge.echelle Echelle de la carte
   * @param {String} challenge.img_fond Image de fond de la carte encodée en base64
   * @returns Le challenge avec son id
   */
  createChallenge: (challenge) => {
    return fetch(`${host}/api/challenge`, {
      method: 'POST',
      headers: {
        Authorization:
          'Bearer ' + window.localStorage.getItem('token'),
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(challenge),
    })
      .then(checkStatus)
      .then((res) => res.json());
  },

  /**
   * Permet de mettre à jour les informations sur un challenge
   * @param {Object} data
   * @param {Object} data.challenge Challenge mis à jour
   * @param {Number} data.challenge.id L'id du challenge voulu
   * @param {String} [data.challenge.img_avatar] Image d'avatar du challenge encodée en base64
   * @param {String} data.challenge.title Titre du challenge
   * @param {String} data.challenge.description Description du challenge
   * @param {Number} data.challenge.echelle Echelle de la carte
   * @param {String} data.challenge.img_fond Image de fond de la carte encodée en base64
   * @returns Le challenge avec son id, qui sera modifié !
   */
  updateChallenge: (data) => {
    return fetch(`${host}/api/challenge/${data.challenge.id}`, {
      method: 'POST',
      headers: {
        Authorization:
          'Bearer ' + window.localStorage.getItem('token'),
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data.challenge),
    })
      .then(checkStatus)
      .then((res) => res.json());
  },

  /**
   * Permet de supprimer un challenge avec un id précis
   * @param {Number} challenge_id L'id du challenge voulu
   * @returns Un message au status 200 ou 400
   */
  deleteChallenge: (challenge_id) => {
    return fetch(`${host}/api/challenge/${challenge_id}`, {
      method: 'DELETE',
      headers: {
        Authorization:
          'Bearer ' + window.localStorage.getItem('token'),
      },
    })
      .then(checkStatus)
      .then((res) => res.text());
  },

  /**
   * Permet de cloner un challenge avec un id précis
   * @param {Number} challenge_id L'id du challenge voulu
   * @returns Un challenge
   */
  cloneChallenge: (challenge_id) => {
    return fetch(`${host}/api/challenge/${challenge_id}/clone`, {
      method: 'POST',
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
   * Permet d'obtenir l'image de fond d'un challenge
   * @param {Number} challenge_id L'id du challenge voulu
   * @returns Un challenge
   */
  getChallengeImage: (challenge_id) => {
    return fetch(`${host}/api/challenge/${challenge_id}/image`, {
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
   * Permet de vérifier la validité d'un challenge
   * @param {Number} challenge_id L'id du challenge voulu
   * @returns Un challenge
   */
  checkValidity: (challenge_id) => {
    return fetch(`${host}/api/challenge/${challenge_id}/validity`, {
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
   * Permet de vérifier la validité d'un challenge
   * @param {String} challenge_id L'id du challenge voulu
   * @returns Un challenge
   */
  publishChallenge: (challenge_id) => {
    return fetch(`${host}/api/challenge/${challenge_id}/publish`, {
      method: 'POST',
      headers: {
        Authorization:
          'Bearer ' + window.localStorage.getItem('token'),
      },
    })
      .then(checkStatus)
      .then((res) => res.json());
  },
};

export default challengeApi;
