import React from 'react';
import { List, ListItem, TextField } from '@material-ui/core';

let ModifyChallenge = ({ challenge, setChallenge }) => {
  return (
    <List>
      <ListItem>
        <TextField
          value={challenge.title}
          label="Titre"
          onChange={(e) => {
            setChallenge({ ...challenge, title: e.target.value });
          }}
        />
      </ListItem>
      <ListItem>
        <TextField
          value={challenge.description ? challenge.description : ''}
          label="Description"
          onChange={(e) => {
            setChallenge({
              ...challenge,
              description: e.target.value,
            });
          }}
        />
      </ListItem>
      <ListItem>
        <TextField
          value={challenge.echelle}
          label="Échelle"
          type="number"
          onChange={(e) => {
            setChallenge({ ...challenge, echelle: e.target.value });
          }}
        />
      </ListItem>
    </List>
  );
};

export default ModifyChallenge;
