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
  const [registerUsername, setRegisterUsername] = useState('');
  const [registerPassword, setRegisterPassword] = useState('');
  const [registerPasswordRepeat, setRegisterPasswordRepeat] =
    useState('');
  const [registerEmail, setRegisterEmail] = useState('');
  const [registerDuring, setRegisterDuring] = useState(false);
  const [registerErrorMessage, setRegisterErrorMessage] =
    useState('');
  const [registerCallbackMessage, setRegisterCallbackMessage] =
    useState('');
  const [, setUserState] = useRecoilState(API.user.userAtom);
  const [, setDoneConnection] = useRecoilState(
    API.user.doneConnectionAtom,
  );

  /**
   * Fonction pour permettre à l'utilisateur de s'inscrire
   */
  function handleRegister() {
    if (registerPassword !== registerPasswordRepeat) {
      setRegisterErrorMessage(
        'Les deux mots de passes ne sont pas identiques',
      );
      return;
    }

    if (registerDuring) return;

    setRegisterDuring(true);
    setRegisterErrorMessage('');

    API.user
      .register({
        username: registerUsername,
        password: registerPassword,
        email: registerEmail,
      })
      .then((data) => {
        setRegisterDuring(false);
        setRegisterCallbackMessage('Maintenant, connectez vous!');
        setRegisterErrorMessage('');
      })
      .catch((err) => {
        setRegisterDuring(false);
        setRegisterErrorMessage("Nom d'utilisateur déjà utilisé");
      });
  }

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
      {!!registerCallbackMessage ? (
        <p style={{ color: 'green', fontWeight: 'bold' }}>
          {registerCallbackMessage}
        </p>
      ) : null}
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
      <Typography variant="h2">S'Inscrire</Typography>
      <TextField
        placeholder="Nom d'utilisateur"
        value={registerUsername}
        onChange={(e) => setRegisterUsername(e.target.value)}
      />
      <TextField
        placeholder="Mot de passe"
        value={registerPassword}
        onChange={(e) => setRegisterPassword(e.target.value)}
        type="password"
      />{' '}
      <TextField
        placeholder="Retapez le mot de passe"
        value={registerPasswordRepeat}
        onChange={(e) => setRegisterPasswordRepeat(e.target.value)}
        type="password"
      />
      <TextField
        placeholder="Votre email"
        value={registerEmail}
        onChange={(e) => setRegisterEmail(e.target.value)}
        type="email"
      />
      <br />
      <Button
        variant="contained"
        color="primary"
        disabled={
          !registerUsername ||
          !registerPassword ||
          !registerPasswordRepeat ||
          !registerEmail
        }
        onClick={handleRegister}
      >
        S'inscrire
      </Button>
      {!!registerErrorMessage ? (
        <p style={{ color: 'red', fontWeight: 'bold' }}>
          {registerErrorMessage}
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
