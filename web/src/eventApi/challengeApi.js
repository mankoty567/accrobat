import { checkStatus, host } from './api';

export default challengeApi = {
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
   * @param {String} data.challenge_id L'id du challenge voulu
   * @param {String} data.include Les inclusions possible (point, pointsegment ou pointsegmentobstacle)
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
   * @param {Object} data
   * @param {String} [data.img_avatar] Image d'avatar du challenge encodée en base64
   * @param {Number} [data.frontId] Id en front du challenge
   * @param {String} data.title Titre du challenge
   * @param {String} data.description Description du challenge
   * @param {Number} data.echelle Echelle de la carte
   * @param {String} data.img_fond Image de fond de la carte encodée en base64
   * @returns Le challenge avec son id
   */
  createChallenge: (data) => {
    return fetch(`${host}/api/challenge`, {
      method: 'POST',
      headers: {
        // Authorization:
        //   'Bearer ' + window.localStorage.getItem('token'),
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })
      .then(checkStatus)
      .then((res) => res.json());
  },

  /**
   * Permet de mettre à jour les informations sur un challenge
   * @param {Object} data
   * @param {String} [data.img_avatar] Image d'avatar du challenge encodée en base64
   * @param {String} data.title Titre du challenge
   * @param {String} data.description Description du challenge
   * @param {Number} data.echelle Echelle de la carte
   * @param {String} data.img_fond Image de fond de la carte encodée en base64
   * @returns Le challenge avec son id, qui sera modifié !
   */
  updateChallenge: (data) => {
    return fetch(`${host}/api/challenge/${data.challenge_id}`, {
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
   * @param {Object} data
   * @param {String} data.challenge_id L'id du challenge voulu
   * @returns Un message au status 200 ou 400
   */
  deleteChallenge: (data) => {
    return fetch(`${host}/api/challenge/${data.challenge_id}`, {
      method: 'DELETE',
      // headers: {
      //   Authorization:
      //     'Bearer ' + window.localStorage.getItem('token'),
      // },
    })
      .then(checkStatus)
      .then((res) => res.text());
  },

  /**
   * Permet de cloner un challenge avec un id précis
   * @param {Object} data
   * @param {String} data.challenge_id L'id du challenge voulu
   * @returns Un challenge
   */
  cloneChallenge: (data) => {
    return fetch(`${host}/api/challenge/${data.challenge_id}/clone`, {
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
   * @param {Object} data
   * @param {String} data.challenge_id L'id du challenge voulu
   * @returns Un challenge
   */
  getChallengeImage: (data) => {
    return fetch(`${host}/api/challenge/${data.challenge_id}/image`, {
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
   * @param {String} id l'id du challenge voulu
   * @returns Un challenge
   */
  checkValidity: (id) => {
    return fetch(`${host}/api/challenge/${id}/validity`, {
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
   * @param {String} id l'id du challenge voulu
   * @returns Un challenge
   */
  publishChallenge: (id) => {
    return fetch(`${host}/api/challenge/${id}/publish`, {
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
