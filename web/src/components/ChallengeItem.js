import {
  Typography,
  List,
  ListItem,
  IconButton,
  Paper,
  Grid,
  Avatar,
  Button,
} from '@material-ui/core';
import EditIcon from '@material-ui/icons/Edit';
import LayersIcon from '@material-ui/icons/Layers';
import DeleteOutlineIcon from '@material-ui/icons/DeleteOutline';
import React from 'react';

let ChallengeItem = ({ challenge }) => {
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
          <Avatar>T</Avatar>
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
          <Button startIcon={<EditIcon />}>Modifier</Button>
          <Button startIcon={<LayersIcon />}>Dupliquer</Button>
          <Button startIcon={<DeleteOutlineIcon />}>Supprimer</Button>

          {/* <IconButton>
            <EditIcon />
          </IconButton>
          <IconButton>
            <LayersIcon />
          </IconButton>
          <IconButton>
            <DeleteOutlineIcon />
          </IconButton> */}
        </Grid>
      </Grid>
    </>
  );
};

export default ChallengeItem;
