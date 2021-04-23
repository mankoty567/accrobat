import { host } from './api';

import { checkStatus } from './api';

import { useRecoilState } from 'recoil';

import { useHistory } from 'react-router-dom';
import { atom } from 'recoil';
import { useEffect } from 'react';

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
    if (localStorage.getItem('jwt') !== undefined) {
      return fetch(`${host}/api/user/whoami`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('jwt')}`,
        },
      })
        .then(checkStatus)
        .then((res) => res.json());
    }
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

function CheckLogged({ children }) {
  const [userState] = useRecoilState(userAtom);
  const [doneConnectionState] = useRecoilState(doneConnectionAtom);
  const history = useHistory();

  useEffect(() => {
    if (doneConnectionState && userState === undefined) {
      history.push('/login');
    }
  }, [userState, duringConnectionState]);

  return !doneConnectionState || userState === undefined ? (
    <></>
  ) : (
    <>{children}</>
  );
}

export default {
  ...userApi,
  CheckLogged,
  doneConnectionAtom,
  userAtom,
};
