/* eslint-disable quotes */

const m = require('../index');

module.exports.meta = {
  title: 'Obstacle',
};

module.exports.routes = [
  {
    method: 'POST',
    url: '/api/obstacle',
    func: [m.user_mdw.put_admin, m.obstacle_ctrl.post_obstacle],
    body: {
      title: 'string',
      description: 'string',
      type: {
        type: 'string',
        required: true,
        value: ['question', 'action'],
      },
      distance: 'number',
      SegmentId: 'number',
      enigme_awnser: {
        type: 'string',
        required: false,
      },
      enigme_img: {
        type: 'data_url',
        required: false,
      },
      frontId: {
        type: 'number',
        required: false,
      },
    },
    name: 'Création obstacle',
    description:
      'Crée un obstacle sur un segment. Le champs enigme_awnser est obligatoire pour un obstacle de type question',
    result: [
      {
        code: 200,
        content: {
          id: 0,
          title: '',
          description: '',
          type: 'question/action',
          distance: 0,
          enigme_awnser: '',
          SegmentId: 0,
          updatedAt: 'date',
          createdAt: 'date',
        },
      },
      {
        code: 400,
        content: 'Bad request',
      },
      { code: 400, content: 'Bad Request: Segment not found' },
      { code: 400, content: 'Bad request: Challenge is published' },
    ],
  },
  {
    method: 'POST',
    url: '/api/obstacle/awnser',
    func: [m.user_mdw.put_user, m.obstacle_ctrl.awnser_obstacle],
    name: "Ajout d'une réponse",
    description: 'Propose une réponse à une question',
    body: {
      ParticipationId: 'number',
      awnser: 'string',
    },
    result: [
      { code: 200, content: { good: 'false/true' } },
      { code: 400, content: 'Bad request' },
      { code: 400, content: 'Bad request: Participation not found' },
      { code: 400, content: 'Bad request: Not in an obstacle' },
      { code: 400, content: 'Bad request: Obstacle is not a question' },
    ],
  },
  {
    method: 'GET',
    url: '/api/obstacle/:id/image',
    func: [m.obstacle_ctrl.get_image],
    name: "Récupération de l'image d'un obstacle",
    description:
      "Récupération de l'image liée à un obstacle sous la forme d'un fichier tout basique",
  },
  {
    method: 'POST',
    url: '/api/obstacle/:id',
    func: [m.user_mdw.put_admin, m.obstacle_ctrl.update_obstacle],
    name: "Modification d'un obstacle",
    description: "Modifie les données d'un obstacle",
    body: {
      title: {
        type: 'string',
        required: false,
      },
      description: {
        type: 'string',
        required: false,
      },
      type: {
        type: 'string',
        required: false,
        value: ['question', 'action'],
      },
      distance: {
        type: 'number',
        required: false,
      },
      enigme_img: {
        type: 'data_url',
        required: false,
      },
      enigme_awnser: {
        type: 'string',
        required: false,
      },
    },
    result: [
      {
        code: 200,
        content: {
          id: 0,
          title: '',
          description: '',
          type: 'question/action',
          distance: 0,
          enigme_awnser: '',
          createdAt: 'date',
          updatedAt: 'date',
          SegmentId: 0,
        },
      },
    ],
  },
  {
    method: 'DELETE',
    url: '/api/obstacle/:id',
    func: [m.user_mdw.put_admin, m.obstacle_ctrl.delete_obstacle],
    name: "Suppression d'un obstacle",
    description:
      "Supprime un obstacle si il n'est pas dans un challenge publié",
    result: [
      { code: 200, content: 'OK' },
      { code: 400, content: 'Bad Request' },
      { code: 404, content: 'Obstacle not found' },
    ],
  },
];
