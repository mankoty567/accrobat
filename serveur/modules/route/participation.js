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
];
