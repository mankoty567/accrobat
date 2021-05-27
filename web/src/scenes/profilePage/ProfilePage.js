import {
  List,
  Typography,
  ListItem,
  Button,
  TextField,
  Grid,
  Paper,
  Divider,
  Avatar,
} from '@material-ui/core';
import React, { useEffect, useState } from 'react';
import { API } from '../../eventApi/api';
import EditIcon from '@material-ui/icons/Edit';
import CheckIcon from '@material-ui/icons/Check';
import PasswordPage from './PasswordPage';
import { useRecoilState } from 'recoil';
import ImageUploader from '../../components/ImageUploader';

let ProfilePage = () => {
  //Variable d'interface
  const [edit, setEdit] = useState(false);
  const [userState, setUserState] = useRecoilState(API.user.userAtom);
  const [username, setUsername] = useState(userState.username);
  const [email, setEmail] = useState(userState.email);
  const [err, setErr] = useState('');
  const [statusMessage, setStatusMessage] = useState('');
  const [img_avatar, setImg_avatar] = useState(null);

  //Variable pour afficher l'interface
  const [mode, setMode] = useState('profile'); //'profile' | 'password'

  useState(
    () =>
      API.user
        .getAvatar(userState.id)
        .then((image) => setImg_avatar(image))
        .catch(() => setImg_avatar(null)),
    [],
  );

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
                  setUserState((current) => ({
                    ...current,
                    username: username,
                    email: email,
                  }));
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
            <Grid container space={1}>
              <Grid item xs={5}>
                <Paper>
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
                              onChange={(e) =>
                                setUsername(e.target.value)
                              }
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
                          <Typography variant="h6">
                            Email :
                          </Typography>
                        </ListItem>
                        <ListItem>
                          {edit ? (
                            <TextField
                              fullWidth
                              label="Nom d'utilisateur"
                              helperText="Modifiez votre nom d'utilisateur"
                              defaultValue={email}
                              value={email}
                              onChange={(e) =>
                                setEmail(e.target.value)
                              }
                            />
                          ) : (
                            <Typography>{email}</Typography>
                          )}
                        </ListItem>
                      </List>
                    </ListItem>
                  </List>
                </Paper>
              </Grid>

              <Grid item xs={7}>
                {edit ? (
                  <ImageUploader maxSize={[2, 2]} />
                ) : (
                  <Avatar
                    src={`https://api.acrobat.bigaston.dev/api/user/${userState.id}/avatar`}
                  />
                )}
              </Grid>

              {edit ? null : (
                <ListItem>
                  <Typography variant="h6">Mot de passe :</Typography>
                  <Button onClick={() => setMode('password')}>
                    Modifier mon mot de passe
                  </Button>
                </ListItem>
              )}
            </Grid>

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
