import React from 'react';
import ChallengeItem from '../../components/ChallengeItem';
import { List, ListItem, Typography } from '@material-ui/core';

let ChallengePanel = () => {
  let challenges = ['star wars', 'mordor'];

  return (
    <>
      <Typography variant="h4" align="center">
        Liste des challenges
      </Typography>
      <List>
        <ListItem>
          <ChallengeItem />
        </ListItem>
      </List>
    </>
  );
};

export default ChallengePanel;
