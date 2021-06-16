import React, { useState } from 'react';
import { TextField, Typography, Button } from '@material-ui/core';
import { API, host } from '../../eventApi/api';
import { useRecoilState } from 'recoil';
import { useHistory } from 'react-router-dom';

/**
 * Formulaire de connexion
 */
export default function LoginForm() {
  //Variable d'interface
  const history = useHistory();
  const [loginUsername, setLoginUsername] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginDuring, setLoginDuring] = useState(false);
  const [loginErrorMessage, setLoginErrorMessage] = useState('');
  useState('');
  const [, setUserState] = useRecoilState(API.user.userAtom);
  const [, setDoneConnection] = useRecoilState(
    API.user.doneConnectionAtom,
  );

  /**
   * Fonction permettant de se connecter
   */
  function handleLogin() {
    if (loginDuring) return;

    setLoginDuring(true);
    API.user
      .login({ username: loginUsername, password: loginPassword })
      .then((data) => {
        localStorage.setItem('token', data.jwt);
        setUserState(data);
        setDoneConnection(true);

        setLoginDuring(false);

        setTimeout(refreshJWT, API.user.JWT_VALIDITY);
        history.push('/home');
      })
      .catch((err) => {
        setLoginDuring(false);
        setLoginErrorMessage('Mauvais login ou mot de passe');
      });
  }

  /**
   * Fonction pour regénérer le JWT
   */
  function refreshJWT() {
    API.user
      .whoami()
      .then((data) => {
        localStorage.setItem('token', data.jwt);
        setUserState(data);

        setTimeout(refreshJWT, API.user.JWT_VALIDITY);
      })
      .catch((err) => {
        setDoneConnection(true);
        setUserState(undefined);

        localStorage.setItem('token', undefined);
      });
  }

  /**
   * Fonction pour utiliser les services de google
   */
  function handleGoogle() {
    window.location = host + '/api/google/connect';
  }

  return (
    <>
      <Typography variant="h2">Se Connecter</Typography>
      <TextField
        placeholder="Nom d'utilisateur"
        value={loginUsername}
        onChange={(e) => setLoginUsername(e.target.value)}
      />
      <TextField
        placeholder="Mot de passe"
        value={loginPassword}
        onChange={(e) => setLoginPassword(e.target.value)}
        type="password"
      />
      <br />
      <Button
        variant="contained"
        color="primary"
        disabled={!loginUsername || !loginPassword}
        onClick={handleLogin}
      >
        Se connecter
      </Button>
      {!!loginErrorMessage ? (
        <p style={{ color: 'red', fontWeight: 'bold' }}>
          {loginErrorMessage}
        </p>
      ) : null}
      <br />
      <br />
      <Button
        variant="contained"
        color="primary"
        onClick={handleGoogle}
      >
        Se connecter avec Google
      </Button>
    </>
  );
}
