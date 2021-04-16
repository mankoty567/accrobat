import { checkStatus, host } from './api';

const segmentApi = {
  /**
   * Permet d'obtenir un segment à partir de son id
   * @param {Number} segment_id L'id du segment en question
   * @returns Un objet segment
   */
  getSegment: (segment_id) => {
    return fetch(`${host}/api/segment/${segment_id}`, {
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
   * @param {Object} segment
   * @param {Number} segment.PointStartId L'id du départ du segment
   * @param {Number} segment.PointEndId L'id de l'arrivée du segment
   * @param {Number[][]} segment.path Les points intermédiaire du Segment
   * @param {String} segment.name Le nom d'un segment
   * @returns
   */
  createSegment: (segment) => {
    return fetch(`${host}/api/segment`, {
      method: 'POST',
      headers: {
        Authorization:
          'Bearer ' + window.localStorage.getItem('token'),
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(segment),
    })
      .then(checkStatus)
      .then((res) => res.json());
  },
  /**
   * Permet de mettre à jour les informations d'un segment
   * @param {Object} segment
   * @param {Number} segment.id L'id du segment à update
   * @param {Number} [segment.PointStartId] L'id du départ du segment
   * @param {Number} [segment.PointEndId] L'id de l'arrivée du segment
   * @param {Number[][]} [segment.path] Les points intermédiaire du Segment
   * @param {String} [segment.name] Le nom d'un segment
   * @returns L'objet segment modifié
   */
  updateSegment: (segment) => {
    return fetch(`${host}/api/segment/${segment.id}`, {
      method: 'POST',
      headers: {
        Authorization:
          'Bearer ' + window.localStorage.getItem('token'),
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(segment),
    })
      .then(checkStatus)
      .then((res) => res.json());
  },

  /**
   * Permet de supprimer un segment
   * @param {Number} segment_id L'id du segment à supprimer
   * @returns Un message avec status 200 ou 400 selon la réussite
   */
  deleteSegment: (segment_id) => {
    return fetch(`${host}/api/segment/${segment_id}`, {
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
