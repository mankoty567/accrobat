import {
  List,
  Typography,
  ListItem,
  Button,
  FormControl,
  InputLabel,
  TextField,
} from '@material-ui/core';
import React, { useEffect, useState } from 'react';
import { API } from '../../eventApi/api';
import EditIcon from '@material-ui/icons/Edit';
import CheckIcon from '@material-ui/icons/Check';

let ProfilePage = () => {
  const [edit, setEdit] = useState(false);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [err, setErr] = useState('');

  useEffect(
    () =>
      API.user.whoami().then((res) => {
        setUsername(res.username);
        setEmail(res.email);
      }),
    [],
  );

  const handleEdit = () => {
    setEdit(true);
  };

  const handleSubmit = () => {
    //Si les champs sont complétés
    console.log(1);
    if (username && email) {
      console.log(2);

      //On vérifie que le nom d'utilisateur n'existe pas déjà
      API.user.checkUser(username).then((res) => {
        console.log(3); // ==> Cette étape n'est pas atteinte

        if (res.valid) {
          //On édite enfin
          API.user.edit(username, email).then((res) => {
            console.log(res);
            setErr('');
            setEdit(false);
          });
        }
        //Il est déjà pris
        else {
          setErr("Le nom d'utilisateur n'est pas disponible !");
        }
      });
    }
    //Un champ est vide
    else {
      setErr('Veillez renseigner tout les champs !');
    }
  };
  return (
    <>
      <Typography variant="h3">Page de profil</Typography>
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
        <ListItem>
          <List>
            <ListItem>
              <Typography variant="h6">Email :</Typography>
            </ListItem>
            <ListItem>
              {edit ? (
                <TextField
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
        <ListItem></ListItem>
      </List>
      {edit ? (
        <>
          <Typography color="error">{err}</Typography>
          <Button
            startIcon={<CheckIcon />}
            onClick={() => handleSubmit()}
          >
            Sauvegarder les changements
          </Button>
        </>
      ) : (
        <Button startIcon={<EditIcon />} onClick={() => handleEdit()}>
          Modifier mon profil
        </Button>
      )}
    </>
  );
};

export default ProfilePage;
