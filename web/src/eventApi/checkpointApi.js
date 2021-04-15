import { checkStatus, host } from './api';

const checkpointApi = {
  /**
   * Permet d'obtenir tout les points de passage d'un challenge
   * @param {Object} data
   * @param {String} data.challenge_id L'id du challenge
   * @returns Une liste de markers
   */
  getMarkers: (data) => {
    return fetch(
      `${host}/api/challenge/${data.challenge_id}/point?include=${data.include}`,
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
   * Permet de créer un point de passage à partir d'un id de challenge
   * @param {Object} data
   * @param {String} data.challenge_id L'id du challenge
   * @returns Un objet point de passage
   */
  createMarker: (data) => {
    return fetch(`${host}/api/challenge/${data.challenge_id}/point`, {
      method: 'POST',
      headers: {
        Authorization:
          'Bearer ' + window.localStorage.getItem('token'),
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data.marker),
    })
      .then(checkStatus)
      .then((res) => res.json());
  },

  /**
   * Permet d'update les informations d'un point de passage à partir de son id
   * @param {Object} data
   * @param {String} data.marker_id L'id du point de passage
   * @returns Un objet point de passage
   */
  updateMarker: (data) => {
    return fetch(`${host}/api/pointpassage/${data.marker_id}`, {
      method: 'POST',
      headers: {
        Authorization:
          'Bearer ' + window.localStorage.getItem('token'),
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data.marker),
    })
      .then(checkStatus)
      .then((res) => res.json());
  },

  /**
   * Permet de supprimer un point de passage à partir de son id
   * @param {Object} data
   * @param {String} data.marker_id L'id du point de passage
   * @returns Un message au status 200 ou 400
   */
  deleteMarker: (data) => {
    return fetch(`${host}/api/pointpassage/${data.marker_id}`, {
      method: 'DELETE',
      headers: {
        Authorization:
          'Bearer ' + window.localStorage.getItem('token'),
      },
    })
      .then(checkStatus)
      .then((res) => res.json());
  },
};

export default checkpointApi;
