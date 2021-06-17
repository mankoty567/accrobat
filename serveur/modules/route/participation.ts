/* eslint-disable quotes */

import { Route } from '../../_types';

const m = require('../index');

module.exports.meta = {
  title: 'Participation',
};

const routes: Route[] = [
  {
    method: 'POST',
    url: '/api/participation',
    func: [m.participation_ctrl.post_participation],
    permission: 0,
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
    func: [m.participation_ctrl.get_my_participation],
    permission: 0,
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
    func: [m.participation_ctrl.whereiam],
    permission: 0,
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
          distancePourcentage: 0.0,
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
  {
    method: 'GET',
    url: '/api/participation/:id/session',
    func: [m.participation_ctrl.get_session],
    permission: 0,
    name: 'Récupération des sessions',
    description:
      "Récupère tous les évènements liés à la participation de l'utilisateur",
    result: [
      {
        code: 200,
        content: [
          {
            id: 0,
            type: '',
            data: '',
            createdAt: 'date',
            updatedAt: 'date',
            ParticipationId: 0,
          },
        ],
      },
    ],
  },
];

module.exports.routes = routes;
