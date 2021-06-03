import React from 'react';
import useStyles from './MaterialUI';
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
        <h2 id="title">Modifier le point</h2>
        <List id="content">
          <ListItem>
            <TextField
              value={currentObstacle.title}
              label="Titre"
              onChange={(e) => {
                currentObstacle.title = e.target.value;
                updateObstacle(currentObstacle);
              }}
            />
          </ListItem>
          <ListItem>
            <TextField
              value={
                currentObstacle.description != ' '
                  ? currentObstacle.description
                  : ''
              }
              label="Description"
              onChange={(e) => {
                currentObstacle.description = e.target.value;
                updateObstacle(currentObstacle);
              }}
            />
          </ListItem>
          <ListItem>
            <TextField
              value={currentObstacle.enigme_awnser}
              label="Réponse"
              onChange={(e) => {
                currentObstacle.enigme_awnser = e.target.value;
                updateObstacle(currentObstacle);
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
                currentObstacle.distance = value;
                updateObstacle(currentObstacle);
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
