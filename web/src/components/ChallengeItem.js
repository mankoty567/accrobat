import {
  Typography,
  List,
  ListItem,
  Grid,
  Avatar,
} from '@material-ui/core';

import React from 'react';

let ChallengeItem = ({ challenge, index, menuComponents }) => {
  return (
    <>
      <Grid container>
        <Grid
          container
          item
          xs={1}
          align="Center"
          alignContent="center"
          justify="center"
        >
          <Avatar> </Avatar>
        </Grid>
        <Grid item xs={8}>
          <List>
            <ListItem>
              <Typography variant="h6" align="center">
                {challenge.title}
              </Typography>
            </ListItem>
            <ListItem>
              <Typography>{challenge.description}</Typography>
            </ListItem>
          </List>
        </Grid>
        <Grid item xs={3} align="right">
          {menuComponents}
          {/* <Button startIcon={<EditIcon />}>Modifier</Button>
          <Button startIcon={<LayersIcon />}>Dupliquer</Button>
          <Button
            startIcon={<DeleteOutlineIcon />}
            onClick={() => handleDelete(index)}
          >
            Supprimer
          </Button> */}
        </Grid>
      </Grid>
    </>
  );
};

export default ChallengeItem;
