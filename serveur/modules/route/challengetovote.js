/* eslint-disable quotes */

const m = require('../index');

module.exports.meta = {
  title: 'ChallengeToVote',
};

module.exports.routes = [
  {
    method: 'POST',
    url: '/api/challengetovote',
    func: [m.user_mdw.put_admin, m.challengetovote_ctrl.add_tovote],
    name: 'Ajoute un challenge à voter',
    body: {
      description: 'string',
    },
    result: [{ code: 200, content: 'OK' }],
  },
  {
    method: 'POST',
    url: '/api/challengetovote/:id',
    func: [m.user_mdw.put_admin, m.challengetovote_ctrl.update_tovote],
    name: 'Met à jour un challenge à voter',
    body: {
      status: {
        type: 'string',
        value: ['open', 'close'],
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
    func: [m.user_mdw.put_user, m.challengetovote_ctrl.vote],
    name: 'Vote sur un ChallengeToVote',
    body: {
      vote: 'number',
    },
    result: [
      { code: 200, content: 'OK' },
      { code: 404, content: 'ChallengeToVote not found' },
    ],
  },
];
