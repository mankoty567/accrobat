import { host, checkStatus } from './eventApi';

import { useRecoilState } from 'recoil';

import { useHistory } from 'react-router-dom';
import { atom } from 'recoil';
import { useEffect } from 'react';

export const userAtom = atom({
  key: 'userState',
  default: undefined,
});

export const doneConnectionAtom = atom({
  key: 'doneConnection',
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
    fetch(`${host}/api/user/login`, {
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
      .then(res.json());
  },
  register: ({ username, password, email }) => {
    fetch(`${host}/api/user/register`, {
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

export function CheckLogged({ children }) {
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
