import {
  List,
  Typography,
  ListItem,
  Button,
  TextField,
  Grid,
  Paper,
  Divider,
} from '@material-ui/core';
import React, { useEffect, useState } from 'react';
import { API } from '../../eventApi/api';
import EditIcon from '@material-ui/icons/Edit';
import CheckIcon from '@material-ui/icons/Check';
import PasswordPage from './PasswordPage';
import { useRecoilState } from 'recoil';

let ProfilePage = () => {
  //Variable d'interface
  const [edit, setEdit] = useState(false);
  const [userState, setUserState] = useRecoilState(API.user.userAtom);
  const [username, setUsername] = useState(userState.username);
  const [email, setEmail] = useState(userState.email);
  const [err, setErr] = useState('');
  const [statusMessage, setStatusMessage] = useState('');

  //Variable pour afficher l'interface
  const [mode, setMode] = useState('profile'); //'profile' | 'password'

  /**
   * Pour mettre en place l'édition de profile
   */
  const handleEdit = () => {
    setEdit(true);
  };

  /**
   * Lorsque l'utilisateur soumet les changement
   */
  const handleSubmit = () => {
    //Si les champs sont complétés
    if (username && email) {
      if (
        username === userState.username &&
        email === userState.email
      ) {
        setEdit(false);
        setStatusMessage('');
      } else {
        if (username !== userState.username) {
          //On vérifie que le nom d'utilisateur n'existe pas déjà
          API.user
            .checkUser(username)
            .then((res) => {
              if (res.valid) {
                //On édite enfin
                API.user.edit(username, email).then((res) => {
                  setErr('');
                  setUserState((current) =>
                    Object.assign(current, { username, email }),
                  );
                  setEdit(false);
                  setStatusMessage(
                    'Les modifications ont bien été prises en compte',
                  );
                });
              }
              //Il est déjà pris
              else {
                setErr("Le nom d'utilisateur n'est pas disponible !");
              }
            })
            .catch((err) => console.err(err));
        } else {
          console.log(2);
          API.user.edit(email).then(() => {
            setErr('');
            setEdit(false);
            setStatusMessage(
              'Les modifications ont bien été prises en compte',
            );
          });
        }
      }
    }
    //Un champ est vide
    else {
      setErr('Veillez renseigner tout les champs !');
    }
  };
  return (
    <div>
      {mode === 'profile' ? (
        <div
          style={{
            width: '35vw',
            display: 'block',
            marginLeft: 'auto',
            marginRight: 'auto',
            marginTop: '5vh',
          }}
        >
          <Paper>
            <Typography variant="h3">Page de profil</Typography>
            <Divider />

            <List>
              <ListItem>
                <List>
                  <ListItem>
                    <Typography variant="h6">
                      Nom d'utilisateur :
                    </Typography>
                  </ListItem>
                  <ListItem>
                    {edit ? (
                      <TextField
                        fullWidth
                        label="Nom d'utilisateur"
                        helperText="Modifiez votre nom d'utilisateur"
                        defaultValue={username}
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                      />
                    ) : (
                      <Typography>{username}</Typography>
                    )}
                  </ListItem>
                </List>
              </ListItem>
              <Divider />

              <ListItem>
                <List>
                  <ListItem>
                    <Typography variant="h6">Email :</Typography>
                  </ListItem>
                  <ListItem>
                    {edit ? (
                      <TextField
                        fullWidth
                        label="Nom d'utilisateur"
                        helperText="Modifiez votre nom d'utilisateur"
                        defaultValue={email}
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                      />
                    ) : (
                      <Typography>{email}</Typography>
                    )}
                  </ListItem>
                </List>
              </ListItem>
              <Divider />

              {edit ? null : (
                <ListItem>
                  <List>
                    <ListItem>
                      <Typography variant="h6">
                        Mot de passe :
                      </Typography>
                    </ListItem>
                    <ListItem>
                      <Button
                        fullWidth
                        onClick={() => setMode('password')}
                      >
                        Modifier mon mot de passe
                      </Button>
                    </ListItem>
                  </List>
                </ListItem>
              )}
            </List>
            <Typography variant="h6" style={{ color: '#18bc9c' }}>
              {statusMessage}
            </Typography>
            {edit ? (
              <>
                <Typography color="error">{err}</Typography>

                <Grid container space={1}>
                  <Grid item xs={6}>
                    <Button
                      fullWidth
                      startIcon={<CheckIcon />}
                      onClick={() => handleSubmit()}
                    >
                      Sauvegarder les changements
                    </Button>
                  </Grid>
                  <Grid item xs={6}>
                    <Button fullWidth onClick={() => setEdit(false)}>
                      Anuler les changements
                    </Button>
                  </Grid>
                </Grid>
              </>
            ) : (
              <>
                <Divider />
                <Grid container space={1}>
                  <Grid item xs={6}>
                    <Button
                      fullWidth
                      startIcon={<EditIcon />}
                      onClick={() => handleEdit()}
                    >
                      Modifier mon profil
                    </Button>
                  </Grid>
                  <Grid item xs={6}></Grid>
                </Grid>
              </>
            )}
          </Paper>
        </div>
      ) : (
        <PasswordPage
          setMode={setMode}
          callback={() => {
            setStatusMessage(
              'Les modifications ont bien été prises en compte',
            );
          }}
        />
      )}
    </div>
  );
};

export default ProfilePage;
