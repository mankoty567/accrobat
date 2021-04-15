import { checkStatus, host } from './api';

const segmentApi = {
  /**
   * Permet d'obtenir un segment à partir de son id
   * @param {Object} data
   * @param {String} data.segment_id L'id du segment en question
   * @returns Un objet segment
   */
  getSegment: () => {
    return fetch(`${host}/api/segment/${data.segment_id}`, {
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
   * Permet de créer un segment
   * @param {Object} data
   * @param {Number} data.PointStartId L'id du départ du segment
   * @param {Number} data.PointEndId L'id de l'arrivée du segment
   * @param {Number[][]} data.path Les points intermédiaire du Segment
   * @param {String} data.name Le nom d'un segment
   * @returns
   */
  createSegment: (data) => {
    return fetch(`${host}/api/segment`, {
      method: 'POST',
      headers: {
        Authorization:
          'Bearer ' + window.localStorage.getItem('token'),
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data.segment),
    })
      .then(checkStatus)
      .then((res) => res.json());
  },
  /**
   * Permet de mettre à jour les informations d'un segment
   * @param {Object} data
   * @param {Number} [data.PointStartId] L'id du départ du segment
   * @param {Number} [data.PointEndId] L'id de l'arrivée du segment
   * @param {Number[][]} [data.path] Les points intermédiaire du Segment
   * @param {String} [data.name] Le nom d'un segment
   * @param {String} data.segment_id L'id du segment à update
   * @returns L'objet segment modifié
   */
  updateSegment: (data) => {
    return fetch(`${host}/api/segment/${data.segment_id}`, {
      method: 'POST',
      headers: {
        Authorization:
          'Bearer ' + window.localStorage.getItem('token'),
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data.segment),
    })
      .then(checkStatus)
      .then((res) => res.json());
  },

  /**
   * Permet de supprimer un segment
   * @param {Object} data
   * @param {String} data.segment_id L'id du segment à update
   * @returns Un message avec status 200 ou 400 selon la réussite
   */
  deleteSegment: (data) => {
    return fetch(`${host}/api/segment/${data.segment_id}`, {
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

export default segmentApi;
