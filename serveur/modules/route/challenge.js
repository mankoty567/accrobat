const m = require('../index');

module.exports.meta = {
  title: 'Challenge',
};

module.exports.routes = [
  {
    method: 'GET',
    url: '/api/challenge',
    func: [m.user_mdw.put_user, m.challenge_ctrl.get_all_challenge],
    body: undefined,
    description: undefined,
    result: [
      {
        code: 200,
        content: {
          id: 0,
          title: 'string',
          description: 'string',
          echelle: 0,
        },
      },
    ],
  },
  {
    method: 'GET',
    url: '/api/challenge/admin',
    func: [m.user_mdw.put_admin, m.challenge_ctrl.get_all_challenge_admin],
  },
  {
    method: 'GET',
    url: '/api/challenge/:id',
    func: [m.user_mdw.put_user, m.challenge_ctrl.get_challenge_id],
  },
  {
    method: 'GET',
    url: '/api/challenge/:id/image',
    func: [m.challenge_ctrl.get_image],
  },
  {
    method: 'GET',
    url: '/api/challenge/:id/avatar',
    func: [m.challenge_ctrl.get_image_avatar],
  },
  {
    method: 'GET',
    url: '/api/challenge/:id/validity',
    func: [m.user_mdw.put_admin, m.challenge_ctrl.verif_validity],
  },
  {
    method: 'POST',
    url: '/api/challenge',
    func: [m.user_mdw.put_admin, m.challenge_ctrl.post_challenge],
  },
  {
    method: 'DELETE',
    url: '/api/challenge/:id',
    func: [m.user_mdw.put_admin, m.challenge_ctrl.delete_challenge],
  },
  {
    method: 'POST',
    url: '/api/challenge/:id',
    func: [m.user_mdw.put_admin, m.challenge_ctrl.update_challenge],
  },
  {
    method: 'POST',
    url: '/api/challenge/:id/clone',
    func: [m.user_mdw.put_admin, m.challenge_ctrl.clone_challenge],
  },
  {
    method: 'POST',
    url: '/api/challenge/:id/publish',
    func: [m.user_mdw.put_admin, m.challenge_ctrl.publish_challenge],
  },
];
