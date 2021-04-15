import { checkStatus, host } from './api';

const obstacleApi = {
  /**
   * Permet de créer un obstacle
   * @param {Object} data
   * @param {String} [data.enigme_awnser] Réponse attendue de l'énigme. Optionnelle il peut s'agir d'un challenge par image
   * @param {Number} [data.frontId] Id en front
   * @param {String} data.title Titre de l'obstacle
   * @param {String} data.description Description de l'obstacle
   * @param {String} data.type Type de l'obstacle (image ou enigme)
   * @param {Number} data.distance Distance du segment sur laquelle l'obstacle se trouve
   * @param {Number} data.SegmentId Id du segment attaché
   * @param {String} data.enigme_img Image de l'enigme, encodée en base64
   * @returns L'objet obstacle créé
   */
  createObstacle: (data) => {
    return fetch(`${host}/api/obstacle`, {
      method: 'POST',
      headers: {
        Authorization:
          'Bearer ' + window.localStorage.getItem('token'),
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data.obstacle),
    })
      .then(checkStatus)
      .then((res) => res.json());
  },

  /**
   * Permet de modifier les informations d'un obstacle
   * @param {Object} data
   * @param {String} [data.title] Titre de l'obstacle
   * @param {String} [data.description] Description de l'obstacle
   * @param {String} [data.type] Type de l'obstacle (image ou enigme)
   * @param {Number} [data.distance] Distance du segment sur laquelle l'obstacle se trouve
   * @param {Number} data.obstacle_id id de l'obstacle en question
   * @param {String} [data.enigme_img] Image de l'enigme, encodée en base64
   * @param {String} [data.enigme_awnser] Réponse attendue de l'énigme. Optionnelle il peut s'agir d'un challenge par image
   * @returns
   */
  updateObstacle: (data) => {
    return fetch(`${host}/api/obstacle/${data.obstacle_id}`, {
      method: 'POST',
      headers: {
        Authorization:
          'Bearer ' + window.localStorage.getItem('token'),
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data.obstacle),
    })
      .then(checkStatus)
      .then((res) => res.json());
  },

  /**
   * Permet de supprimer un obstacle depuis son id
   * @param {Object} data
   * @param {String} data.obstacle_id id de l'obstacle
   * @returns
   */
  deleteObstacle: (data) => {
    return fetch(`${host}/api/obstacle/${data.obstacle_id}`, {
      method: 'DELETE',
      headers: {
        Authorization:
          'Bearer ' + window.localStorage.getItem('token'),
        'Content-Type': 'application/json',
      },
    })
      .then(checkStatus)
      .then((res) => res.json());
  },
};

export default obstacleApi;
