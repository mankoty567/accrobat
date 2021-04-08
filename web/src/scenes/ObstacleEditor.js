import {
  DialogContent,
  DialogContentText,
  DialogTitle,
  Dialog,
  FormControl,
  InputLabel,
  Input,
  FormHelperText,
  List,
  ListItem,
  Select,
  MenuItem,
  Typography,
} from '@material-ui/core';
import React, { useState } from 'react';
import ImageUploader from '../components/ImageUploader';

/**
 * Todo :
 * L'image est optionnelle pour l'énigme mais aussi pour le défi en image
 * Gérer la distance et donc le placement sur la liste de cet obstacle
 * Utiliser une icone custom sur la polyline pour l'obstacle sur la carte
 */

let ObstacleEditor = ({ open, setOpen }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [type, setType] = useState('');
  const [enigme, setEnigme] = useState('');
  const [answer, setAnswer] = useState('');
  const [imageChallenge, setImageChallenge] = useState('');

  let handleClose = () => {
    setOpen(false);
  };

  return (
    <Dialog open={open} onClose={() => handleClose()}>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        {/* <ImageUploader
          callback={(file) => console.log(file)}
          preview={true}
        ></ImageUploader> */}
        <List>
          <ListItem>
            <FormControl>
              <InputLabel htmlFor="title">
                Titre de l'obstacle
              </InputLabel>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              ></Input>
              <FormHelperText id="title">
                Renseignez ici le nom de l'obstacle
              </FormHelperText>
            </FormControl>
          </ListItem>
          <ListItem>
            <FormControl>
              <InputLabel htmlFor="title">Description</InputLabel>
              <Input
                multiline={true}
                id="title"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              ></Input>
              <FormHelperText id="title">
                Ajoutez un petit texte descriptif sur l'obstacle
              </FormHelperText>
            </FormControl>
          </ListItem>
          <ListItem>
            <FormControl>
              <Typography>Type d'obstacle :</Typography>
              <Select onChange={(e) => setType(e.target.value)}>
                <MenuItem value={'enigme'}>Enigme</MenuItem>
                <MenuItem value={'image'}>Image</MenuItem>
              </Select>
            </FormControl>
          </ListItem>
          {type === 'enigme' ? (
            <>
              <ListItem>
                <FormControl>
                  <InputLabel htmlFor="title">
                    Description d'énigme
                  </InputLabel>
                  <Input
                    multiline={true}
                    id="title"
                    value={enigme}
                    onChange={(e) => setEnigme(e.target.value)}
                  ></Input>
                  <FormHelperText id="title">
                    L'énigme que vous proposez pour vos joueurs
                  </FormHelperText>
                </FormControl>
              </ListItem>
              <ListItem>
                <FormControl>
                  <InputLabel htmlFor="title">
                    Réponse de l'énigme
                  </InputLabel>
                  <Input
                    id="title"
                    value={answer}
                    onChange={(e) => setAnswer(e.target.value)}
                  ></Input>
                  <FormHelperText id="title">
                    Mettez ici la réponse qu'un joueur doit donner
                  </FormHelperText>
                </FormControl>
              </ListItem>
            </>
          ) : type === 'image' ? (
            <ListItem>
              <FormControl>
                <InputLabel htmlFor="title">
                  Description du défi
                </InputLabel>
                <Input
                  multiline={true}
                  id="title"
                  value={imageChallenge}
                  onChange={(e) => setImageChallenge(e.target.value)}
                ></Input>
                <FormHelperText id="title">
                  Le défi en image que vous proposerez à vos joueurs
                </FormHelperText>
              </FormControl>
            </ListItem>
          ) : null}
        </List>
      </DialogContent>
    </Dialog>
  );
};

export default ObstacleEditor;
