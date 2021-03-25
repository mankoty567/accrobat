import {
  FormControl,
  InputLabel,
  FormHelperText,
  Input,
  List,
  ListItem,
  Button,
  Avatar,
  CardMedia,
  Typography,
} from '@material-ui/core';
import React, { useState, useRef } from 'react';
import ImageUploader from '../../components/ImageUploader';

let FormChallenge = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [img_fond, setImg_fond] = useState(null);
  const [img_avatar, setImg_avatar] = useState(null);
  const [err, setErr] = useState([false, false, false]);

  const setError = (value, index) => {
    console.log(err);
    if (!value) {
      err[parseInt(index)] = true;
      setErr(err);
    } else {
      err[parseInt(index)] = false;
      setErr(err);
    }
  };

  const handleSubmit = () => {
    if (!title || !description || !img_fond) {
    }
  };

  return (
    <List>
      <ListItem>
        <FormControl style={{ width: '100%' }} error={err[0]}>
          <InputLabel htmlFor="title">Titre* :</InputLabel>
          <Input
            required
            onChange={(e) => setTitle(e.target.value)}
            onBlur={(e) => setError(e.target.value, 0)}
            id="title"
          ></Input>
          <FormHelperText id="title">
            Le titre de votre challenge
          </FormHelperText>
        </FormControl>
      </ListItem>
      <ListItem>
        <FormControl style={{ width: '100%' }} error={err[1]}>
          <InputLabel htmlFor="desc">Description* :</InputLabel>
          <Input
            required
            multiline
            onChange={(e) => setDescription(e.target.value)}
            onBlur={(e) => setError(e.target.value, 1)}
            id="desc"
          ></Input>
          <FormHelperText id="desc">
            Ce qui décrirait votre challenge
          </FormHelperText>
        </FormControl>
      </ListItem>

      <ListItem>
        <FormControl error={err[2]}>
          <Typography>Carte de fond* :</Typography>

          <ImageUploader
            callback={(image) => setImg_fond(image)}
          ></ImageUploader>
          <FormHelperText>
            La carte sur laquelle vous souhaitez travailler
          </FormHelperText>
        </FormControl>
        <CardMedia>
          <img src={img_fond} height="100" width="100" />
        </CardMedia>
      </ListItem>
      <ListItem>
        <FormControl>
          <Typography>Icone :</Typography>
          <ImageUploader
            callback={(image) => {
              setImg_avatar(image);
            }}
          ></ImageUploader>
          <FormHelperText></FormHelperText>
        </FormControl>

        <Avatar src={img_avatar}></Avatar>
      </ListItem>
      <Button onClick={() => handleSubmit()} align="center" fullWidth>
        Créer le challenge
      </Button>
    </List>
  );
};

export default FormChallenge;
