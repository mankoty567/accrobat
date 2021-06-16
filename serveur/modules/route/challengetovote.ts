/* eslint-disable quotes */

import { Route } from '../../_types';

const m = require('../index');

module.exports.meta = {
  title: 'ChallengeToVote',
};

const routes: Route[] = [
  {
    method: 'POST',
    url: '/api/challengetovote',
    func: [m.challengetovote_ctrl.add_tovote],
    permission: 100,
    name: 'Ajoute un challenge à voter',
    body: {
      description: 'string',
    },
    result: [{ code: 200, content: 'OK' }],
  },
  {
    method: 'POST',
    url: '/api/challengetovote/:id',
    func: [m.challengetovote_ctrl.update_tovote],
    permission: 100,
    name: 'Met à jour un challenge à voter',
    body: {
      status: {
        type: 'string',
        value: ['open', 'close'],
        required: false,
      },
      description: {
        type: 'string',
        required: false,
      },
    },
    result: [
      {
        code: 200,
        content: {
          id: 0,
          description: '',
          status: 'open/close',
          updatedAt: '',
          createdAt: '',
        },
      },
      { code: 404, content: 'Not found' },
    ],
  },
  {
    method: 'POST',
    url: '/api/challengetovote/:id/vote',
    func: [m.challengetovote_ctrl.vote],
    permission: 0,
    name: 'Vote sur un ChallengeToVote',
    body: {
      vote: 'number',
    },
    result: [
      { code: 200, content: 'OK' },
      { code: 404, content: 'ChallengeToVote not found' },
    ],
  },
  {
    method: 'GET',
    url: '/api/challengetovote',
    func: [m.challengetovote_ctrl.get_challengetovote],
    permission: 0,
    name: 'Récupération des challenges à voter',
    result: [
      {
        code: 200,
        content: [
          {
            id: 0,
            description: '',
            status: 'open',
            createdAt: '',
            updatedAt: '',
            vote: '0/-1/1/null',
          },
        ],
      },
    ],
  },
  {
    method: 'GET',
    url: '/api/challengetovote/admin',
    func: [m.challengetovote_ctrl.get_challengetovote_admin],
    permission: 100,
    name: "Récupération des challenges à voter en tant qu'admin",
    result: [
      {
        code: 200,
        content: [
          {
            id: 0,
            description: '',
            status: 'open/close',
            createdAt: '',
            updatedAt: '',
            voteSum: 0,
            userVote: 0,
          },
        ],
      },
    ],
  },
];

module.exports.routes = routes;
