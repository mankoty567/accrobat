import { host, checkStatus } from './api';
import { atom } from 'recoil';

const JWT_VALIDITY = 2 * 60 * 60 * 1000;

const userAtom = atom({
  key: 'userState',
  default: undefined,
});

const doneConnectionAtom = atom({
  key: 'doneConnection',
  default: false,
});

const userApi = {
  whoami: () => {
    if (localStorage.getItem('token') !== undefined) {
      return fetch(`${host}/api/user/whoami`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      })
        .then(checkStatus)
        .then((res) => res.json());
    }
  },
  getDataFromJWT: (jwt) => {
    return fetch(`${host}/api/user/whoami`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${jwt}`,
      },
    })
      .then(checkStatus)
      .then((res) => res.json());
  },
  login: ({ username, password }) => {
    return fetch(`${host}/api/user/login`, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        username,
        password,
      }),
    })
      .then(checkStatus)
      .then((res) => res.json());
  },
  register: ({ username, password, email }) => {
    return fetch(`${host}/api/user/register`, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        username,
        password,
        email,
      }),
    })
      .then(checkStatus)
      .then((res) => res.text());
  },

  /**
   * Fonction permettant d'éditer le profil
   * @param {Object} body Le body de la requête
   * @param {String} [body.username] Nom d'utilisateur
   * @param {String} [body.email] Email de l'utilisateur
   * @param {any} [body.avatar] Avatar de l'utilisateur
   */
  edit: (body) => {
    return fetch(`${host}/api/user/edit`, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        Authorization:
          'Bearer ' + window.localStorage.getItem('token'),
      },
      body: JSON.stringify(body),
    })
      .then(checkStatus)
      .then((res) => res.json());
  },

  checkUser: (username) => {
    return fetch(`${host}/api/user/check_username/${username}`, {
      method: 'GET',
      headers: {
        Authorization:
          'Bearer ' + window.localStorage.getItem('token'),
      },
    })
      .then(checkStatus)
      .then((res) => res.json());
  },

  editPassword: (old_password, new_password, repeat_password) => {
    return fetch(`${host}/api/user/edit_password`, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        Authorization:
          'Bearer ' + window.localStorage.getItem('token'),
      },
      body: JSON.stringify({
        old_password,
        new_password,
        repeat_password,
      }),
    })
      .then(checkStatus)
      .then((res) => res.text());
  },

  getAvatar: (userId) => {
    return fetch(`${host}/api/user/${userId}/avatar`, {
      method: 'GET',
      headers: {
        Authorization:
          'Bearer ' + window.localStorage.getItem('token'),
      },
    })
      .then(checkStatus)
      .then((res) => res.json());
  },

  getUserWithPerms: () => {
    return fetch(`${host}/api/user/get_user_with_roles`, {
      method: 'GET',
      headers: {
        Authorization:
          'Bearer ' + window.localStorage.getItem('token'),
      },
    })
      .then(checkStatus)
      .then((res) => res.json());
  },

  editUserPerms: (id, permission) => {
    return fetch(`${host}/api/user/${id}/permission`, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        Authorization:
          'Bearer ' + window.localStorage.getItem('token'),
      },
      body: JSON.stringify({ permission }),
    })
      .then(checkStatus)
      .then((res) => res.text())
      .catch((err) => err.text());
  },
};

/* Code de la connection
function refreshJWT() {
  userApi
    .whoami()
    .then((data) => {
      localStorage.setItem('jwt', data.jwt);
      setUserState(data);

      setTimeout(refreshJWT, JWT_VALIDITY);
    })
    .catch((err) => {
      // Erreur
    });
}

userApi
  .login({username, password})
  .then((data) => {
    localStorage.setItem('jwt', data.jwt);
    setUserState(data);

    setTimeout(refreshJWT, JWT_VALIDITY);
  })
  .catch((err) => {
    // Erreur, mauvais username ou mot de passe
  });
*/

/*
 Code de déconnection

localStorage.setItem("jwt", undefined);
setUserState(undefined)
*/

export default {
  ...userApi,
  doneConnectionAtom,
  userAtom,
  JWT_VALIDITY,
};
