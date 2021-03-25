import React, { useEffect, useState } from 'react';
import ChallengeItem from '../../components/ChallengeItem';
import FormChallenge from './FormChallenge';
import {
  List,
  ListItem,
  Typography,
  Divider,
  Button,
} from '@material-ui/core';
import API from '../../eventApi/eventApi';
import AddIcon from '@material-ui/icons/Add';
import MenuBookIcon from '@material-ui/icons/MenuBook';

let ChallengePanel = () => {
  const [challenges, setChallenges] = useState([]);
  const [addmode, setAddmode] = useState(false);

  useEffect(
    () =>
      API.getAdminChallenges().then((res) => {
        setChallenges(res);
      }),
    [],
  );

  return (
    <>
      <Typography variant="h4" align="center">
        {addmode ? 'Ajouter un challenge' : 'Liste des challenges'}
      </Typography>
      <Divider orientation="horizontal" />
      <Button
        startIcon={<AddIcon />}
        onClick={() => setAddmode(true)}
      >
        Ajouter un challenge
      </Button>
      <Button
        startIcon={<MenuBookIcon />}
        onClick={() => setAddmode(false)}
      >
        Consulter les challenge existants
      </Button>
      {addmode ? (
        <FormChallenge />
      ) : (
        <List>
          {challenges
            ? challenges.map((key, idx) => {
                return <ChallengeItem challenge={key} />;
              })
            : null}
          <ListItem></ListItem>
        </List>
      )}
    </>
  );
};

export default ChallengePanel;
