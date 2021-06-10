import { checkStatus, host } from './api';

const obstacleApi = {
  /**
   * Permet de créer un obstacle
   * @param {Object} obstacle
   * @param {String} [obstacle.enigme_awnser] Réponse attendue de l'énigme. Optionnelle il peut s'agir d'un challenge par image
   * @param {String} obstacle.title Titre de l'obstacle
   * @param {String} obstacle.description Description de l'obstacle
   * @param {String} obstacle.type Type de l'obstacle (image ou enigme)
   * @param {Number} obstacle.distance Distance du segment sur laquelle l'obstacle se trouve (de 0 à 1)
   * @param {Number} obstacle.SegmentId Id du segment attaché
   * @param {String} obstacle.enigme_img Image de l'enigme, encodée en base64
   * @returns L'objet obstacle créé
   */
  createObstacle: (obstacle) => {
    return fetch(`${host}/api/obstacle`, {
      method: 'POST',
      headers: {
        Authorization:
          'Bearer ' + window.localStorage.getItem('token'),
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(obstacle),
    })
      .then(checkStatus)
      .then((res) => res.json());
  },

  /**
   * Permet de modifier les informations d'un obstacle
   * @param {Object} obstacle
   * @param {Number} obstacle.id id de l'obstacle en question
   * @param {String} [obstacle.title] Titre de l'obstacle
   * @param {String} [obstacle.description] Description de l'obstacle
   * @param {String} [obstacle.type] Type de l'obstacle (image ou enigme)
   * @param {Number} [obstacle.distance] Distance du segment sur laquelle l'obstacle se trouve
   * @param {String} [obstacle.enigme_img] Image de l'enigme, encodée en base64
   * @param {String} [obstacle.enigme_awnser] Réponse attendue de l'énigme. Optionnelle il peut s'agir d'un challenge par image
   * @returns
   */
  updateObstacle: (obstacle) => {
    return fetch(`${host}/api/obstacle/${obstacle.id}`, {
      method: 'POST',
      headers: {
        Authorization:
          'Bearer ' + window.localStorage.getItem('token'),
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(obstacle),
    })
      .then(checkStatus)
      .then((res) => res.json());
  },

  /**
   * Permet de supprimer un obstacle depuis son id
   * @param {Number} obstacle_id id de l'obstacle
   * @returns
   */
  deleteObstacle: (obstacle_id) => {
    return fetch(`${host}/api/obstacle/${obstacle_id}`, {
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

export default obstacleApi;
