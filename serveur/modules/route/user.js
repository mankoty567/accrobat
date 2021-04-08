/* eslint-disable quotes */

const m = require('../index');

module.exports.meta = {
  title: 'User',
};

module.exports.routes = [
  {
    method: 'POST',
    url: '/api/user/register',
    func: [m.user_ctrl.create_user],
    name: "Inscription d'un utilisateur",
    description: 'Crée un nouvel utilisateur à partir des paramètres envoyés',
    body: {
      username: 'string',
      password: 'string',
      email: 'string',
      avatar: {
        type: 'data_url',
        required: false,
      },
    },
    result: [
      { code: 200, content: 'OK' },
      { code: 400, content: 'Username is already taken' },
    ],
  },
  {
    method: 'POST',
    url: '/api/user/login',
    func: [m.user_ctrl.login],
    name: 'Connection',
    description: "Demande la connection d'un utilisateur",
    body: {
      username: 'string',
      password: 'string',
    },
    result: [
      {
        code: 200,
        content: {
          id: 0,
          username: '',
          email: '',
          permission: 0,
          level: 0,
          xp: 0,
          jwt: 'jwt',
        },
      },
      { code: 403, content: 'Bad username or password' },
    ],
  },
  {
    method: 'GET',
    url: '/api/user/whoami',
    func: [m.user_ctrl.whoami],
    name: 'Qui suis-je?',
    description:
      "Vérifie si le JWT est encore valide, si oui le rafraichie et renvoit les données de l'utilisateur, sinon 403",
    result: [
      {
        code: 200,
        content: {
          id: 0,
          username: '',
          email: '',
          permission: 0,
          level: 0,
          xp: 0,
          jwt: 'jwt',
        },
      },
      { code: 400, content: 'Bad request: Token invalide' },
    ],
  },
  {
    method: 'POST',
    url: '/api/user/edit',
    func: [m.user_ctrl.edit_user],
    name: "Edition d'utilisateurs",
    description:
      "Modifie les paramètres d'un utilisateur (son image de profil, ses paramètres...)",
    body: {
      username: {
        type: 'string',
        required: false,
      },
      email: {
        type: 'string',
        required: false,
      },
      avatar: {
        type: 'data_url',
        required: false,
      },
    },
    result: [
      {
        code: 200,
        content: {
          id: 0,
          username: '',
          email: '',
          permission: 0,
          level: 0,
          xp: 0,
        },
      },
      { code: 400, content: 'Bad Request: Username already exist' },
    ],
  },
];
