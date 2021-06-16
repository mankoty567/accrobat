import React from 'react';
import { List, ListItem, TextField } from '@material-ui/core';

let ModifyChallenge = ({ challenge, setChallenge }) => {
  return (
    <List style={{ display: 'inline-block' }}>
      <ListItem style={{ width: '70%', float: 'left' }}>
        <TextField
          style={{ width: '100%' }}
          defaultValue={challenge.title}
          label="Titre"
          onChange={(e) => {
            setChallenge({ ...challenge, title: e.target.value });
          }}
          variant="outlined"
        />
      </ListItem>
      <ListItem style={{ width: '30%', float: 'left' }}>
        <TextField
          style={{ width: '100%' }}
          defaultValue={challenge.echelle}
          label="Échelle (m)"
          type="number"
          onChange={(e) => {
            setChallenge({ ...challenge, echelle: e.target.value });
          }}
          variant="outlined"
        />
      </ListItem>
      <ListItem style={{ width: '100%', float: 'left' }}>
        <TextField
          style={{ width: '100%' }}
          defaultValue={
            challenge.description ? challenge.description : ''
          }
          label="Description"
          onChange={(e) => {
            setChallenge({
              ...challenge,
              description: e.target.value,
            });
          }}
          multiline
          rows={2}
          variant="outlined"
        />{' '}
      </ListItem>
    </List>
  );
};

export default ModifyChallenge;
