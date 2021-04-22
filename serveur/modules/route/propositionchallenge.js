/* eslint-disable quotes */

const m = require('../index');

module.exports.meta = {
  title: 'PropositionChallenge',
};

module.exports.routes = [
  {
    method: 'POST',
    url: '/api/propositionchallenge',
    func: [m.user_mdw.put_user, m.propositionchallenge_ctrl.add_proposition],
    name: "Ajout d'une proposition de challenge",
    body: {
      description: 'string',
    },
    result: [{ code: 200, content: 'OK' }],
  },
  {
    method: 'GET',
    url: '/api/propositionchallenge',
    func: [m.user_mdw.put_admin, m.propositionchallenge_ctrl.get_proposition],
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
  },
  {
    method: 'POST',
    url: '/api/propositionchallenge/:id',
    func: [
      m.user_mdw.put_admin,
      m.propositionchallenge_ctrl.update_proposition,
    ],
    name: 'Modification du status des propositions de challenge',
    body: {
      status: {
        type: 'string',
        value: ['waiting', 'accepted', 'refused'],
      },
    },
    result: [
      { code: 200, content: 'OK' },
      { code: 404, content: 'PropositionChallenge not found' },
    ],
  },
];
