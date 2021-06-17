import React from 'react';
import useStyles from '../../../components/MaterialUI';
import {
  List,
  ListItem,
  Button,
  TextField,
  Modal,
  Grid,
  Typography,
} from '@material-ui/core';
import Backdrop from '@material-ui/core/Backdrop';

/**
 * Fonction pour calculer la distance du segment
 * @param {Number[][]} path Path du segment
 * @param {Number} echelle Echelle par laquelle multiplier
 */
let calcSegmentDistance = (path, echelle) => {
  let d = 0;

  for (let i = 0; i < path.length - 1; i++) {
    d =
      d +
      Math.sqrt(
        Math.pow(path[i][0] - path[i + 1][0], 2) +
          Math.pow(path[i][1] - path[i + 1][1], 2),
      );
  }

  return d * echelle;
};

/**
 * Modal pour modifier une ligne
 * @param {Object} currentLine La ligne actuellement sélectionnée
 * @param {Function} updateLine Fonction pour modifier les données de la ligne
 * @param {Boolean} modifyLine Etat pour définir si on modifier une ligne ou non
 * @param {Function} setModifyLine Fonction pour modifier l'état courrant de la modification
 * @param {Number} echelle Echelle du challenge
 * @param {Function} getMarkerCoordsFromId FOnction pour récupérer un marqueur depuis un id
 */
let ModifyLinePopUp = ({
  currentLine,
  updateLine,
  modifyLine,
  setModifyLine,
  echelle,
  getMarkerCoordsFromId,
}) => {
  //variable d'interface
  const classes = useStyles();

  /**
   * Fonction lors de la fermeture du modal
   */
  let handleClose = () => {
    setModifyLine(false);
  };

  var pointStart = getMarkerCoordsFromId(currentLine.PointStartId);
  var pointEnd = getMarkerCoordsFromId(currentLine.PointEndId);
  var positions = [
    [pointStart[1], pointStart[0]],
    ...currentLine.path.map((elem) => {
      return [elem[1], elem[0]];
    }),
    [pointEnd[1], pointEnd[0]],
  ];

  var distance = calcSegmentDistance(positions, echelle);

  return (
    <Modal
      aria-labelledby="title"
      aria-describedby="content"
      className={classes.modifyModal}
      open={modifyLine}
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
        <h2 id="title">Modifier le segment</h2>
        <List id="content">
          <ListItem>
            <TextField
              defaultValue={currentLine.name}
              label="Nom"
              onChange={(e) => {
                updateLine(currentLine.id, {
                  name: e.target.value,
                });
              }}
            />
          </ListItem>
          <ListItem>
            <Typography id="discrete-slider-small-steps" gutterBottom>
              Distance en mètres : {Math.round(distance)}
            </Typography>
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

export default ModifyLinePopUp;
