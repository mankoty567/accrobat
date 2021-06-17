import React from 'react';
import useStyles from '../../../components/MaterialUI';
import {
  List,
  ListItem,
  Select,
  MenuItem,
  Button,
  TextField,
  InputLabel,
  Modal,
  Grid,
} from '@material-ui/core';
import Backdrop from '@material-ui/core/Backdrop';

/**
 * Modal pour modifier le marqueur
 * @param {Object} currentMarker Le marqueur actuellement sélectionné
 * @param {Function} updateMarker Fonction permettant de modifier les informations
 * @param {Boolean} modifyMarker Etat pour indiquer si nous sommes en train de modifier un marqueur
 * @param {Function} setModifyMarker Permet de modifier l'état de modifyMarker
 */
let ModifyMarkerPopUp = ({
  currentMarker,
  updateMarker,
  modifyMarker,
  setModifyMarker,
}) => {
  //Variable d'interface
  const classes = useStyles();

  /**
   * Fonction lors de la fermeture du modal
   */
  let handleClose = () => {
    setModifyMarker(false);
  };

  return (
    <Modal
      aria-labelledby="title"
      aria-describedby="content"
      className={classes.modifyModal}
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
      <div className={classes.modifyPaper}>
        <h2 id="title">Modifier le point</h2>
        <List id="content">
          <ListItem>
            <TextField
              defaultValue={currentMarker.title}
              label="Titre"
              onChange={(e) => {
                updateMarker(currentMarker.id, {
                  title: e.target.value,
                });
              }}
            />
          </ListItem>
          <ListItem>
            <TextField
              defaultValue={
                currentMarker.description
                  ? currentMarker.description
                  : ''
              }
              label="Description"
              onChange={(e) => {
                updateMarker(currentMarker.id, {
                  description: e.target.value,
                });
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
                defaultValue={currentMarker.type}
                onChange={(e) => {
                  updateMarker(currentMarker.id, {
                    type: e.target.value,
                  });
                }}
              >
                <MenuItem value={'start'}>Départ</MenuItem>
                <MenuItem value={'point'}>Checkpoint</MenuItem>
                <MenuItem value={'end'}>Arrivée</MenuItem>
              </Select>
            </ListItem>
          ) : null}
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

export default ModifyMarkerPopUp;
