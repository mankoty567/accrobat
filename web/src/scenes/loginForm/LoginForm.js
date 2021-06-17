import React, { useState } from 'react';
import {
  TextField,
  Typography,
  Button,
  Grid,
} from '@material-ui/core';
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
      <Typography variant="h3" style={{ paddingTop: '1vh' }}>
        Se Connecter
      </Typography>
      <Grid container justify="center">
        <div
          style={{
            width: '20%',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <TextField
            placeholder="Nom d'utilisateur"
            value={loginUsername}
            onChange={(e) => setLoginUsername(e.target.value)}
            style={{ marginTop: '1vh' }}
          />
          <TextField
            placeholder="Mot de passe"
            value={loginPassword}
            onChange={(e) => setLoginPassword(e.target.value)}
            type="password"
            style={{ marginTop: '1vh' }}
          />
          <Button
            variant="contained"
            color="primary"
            disabled={!loginUsername || !loginPassword}
            onClick={handleLogin}
            style={{ marginTop: '1vh' }}
          >
            Se connecter
          </Button>
          <Button
            variant="contained"
            color="primary"
            onClick={handleGoogle}
            style={{ marginTop: '1vh' }}
          >
            Se connecter avec Google
          </Button>
        </div>
      </Grid>
      {!!loginErrorMessage ? (
        <p style={{ color: 'red', fontWeight: 'bold' }}>
          {loginErrorMessage}
        </p>
      ) : null}
      <br />
      <br />
    </>
  );
}
