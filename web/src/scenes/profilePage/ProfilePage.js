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
import React, { useState } from 'react';
import { API } from '../../eventApi/api';
import EditIcon from '@material-ui/icons/Edit';
import CheckIcon from '@material-ui/icons/Check';
import PasswordPage from './PasswordPage';
import { useRecoilState } from 'recoil';
import ImageUploader from '../../components/ImageUploader';

/**
 * Page de profile
 */
let ProfilePage = () => {
  //Variable d'interface
  const [edit, setEdit] = useState(false);
  const [userState, setUserState] = useRecoilState(API.user.userAtom);
  const [username, setUsername] = useState(userState.username);
  const [email, setEmail] = useState(userState.email);
  const [err, setErr] = useState('');
  const [statusMessage, setStatusMessage] = useState('');
  const [img_avatar, setImg_avatar] = useState(
    `https://api.acrobat.bigaston.dev/api/user/${userState.id}/avatar`,
  );
  const [imageError, setImageError] = useState('');

  //Variable pour afficher l'interface
  const [mode, setMode] = useState('profile'); //'profile' | 'password'

  /**
   * Pour mettre en place l'édition de profile
   */
  const handleEdit = () => {
    setEdit(true);
    setImg_avatar(
      `https://api.acrobat.bigaston.dev/api/user/${userState.id}/avatar`,
    );
  };

  /**
   * Lorsque l'utilisateur soumet les changement
   */
  const handleSubmit = async () => {
    //Si les champs sont complétés
    if (username && email) {
      //Dans le cas où rien n'a changé
      if (
        username === userState.username &&
        email === userState.email &&
        img_avatar[0] === 'h'
      ) {
        setEdit(false);
        setStatusMessage('');
      }
      //Sinon, on watch les changements
      else {
        let body = {};

        //Si l'username a changé
        if (username !== userState.username) {
          await API.user
            .checkUser(username)
            .then((res) => {
              if (res.valid) {
                body = { ...body, username: username };
              }
            })
            .catch((err) => console.err(err));
        }

        //On check si l'email a changé
        if (email !== userState.email) {
          body = { ...body, email: email };
        } //L'email n'a pas changé

        //Méthode assez sale pour détecter si l'image est en format base64 ou non
        //On check si l'image a changé
        if (img_avatar.charAt(0) !== 'h') {
          body = { ...body, avatar: img_avatar };
        }

        API.user.edit(body).then((res) => {
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
            width: '50vw',
            display: 'block',
            marginLeft: 'auto',
            marginRight: 'auto',
          }}
        >
          <Typography variant="h3" style={{ paddingTop: '1vh' }}>
            Page de profil
          </Typography>
          <Grid container space={1}>
            <Grid item xs={8}>
              <List>
                <ListItem>
                  <List>
                    <ListItem>
                      {edit ? (
                        <TextField
                          fullWidth
                          label="Nom d'utilisateur"
                          helperText="Modifiez votre nom d'utilisateur"
                          value={username}
                          onChange={(e) =>
                            setUsername(e.target.value)
                          }
                        />
                      ) : (
                        <ListItem
                          style={{
                            display: 'flex',
                            flexDirection: 'column',
                          }}
                        >
                          <Typography variant="h6">
                            Nom d'utilisateur
                          </Typography>
                          <Typography>
                            {userState.username}
                          </Typography>
                        </ListItem>
                      )}
                    </ListItem>
                  </List>
                </ListItem>
                <ListItem>
                  <List>
                    <ListItem>
                      {edit ? (
                        <TextField
                          fullWidth
                          label="Nom d'utilisateur"
                          helperText="Modifiez votre nom d'utilisateur"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                        />
                      ) : (
                        <ListItem
                          style={{
                            display: 'flex',
                            flexDirection: 'column',
                          }}
                        >
                          <Typography variant="h6">Email</Typography>
                          <Typography>{userState.email}</Typography>
                        </ListItem>
                      )}
                    </ListItem>
                  </List>
                </ListItem>
              </List>
            </Grid>
            <Grid
              item
              xs={4}
              style={{ display: 'flex', flexDirection: 'column' }}
            >
              {edit ? (
                <>
                  <ImageUploader
                    maxSize={[2000, 2000]}
                    setErrMessage={(err) => setImageError(err)}
                    callback={(image) => {
                      setImg_avatar(image);
                    }}
                  />
                  <Typography color="error">{imageError}</Typography>
                </>
              ) : null}
              <Avatar
                style={{
                  height: '20vh',
                  width: '10vw',
                  margin: 'auto',
                }}
                src={img_avatar}
              />
            </Grid>

            {edit ? null : (
              <ListItem>
                <Grid container justify="center">
                  <Button onClick={() => setMode('password')}>
                    Modifier mon mot de passe
                  </Button>
                </Grid>
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
                  <Button
                    fullWidth
                    onClick={() => {
                      setEdit(false),
                        setImg_avatar(
                          `https://api.acrobat.bigaston.dev/api/user/${userState.id}/avatar`,
                        );
                      setUsername(userState.username);
                      setEmail(userState.email);
                    }}
                  >
                    Anuler les changements
                  </Button>
                </Grid>
              </Grid>
            </>
          ) : (
            <>
              <Grid container justify="center">
                <Button
                  startIcon={<EditIcon />}
                  onClick={() => handleEdit()}
                >
                  Modifier mon profil
                </Button>
              </Grid>
            </>
          )}
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
