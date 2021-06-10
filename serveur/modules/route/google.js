/* eslint-disable quotes */

const m = require('../index');

module.exports.meta = {
  title: 'Google',
};

module.exports.routes = [
  {
    method: 'GET',
    url: '/api/google/connect',
    func: [m.google_ctrl.initialize_google],
    name: 'Connection Google',
    description: 'Initialise la connection/création de compte avec Google',
    result: [{ code: 203, content: 'Redirection vers la page de Google' }],
  },
  {
    method: 'GET',
    url: '/api/google/redirect',
    func: [m.google_ctrl.redirect_google],
    name: 'Redirection Google',
    description:
      'A ne pas utiliser tel quel, cette route est la redirection depuis la connection',
    result: [
      {
        code: 203,
        content:
          'Redirection sur le front avec dans le hash un JWT à échanger avec la route Whoami',
      },
    ],
  },
];
