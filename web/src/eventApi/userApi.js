import { host, checkStatus } from './eventApi';

import { atom } from 'recoil';

export const userAtom = atom({
  key: 'userState',
  default: undefined,
});

export const duringConnectionAtom = atom({
  key: 'duringConnection',
  default: false,
});

export const userApi = {
  whoami: () => {
    if (localStorage.getItem('jwt') !== undefined) {
      fetch(`${host}/api/user/whoami`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('jwt')}`,
        },
      })
        .then(checkStatus)
        .then(res.json());
    }
  },
  login: ({ username, password }) => {
    fetch(`${host}/api/user/whoami`, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('jwt')}`,
      },
      body: JSON.stringify({
        username,
        password,
      }),
    })
      .then(checkStatus)
      .then(res.json());
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
      setDuringConnection(true);
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
