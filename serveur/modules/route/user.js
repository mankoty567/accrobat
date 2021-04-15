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
  {
    method: 'GET',
    url: '/api/user/:id/avatar',
    func: [m.user_ctrl.get_avatar],
    name: "Récupération de l'avatar d'un utilisateur",
    description:
      "Récupération de de l'avatar d'un utilisateur sous la forme d'un fichier tout basique",
  },
  {
    method: 'GET',
    url: '/api/user/check_username/:username',
    func: [m.user_ctrl.check_username],
    name: "Vérification de l'username",
    description:
      "Verifie si le nom d'utilisateur passé en paramètre est encore disponible",
    result: [{ code: 200, content: { valid: 'true/false' } }],
  },
  {
    method: 'GET',
    url: '/api/user/get_all_admin',
    func: [m.user_mdw.put_admin, m.user_ctrl.get_all_admin],
    name: 'Récupération des admins',
    description: 'Récupère tous les administrateurs',
    result: [{ code: 200, content: [{ id: 0, username: '' }] }],
  },
];
