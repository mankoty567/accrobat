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
  InputAdornment,
} from '@material-ui/core';
import EditIcon from '@material-ui/icons/Edit';
import LayersIcon from '@material-ui/icons/Layers';
import DeleteOutlineIcon from '@material-ui/icons/DeleteOutline';
import React, { useState, useRef } from 'react';
import ImageUploader from '../../components/ImageUploader';
import API from '../../eventApi/eventApi';

let FormChallenge = ({ callback }) => {
  //Ajouter la prise en charge de l'échelle et de l'id
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [img_fond, setImg_fond] = useState(null);
  const [scale, setScale] = useState('');
  const [img_avatar, setImg_avatar] = useState(null);
  const [errTitle, setErrTitle] = useState(false);
  const [errDesc, setErrDesc] = useState(false);
  const [errImage, setErrImage] = useState(false);
  const [errScale, setErrScale] = useState(false);

  const setError = (value, setValue) => {
    if (value.length === 0) {
      setValue(true);
    } else {
      setValue(false);
    }
  };

  const handleSubmit = () => {
    if (!errTitle || !errDesc || !errImage || !errScale) {
      callback(title, description, img_fond, scale, img_avatar);
    } else {
      //Code redondant ... mais vérification
      if (!title) {
        setErrTitle(true);
      } else {
        setErrTitle(false);
      }

      if (!description) {
        setErrDesc(true);
      } else {
        setErrDesc(false);
      }

      if (!img_fond) {
        setErrImage(true);
      } else {
        setErrImage(false);
      }

      if (!scale) {
        setErrScale(true);
      } else {
        setErrScale(false);
      }
    }
  };

  return (
    <List>
      <ListItem>
        <FormControl error={errTitle}>
          <InputLabel htmlFor="title">Titre* :</InputLabel>
          <Input
            required
            onChange={(e) => setTitle(e.target.value)}
            onBlur={(e) => setError(e.target.value, setErrTitle)}
            id="title"
          ></Input>
          <FormHelperText id="title">
            Le titre de votre challenge
          </FormHelperText>
        </FormControl>
      </ListItem>
      <ListItem>
        <FormControl style={{ width: '100%' }} error={errDesc}>
          <InputLabel htmlFor="desc">Description* :</InputLabel>
          <Input
            required
            multiline
            onChange={(e) => setDescription(e.target.value)}
            onBlur={(e) => setError(e.target.value, setErrDesc)}
            id="desc"
          ></Input>
          <FormHelperText id="desc">
            Ce qui décrirait votre challenge
          </FormHelperText>
        </FormControl>
      </ListItem>

      <ListItem>
        <FormControl
          error={errImage}
          onBlur={(e) => setError(e.target.value, setErrImage)}
        >
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
        <FormControl error={errScale}>
          <InputLabel htmlFor="scale">Echelle* :</InputLabel>
          <Input
            required
            onChange={(e) => setScale(e.target.value)}
            onBlur={(e) => setError(e.target.value, setErrScale)}
            id="scale"
            endAdornment={
              <InputAdornment position="start">m</InputAdornment>
            }
          ></Input>
          <FormHelperText id="desc">
            Combien de mètres en largeur ferait la carte que vous avez
            donné ?
          </FormHelperText>
        </FormControl>
      </ListItem>
      <ListItem>
        <FormControl>
          <Typography>Icone :</Typography>
          <ImageUploader
            callback={(image) => {
              setImg_avatar(image);
              console.log(image);
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
