/* eslint-disable quotes */

import { Route } from '../../_types';

const m = require('../index');

module.exports.meta = {
  title: 'PropositionChallenge',
};

const routes: Route[] = [
  {
    method: 'POST',
    url: '/api/propositionchallenge',
    func: [m.propositionchallenge_ctrl.add_proposition],
    permission: 0,
    name: "Ajout d'une proposition de challenge",
    body: {
      description: 'string',
    },
    result: [{ code: 200, content: 'OK' }],
  },
  {
    method: 'GET',
    url: '/api/propositionchallenge',
    func: [m.propositionchallenge_ctrl.get_proposition],
    permission: 100,
    name: 'Récupération des propositions de challenge',
    query: [
      {
        param: 'status=waiting',
        desc: 'Récupère uniquement les propositions en attentes (par défaut)',
      },
      {
        param: 'status=all',
        desc: 'Récupère toutes les propositions de challenge',
      },
    ],
    result: [
      {
        code: 200,
        content: [
          {
            id: 1,
            description: '',
            status: 'waiting/accepted/refused',
            createdAt: '',
            updatedAt: '',
            UserId: 0,
          },
        ],
      },
    ],
  },
  {
    method: 'POST',
    url: '/api/propositionchallenge/:id',
    func: [m.propositionchallenge_ctrl.update_proposition],
    permission: 100,
    name: 'Modification du status des propositions de challenge',
    body: {
      status: {
        type: 'string',
        value: ['waiting', 'accepted', 'refused'],
      },
    },
    result: [
      {
        code: 200,
        content: {
          id: 0,
          description: '',
          status: 'waiting/accepted/refused',
          createdAt: '',
          updatedAt: '',
          UserId: 0,
        },
      },
      { code: 404, content: 'PropositionChallenge not found' },
    ],
  },
];

module.exports.routes = routes;
