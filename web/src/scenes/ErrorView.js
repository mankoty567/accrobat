import { useState } from 'react';
import useStyles from './MaterialUI';
import { Modal, Button, Grid } from '@material-ui/core';
import Backdrop from '@material-ui/core/Backdrop';

let ErrorView = ({ checkMessage, setCheckMessage }) => {
  const classes = useStyles();
  const [open, setOpen] = useState(true);

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
            console.log(idx);
            console.log(message);
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
