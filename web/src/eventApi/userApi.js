import { host } from './api';

import { checkStatus } from './api';

import { useRecoilState } from 'recoil';

import { useHistory } from 'react-router-dom';
import { atom } from 'recoil';
import { useEffect } from 'react';

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
   * @param {String} username Nom d'utilisateur
   * @param {String} email Email de l'utilisateur
   */
  edit: (username, email) => {
    return fetch(`${host}/api/user/edit`, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        Authorization:
          'Bearer ' + window.localStorage.getItem('token'),
      },
      body: JSON.stringify({
        username,
        email,
      }),
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
