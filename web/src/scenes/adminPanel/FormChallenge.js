import {
  FormControl,
  InputLabel,
  FormHelperText,
  Input,
  Grid,
  Button,
  Avatar,
  CardMedia,
  Typography,
  InputAdornment,
} from '@material-ui/core';
import React, { useState } from 'react';
import ImageUploader from '../../components/ImageUploader';
import MarkdownEditor from '../../components/MarkdownEditor';

/**
 * Formulaire pour créer un challenge
 * @param {Function} callback Passage d'une fonction au composant parent
 */
let FormChallenge = ({ callback, handleCancel }) => {
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

  /**
   * Permet de mettre l'interface dans l'état d'erreur ou non
   * @param {any} value La valeur du state
   * @param {Function} setValue La fonction de modification de l'élément non mutable
   */
  const setError = (value, setValue) => {
    if (value.length === 0) {
      setValue(true);
    } else {
      setValue(false);
    }
  };

  /**
   * Fonction pour créer un challenge
   */
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
    <Grid
      container
      justify="center"
      // spacing={5}
      style={{
        marginBottom: '1vh',
      }}
    >
      <Grid
        item
        style={{
          display: 'flex',
          flexDirection: 'column',
          paddingRight: '3vh',
        }}
      >
        <FormControl
          error={errTitle}
          style={{
            marginBottom: '1vh',
          }}
        >
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
        <div
          style={{
            marginBottom: '1vh',
            height: '50vh',
          }}
        >
          <Typography
            style={{
              textAlign: 'left',
            }}
          >
            Description :
          </Typography>
          <MarkdownEditor
            style={{
              textAlign: 'left',
            }}
            callback={(text) => setDescription(text.toString())}
          />
        </div>
      </Grid>
      <Grid
        item
        style={{
          display: 'flex',
          flexDirection: 'column',
          paddingLeft: '3vh',
        }}
      >
        <FormControl
          error={errImage}
          onBlur={(e) => setError(e.target.value, setErrImage)}
        >
          <Typography
            style={{
              textAlign: 'left',
            }}
          >
            Carte de fond* :
          </Typography>
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
        <FormControl>
          <Typography
            style={{
              textAlign: 'left',
            }}
          >
            Icône :
          </Typography>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
            }}
          >
            <ImageUploader
              callback={(image) => {
                setImg_avatar(image);
              }}
            ></ImageUploader>
            <Avatar src={img_avatar}></Avatar>
          </div>
        </FormControl>
      </Grid>
      <Grid
        item
        xs={12}
        container
        justify="center"
        style={{
          marginTop: '5vh',
        }}
      >
        <Button onClick={() => handleCancel()} align="center">
          Annuler
        </Button>
        <Button onClick={() => handleSubmit()} align="center">
          Créer un nouveau challenge
        </Button>
      </Grid>
    </Grid>
  );
};

export default FormChallenge;
