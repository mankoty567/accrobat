import React from 'react';
import { List, ListItem, TextField } from '@material-ui/core';
import MarkdownEditor from '../../../components/MarkdownEditor';
import useStyles from '../../../components/MaterialUI';

/**
 * Modal permettant de modifier le challenge
 * @param {Object} challenge Challenge actuel à modifier
 * @param {Function} setChallenge Modifie les informations du challenge
 */
let ModifyChallenge = ({ challenge, setChallenge }) => {
  //Utilisation des classes CSS
  const classes = useStyles();

  return (
    <List
      style={{
        height: '100%',
      }}
    >
      <ListItem>
        <TextField
          className={classes.input}
          defaultValue={challenge.title}
          label="Titre"
          onChange={(e) => {
            setChallenge({ ...challenge, title: e.target.value });
          }}
          variant="outlined"
        />
      </ListItem>
      <ListItem>
        <TextField
          className={classes.input}
          defaultValue={challenge.echelle}
          label="Échelle (m)"
          type="number"
          onChange={(e) => {
            setChallenge({ ...challenge, echelle: e.target.value });
          }}
          variant="outlined"
        />
      </ListItem>
      <ListItem
        style={{
          'justify-content': 'center',
          height: '70%',
        }}
      >
        <MarkdownEditor
          callback={(e) =>
            setChallenge({
              ...challenge,
              description: e.toString(),
            })
          }
          defaultText={challenge.description}
        />
      </ListItem>
    </List>
  );
};

export default ModifyChallenge;
