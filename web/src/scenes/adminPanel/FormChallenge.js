import {
  FormControl,
  InputLabel,
  FormHelperText,
  Input,
  List,
  ListItem,
} from '@material-ui/core';
import React, { useState } from 'react';
import ImageUploader from '../../components/ImageUploader';

let FormChallenge = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [img_fond, setImg_fond] = useState(null);
  const [img_avatar, setImg_avatar] = useState(null);
  //Il manque l'ID
  return (
    <List>
      <ListItem>
        <FormControl style={{ width: '100%' }}>
          <InputLabel htmlFor="title">Titre :</InputLabel>
          <Input
            onChange={(e) => setTitle(e.target.value)}
            id="title"
          ></Input>
          <FormHelperText id="title">
            Le titre de votre challenge
          </FormHelperText>
        </FormControl>
      </ListItem>
      <ListItem>
        <FormControl style={{ width: '100%' }}>
          <InputLabel htmlFor="desc">Description :</InputLabel>
          <Input
            multiline
            onChange={(e) => setTitle(e.target.value)}
            id="desc"
          ></Input>
          <FormHelperText id="desc">
            Ce qui décrirait votre challenge
          </FormHelperText>
        </FormControl>
      </ListItem>
      <ListItem>
        <ImageUploader
          preview={true}
          callback={(image) => setImg_avatar(image)}
        ></ImageUploader>
      </ListItem>
      <ListItem>
        <ImageUploader
          preview={true}
          callback={(image) => setImg_fond(image)}
        ></ImageUploader>
      </ListItem>
    </List>
  );
};

export default FormChallenge;
