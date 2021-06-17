import { useState } from 'react';
import useStyles from '../../components/MaterialUI';
import { Modal, Button, Grid } from '@material-ui/core';
import Backdrop from '@material-ui/core/Backdrop';

/**
 * Le composant popup lors d'un challenge invalide
 * @param {Object[]} checkMessage Les instructions à modifier
 * @param {Function} setCheckMessage La fonction pour modifier les messages d'erreur
 */
let ErrorView = ({ checkMessage, setCheckMessage }) => {
  //Variable d'interface
  const classes = useStyles();
  const [open, setOpen] = useState(true);

  /**
   * Lors de la fermeture du modal
   */
  let handleClose = () => {
    setOpen(false);
    setCheckMessage({});
  };

  return (
    <Modal
      aria-labelledby="title"
      aria-describedby="content"
      className={classes.modifyModal}
      open={open}
      onClose={() => {
        handleClose();
      }}
      closeAfterTransition
      BackdropComponent={Backdrop}
      BackdropProps={{
        timeout: 500,
      }}
    >
      <div className={classes.modifyPaper} style={{ width: '20%' }}>
        <h2 id="title" style={{ textAlign: 'center' }}>
          Challenge invalide
        </h2>
        <div id="content">
          {checkMessage.message.map((message, idx) => {
            return <p key={idx}>{message}</p>;
          })}
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
        </div>
      </div>
    </Modal>
  );
};

export default ErrorView;
