/* eslint-disable quotes */

const m = require('../index');

module.exports.meta = {
  title: 'Event',
};

module.exports.routes = [
  {
    method: 'POST',
    url: '/api/event',
    func: [m.user_mdw.put_user, m.event_ctrl.post_event],
    body: {
      ParticipationId: 'number',
      type: {
        type: 'string',
        required: true,
        value: [
          'marche',
          'course',
          'velo',
          'pointpassage:arrivee',
          'pointpassage:depart',
          'obstacle:arrivee',
        ],
      },
      data: {
        type: 'number',
        required: false,
      },
    },
    result: [
      {
        code: 200,
        content: {
          id: 0,
          type: 'type',
          data: 0,
          updatedAt: 'date',
          createdAt: 'date',
        },
      },
      { code: 400, content: 'Bad request: No data' },
      { code: 400, content: 'Bad request: Participation not found' },
    ],
    name: 'Ajoute un évènement à une participation',
    description:
      "Certains types doivent avoir des données, d'autres non.\nData obligatoire pour le type marche [distance], course [distance], velo [distance], pointpassage:depart [segment choisi]",
  },
  {
    method: 'GET',
    url: '/api/participation/:id/whereiam',
    func: [m.user_mdw.put_user, m.event_ctrl.whereiam],
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
