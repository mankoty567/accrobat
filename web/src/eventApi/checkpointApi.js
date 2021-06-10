import { checkStatus, host } from './api';

const checkpointApi = {
  /**
   * Permet d'obtenir tous les points de passage d'un challenge
   * @param {Object} data
   * @param {Number} data.challenge_id L'id du challenge
   * @param {String} data.include Les inclusions possibles (segment)
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
   * @param {Number} data.challenge_id L'id du challenge
   * @param {Object} data.marker Le nouveau point de passage
   * @param {String} data.marker.title Titre du point
   * @param {String} [data.marker.description] Description du point
   * @param {String} data.marker.type Type du point (start, end, checkpoint)
   * @param {Number} data.marker.x Longitude
   * @param {Number} data.marker.y Latitude
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
   * @param {Object} marker Le point de passage
   * @param {Number} marker.id L'id du point de passage
   * @param {String} [marker.title] Titre du point
   * @param {String} [marker.description] Description du point
   * @param {String} [marker.type] Type du point (start, end, checkpoint)
   * @param {Number} [marker.x] Longitude
   * @param {Number} [marker.y] Latitude
   * @returns Un objet point de passage
   */
  updateMarker: (marker) => {
    return fetch(`${host}/api/pointpassage/${marker.id}`, {
      method: 'POST',
      headers: {
        Authorization:
          'Bearer ' + window.localStorage.getItem('token'),
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(marker),
    })
      .then(checkStatus)
      .then((res) => res.json());
  },

  /**
   * Permet de supprimer un point de passage à partir de son id
   * @param {Number} marker_id L'id du marker à supprimer
   * @returns Un message au status 200 ou 400
   */
  deleteMarker: (marker_id) => {
    return fetch(`${host}/api/pointpassage/${marker_id}`, {
      method: 'DELETE',
      headers: {
        Authorization:
          'Bearer ' + window.localStorage.getItem('token'),
      },
    })
      .then(checkStatus)
      .then((res) => {
        res.text();
      });
  },
};

export default checkpointApi;
