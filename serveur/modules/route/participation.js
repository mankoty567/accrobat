/* eslint-disable quotes */

const m = require('../index');

module.exports.meta = {
  title: 'Participation',
};

module.exports.routes = [
  {
    method: 'POST',
    url: '/api/participation',
    func: [m.user_mdw.put_user, m.participation_ctrl.post_participation],
    name: 'Inscription à un challenge',
    description: "Inscrit l'utilisateur courant à un challenge",
    body: {
      ChallengeId: 'number',
    },
    result: [
      {
        code: 200,
        content: {
          id: 0,
          startDate: 'date',
          UserId: 0,
          ChallengeId: 0,
          updatedAt: 'date',
          createdAt: 'date',
        },
      },
      { code: 400, content: 'Bad request' },
      { code: 400, content: 'Bad request: Challenge not found' },
      { code: 400, content: 'Bad request: Challenge is not published' },
    ],
  },
  {
    method: 'GET',
    url: '/api/participation',
    func: [m.user_mdw.put_user, m.participation_ctrl.get_my_participation],
    name: 'Récupération des participations',
    description: "Récupère toutes les participations de l'utilisateur connecté",
    result: [
      {
        code: 200,
        content: [
          {
            id: 0,
            startDate: 'date',
            endDate: 'null/date',
            UserId: 0,
            ChallengeId: 0,
          },
        ],
      },
    ],
  },
  {
    method: 'GET',
    url: '/api/participation/:id/whereiam',
    func: [m.user_mdw.put_user, m.participation_ctrl.whereiam],
    name: 'Récupération de ma position',
    description: "Récupère la position de l'utilisateur et l'entitée associée",
    result: [
      {
        code: 200,
        content: {
          segmentsParcourus: [],
          type: 'PointPassage',
          entity: {
            id: 0,
            title: '',
            description: '',
            type: 'start/end/point',
            x: 0.0,
            y: 0.0,
            createdAt: 'date',
            updatedAt: 'date',
            ChallengeId: 0,
          },
        },
      },
      {
        code: 200,
        content: {
          segmentsParcourus: [],
          type: 'Segment',
          distance: 0.0,
          entity: {
            id: 0,
            path: [[0.0, 0.0]],
            createdAt: 'date',
            updatedAt: 'date',
            PointStartId: 0,
            PointEndId: 0,
          },
        },
      },
      {
        code: 200,
        content: {
          segmentsParcourus: [],
          type: 'Obstacle',
          entity: {
            id: 0,
            title: '',
            description: '',
            type: 'question/action',
            distance: 0,
          },
          submitedImg: {
            createdAt: 'date',
            updatedAt: 'date',
          },
        },
      },
      { code: 403, content: 'Participation is not to logged user' },
    ],
  },
];
