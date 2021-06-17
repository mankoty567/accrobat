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
export default function InscriptionForm() {
  //Variable d'interface
  const history = useHistory();
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

  return (
    <>
      {!!registerCallbackMessage ? (
        <p style={{ color: 'green', fontWeight: 'bold' }}>
          {registerCallbackMessage}
        </p>
      ) : null}
      <Typography variant="h3" style={{ paddingTop: '1vh' }}>
        S'inscrire
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
            value={registerUsername}
            onChange={(e) => setRegisterUsername(e.target.value)}
            style={{ marginTop: '1vh' }}
          />
          <TextField
            placeholder="Mot de passe"
            value={registerPassword}
            onChange={(e) => setRegisterPassword(e.target.value)}
            type="password"
            style={{ marginTop: '1vh' }}
          />
          <TextField
            placeholder="Retapez le mot de passe"
            value={registerPasswordRepeat}
            onChange={(e) =>
              setRegisterPasswordRepeat(e.target.value)
            }
            type="password"
            style={{ marginTop: '1vh' }}
          />
          <TextField
            placeholder="Votre email"
            value={registerEmail}
            onChange={(e) => setRegisterEmail(e.target.value)}
            type="email"
            style={{ marginTop: '1vh' }}
          />
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
            style={{ marginTop: '1vh' }}
          >
            S'inscrire
          </Button>
        </div>
      </Grid>
      {!!registerErrorMessage ? (
        <p style={{ color: 'red', fontWeight: 'bold' }}>
          {registerErrorMessage}
        </p>
      ) : null}
    </>
  );
}
