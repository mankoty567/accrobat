import React from 'react';
import useStyles from './MaterialUI';
import {
  List,
  ListItem,
  Select,
  MenuItem,
  Button,
  TextField,
  InputLabel,
  Modal,
} from '@material-ui/core';
import Backdrop from '@material-ui/core/Backdrop';
import API from '../eventApi/eventApi';

let PopUp = ({
  currentMarker,
  setStartPoint,
  markers,
  setMarkers,
  modifyMarker,
  setModifyMarker,
}) => {
  const classes = useStyles();

  //Update un marker
  let updateMarker = (marker) => {
    API.updateMarker({ marker }).catch((err) => {
      console.log(err);
    });
    setMarkers((current) =>
      current.filter((val) => {
        if (val.id == marker.id) val = marker;
        return val;
      }),
    );
  };

  let handleClose = () => {
    setModifyMarker(false);
  };

  return (
    <Modal
      aria-labelledby="title"
      aria-describedby="content"
      className={classes.modal_test}
      open={modifyMarker}
      onClose={() => {
        handleClose();
      }}
      closeAfterTransition
      BackdropComponent={Backdrop}
      BackdropProps={{
        timeout: 500,
      }}
    >
      <div className={classes.paper_test}>
        <h2 id="title">Modifier le point</h2>
        <List id="content">
          <ListItem>
            <TextField
              value={currentMarker.title}
              label="Titre"
              onChange={(e) => {
                currentMarker.title = e.target.value;
                updateMarker(currentMarker);
              }}
            />
          </ListItem>
          <ListItem>
            <TextField
              value={
                currentMarker.description
                  ? currentMarker.description
                  : ''
              }
              label="Description"
              onChange={(e) => {
                currentMarker.description = e.target.value;
                updateMarker(currentMarker);
              }}
            />
          </ListItem>
          {currentMarker.type != 'start' ? (
            <ListItem>
              <InputLabel shrink id="select-label">
                Type
              </InputLabel>
              <Select
                labelId="select-label"
                value={currentMarker.type}
                onChange={(e) => {
                  currentMarker.type = e.target.value;
                  updateMarker(currentMarker);
                  if (currentMarker.type == 'end') {
                    setStartPoint(markers.slice(-2)[0]);
                  }
                }}
              >
                <MenuItem value={'start'}>Départ</MenuItem>
                <MenuItem value={'point'}>Checkpoint</MenuItem>
                <MenuItem value={'end'}>Arrivée</MenuItem>
              </Select>
            </ListItem>
          ) : null}
          <Button
            onClick={() => {
              handleClose();
            }}
          >
            Fermer
          </Button>
        </List>
      </div>
    </Modal>
  );
};

export default PopUp;
