import React from 'react';
import useStyles from '../../../components/MaterialUI';
import {
  List,
  ListItem,
  Button,
  TextField,
  Modal,
  Grid,
  Slider,
  Typography,
} from '@material-ui/core';
import Backdrop from '@material-ui/core/Backdrop';

let ModifyObstaclePopUp = ({
  currentObstacle,
  updateObstacle,
  modifyObstacle,
  setModifyObstacle,
}) => {
  const classes = useStyles();

  let handleClose = () => {
    setModifyObstacle(false);
  };

  return (
    <Modal
      aria-labelledby="title"
      aria-describedby="content"
      className={classes.modifyModal}
      open={modifyObstacle}
      onClose={() => {
        handleClose();
      }}
      closeAfterTransition
      BackdropComponent={Backdrop}
      BackdropProps={{
        timeout: 500,
      }}
    >
      <div className={classes.modifyPaper}>
        <h2 id="title">Modifier l'obstacle</h2>
        <List id="content">
          <ListItem>
            <TextField
              defaultValue={currentObstacle.title}
              label="Titre"
              onChange={(e) => {
                updateObstacle(currentObstacle.id, {
                  title: e.target.value,
                });
              }}
            />
          </ListItem>
          <ListItem>
            <TextField
              defaultValue={
                currentObstacle.description != ' '
                  ? currentObstacle.description
                  : ''
              }
              label="Question"
              onChange={(e) => {
                updateObstacle(currentObstacle.id, {
                  description: e.target.value,
                });
              }}
            />
          </ListItem>
          <ListItem>
            <TextField
              defaultValue={currentObstacle.enigme_awnser}
              label="Réponse"
              onChange={(e) => {
                updateObstacle(currentObstacle.id, {
                  enigme_awnser: e.target.value,
                });
              }}
            />
          </ListItem>
          <ListItem>
            <Typography id="discrete-slider-small-steps" gutterBottom>
              Distance en %
            </Typography>
          </ListItem>
          <ListItem>
            <Slider
              key={`slider-${currentObstacle.distance}`}
              defaultValue={currentObstacle.distance}
              aria-labelledby="discrete-slider-small-steps"
              step={0.01}
              valueLabelDisplay="auto"
              min={0.05}
              max={0.95}
              onChangeCommitted={(e, value) => {
                updateObstacle(currentObstacle.id, {
                  distance: value,
                });
              }}
            />
          </ListItem>
          <br />
          <Grid container justify="center">
            <Button
              color="secondary"
              onClick={() => {
                handleClose();
              }}
            >
              Fermer
            </Button>
          </Grid>
        </List>
      </div>
    </Modal>
  );
};

export default ModifyObstaclePopUp;
