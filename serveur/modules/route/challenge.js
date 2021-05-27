/* eslint-disable quotes */

const m = require('../index');

module.exports.meta = {
  title: 'Challenge',
};

module.exports.routes = [
  {
    method: 'GET',
    url: '/api/challenge',
    func: [m.user_mdw.put_user, m.challenge_ctrl.get_all_challenge],
    name: 'Récupération de tous les challenges publiés',
    description:
      'Récupération de tous les challenges accessibles à un utilisateur',
    query: [
      {
        param: 'include=point',
        desc: 'Renvoit le challenge et ses points de passages',
      },
      {
        param: 'include=pointsegment',
        desc:
          'Renvoit le challenge, ses points de passages et les segments associés',
      },
      {
        param: 'include=pointsegmentobstacle',
        desc:
          'Renvoit le challenge, ses points de passages, les segments et les obstacles associés',
      },
    ],
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
    name: 'Récupération de tous les challenges',
    description:
      'Récupération de tous les challenges (accessible uniquement à un administrateur)',
    result: [
      {
        code: 200,
        content: {
          id: 0,
          title: 'string',
          description: 'string',
          echelle: 0,
          isAdmin: 'true/false',
          isAuthor: 'true/false',
        },
      },
    ],
  },
  {
    method: 'GET',
    url: '/api/challenge/:id',
    func: [m.user_mdw.put_user, m.challenge_ctrl.get_challenge_id],
    query: [
      {
        param: 'include=point',
        desc: 'Renvoit le challenge et ses points de passages',
      },
      {
        param: 'include=pointsegment',
        desc:
          'Renvoit le challenge, ses points de passages et les segments associés',
      },
      {
        param: 'include=pointsegmentobstacle',
        desc:
          'Renvoit le challenge, ses points de passages, les segments et les obstacles associés',
      },
    ],
    name: "Récupération d'un challenge",
    description:
      "Récupération des données d'un challenge en fonction de son ID",
    result: [
      {
        code: 200,
        content: {
          id: 0,
          title: '',
          description: '',
          echelle: 0,
          createdAt: 'date',
          updatedAt: 'date',
        },
      },
      {
        code: 404,
        content: 'Not found',
      },
    ],
  },
  {
    method: 'GET',
    url: '/api/challenge/:id/image',
    func: [m.challenge_ctrl.get_image],
    name: "Récupération de l'image",
    description:
      "Récupération de l'image associée au challenge comme un fichier classique",
    result: [
      {
        code: 200,
        content: 'Image classique',
      },
      {
        code: 404,
        content: 'Not found',
      },
    ],
  },
  {
    method: 'GET',
    url: '/api/challenge/:id/avatar',
    func: [m.challenge_ctrl.get_image_avatar],
    name: "Récupération de l'avatar",
    description: "Récupération de l'avatar associée au challenge",
    result: [
      {
        code: 200,
        content: 'Image classique',
      },
      {
        code: 404,
        content: 'Not found',
      },
    ],
  },
  {
    method: 'GET',
    url: '/api/challenge/:id/validity',
    func: [
      m.user_mdw.put_admin,
      m.challenge_mdw.check_is_admin,
      m.challenge_ctrl.verif_validity,
    ],
    name: 'Vérification de la validité',
    description:
      "Vérifie la validitée d'un challenge. Le tableau error contient une liste d'erreurs",
    result: [
      {
        code: 200,
        content: {
          valid: 'false/true',
          error: [],
        },
      },
    ],
  },
  {
    method: 'POST',
    url: '/api/challenge',
    func: [m.user_mdw.put_admin, m.challenge_ctrl.post_challenge],
    body: {
      title: 'string',
      description: 'string',
      echelle: 'number',
      img_fond: 'data_url',
      img_avatar: {
        type: 'data_url',
        required: false,
      },
      frontId: {
        type: 'number',
        required: false,
      },
    },
    name: 'Création de challenge',
    description:
      'Crée un nouveau challenge. frontId est renvoyé de manière transparente au client',
    result: [
      {
        code: 200,
        content: {
          id: 0,
          published: false,
          title: '',
          description: '',
          echelle: 0,
          fontId: 0,
          updatedAt: 'date',
          createdAt: 'date',
        },
      },
      {
        code: 400,
        content: 'Bad request',
      },
    ],
  },
  {
    method: 'DELETE',
    url: '/api/challenge/:id',
    func: [
      m.user_mdw.put_admin,
      m.challenge_mdw.check_is_author,
      m.challenge_ctrl.delete_challenge,
    ],
    name: "Suppression d'un challenge",
    description: 'Supprime le challenge :id',
    result: [
      {
        code: 200,
        content: 'OK',
      },
      { code: 400, content: 'Error during delete' },
      { code: 404, content: 'Not found' },
    ],
  },
  {
    method: 'POST',
    url: '/api/challenge/:id',
    func: [
      m.user_mdw.put_admin,
      m.challenge_mdw.check_is_admin,
      m.challenge_ctrl.update_challenge,
    ],
    body: {
      title: { type: 'string', required: false },
      description: { type: 'string', required: false },
      echelle: { type: 'number', required: false },
      img_fond: { type: 'data_url', required: false },
      img_avatar: {
        type: 'data_url',
        required: false,
      },
    },
    name: "Modification d'un challenge",
    description: 'Modifie le challenge :id',
    result: [
      {
        code: 200,
        content: {
          id: 0,
          published: false,
          title: '',
          description: '',
          echelle: 0,
          fontId: 0,
          updatedAt: 'date',
          createdAt: 'date',
        },
      },
      {
        code: 400,
        content: 'Bad request',
      },
      {
        code: 404,
        content: 'Challenge not found',
      },
    ],
  },
  {
    method: 'POST',
    url: '/api/challenge/:id/clone',
    func: [
      m.user_mdw.put_admin,
      m.challenge_mdw.check_is_admin,
      m.challenge_ctrl.clone_challenge,
    ],
    name: "Dupplication d'un challenge",
    description: 'Clone un challenge, avec tout ses attributs et descendants',
    result: [
      {
        code: 200,
        content: {
          id: 0,
          published: false,
          title: '',
          description: '',
          echelle: 0,
          fontId: 0,
          updatedAt: 'date',
          createdAt: 'date',
        },
      },
      { code: 400, content: 'Something went wrong' },
    ],
  },
  {
    method: 'POST',
    url: '/api/challenge/:id/publish',
    func: [
      m.user_mdw.put_admin,
      m.challenge_mdw.check_is_admin,
      m.challenge_ctrl.publish_challenge,
    ],
    name: "Publication d'un challenge",
    description:
      "Publie un challenge. Attention le challenge n'est plus modifiable par la suite",
    result: [
      {
        code: 200,
        content: {
          id: 0,
          published: false,
          title: '',
          description: '',
          echelle: 0,
          fontId: 0,
          updatedAt: 'date',
          createdAt: 'date',
        },
      },
      {
        code: 400,
        content: 'Challenge is not valid',
      },
      {
        code: 404,
        content: 'Challenge not found',
      },
    ],
  },
  {
    method: 'POST',
    url: '/api/challenge/:id/add_admin',
    func: [
      m.user_mdw.put_admin,
      m.challenge_mdw.check_is_author,

      m.challenge_ctrl.add_challenge_admin,
    ],
    name: 'Ajouter un admin à un challenge',
    description:
      "Si on est l'auteur d'un challenge, on peu ajouter d'autres utilisateurs comme administrateurs de celui ci",
    body: {
      user_id: 'number',
    },
    retult: [
      { code: 200, content: 'OK' },
      { code: 400, content: 'Bad Request: User not exist' },
    ],
  },
  {
    method: 'GET',
    url: '/api/challenge/:id/records',
    func: [m.challenge_ctrl.get_records],
    name: 'Récupération des records du challenge',
    description: 'Récupère les meilleurs temps de completion des challenges',
    query: [
      {
        param: 'nb=[nombre]',
        desc: 'Renvoit les [nombre] premier records, defaut 5, max 20',
      },
    ],
    result: [
      {
        code: 200,
        content: [
          {
            id: 0,
            duration: 0,
            durationStr: "0j 00:00'00",
            startDate: 'date',
            endDate: 'date',
            user: {
              username: '',
              id: 0,
            },
          },
        ],
      },
      { code: 400, content: 'Challenge not found' },
    ],
  },
];
