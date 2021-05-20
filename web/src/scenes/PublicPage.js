import React, { useState } from 'react';

import NeedLogin from './loginForm/NeedLogin';

import {
  Paper,
  Typography,
  Grid,
  TextField,
  Button,
} from '@material-ui/core';

import SmallMessage from '../components/SmallMessage';
import { API } from '../eventApi/api';

let PublicPage = () => {
  const [challengeProposal, setChallengeProposal] = useState('');
  const [messageProposal, setMessageProposal] = useState({
    type: undefined,
    message: undefined,
  });
  const [duringProposition, setDuringProposition] = useState(false);

  function handleAddProposal() {
    if (duringProposition) return;

    if (challengeProposal === '') {
      setMessageProposal({
        type: 'error',
        message: 'Merci de rentrer une description',
      });
      return;
    }

    setMessageProposal({ type: undefined, message: undefined });
    setDuringProposition(true);

    API.proposition
      .postProposition(challengeProposal)
      .then((data) => {
        setMessageProposal({
          type: 'valide',
          message: 'Votre proposition a bien été ajoutée!',
        });
        setDuringProposition(false);
        setChallengeProposal('');
      });
  }

  return (
    <>
      <p>Work in progress...</p>

      <NeedLogin redirect={false}>
        <Grid container spacing={4} style={{ padding: '3vh' }}>
          <Grid item xs={4} align="left">
            <Paper>
              <div style={{ padding: '5px' }}>
                <Typography variant="h5" align="center">
                  Proposer un challenge
                </Typography>

                <TextField
                  value={challengeProposal}
                  onChange={(e) =>
                    setChallengeProposal(e.target.value)
                  }
                  label="Proposition"
                  style={{ width: '100%' }}
                />
                <Button
                  variant="contained"
                  style={{ width: '100%' }}
                  onClick={handleAddProposal}
                >
                  Envoyer
                </Button>
                <SmallMessage
                  message={messageProposal.message}
                  type={messageProposal.type}
                />
              </div>
            </Paper>
          </Grid>
          <Grid item xs={8} align="left"></Grid>
        </Grid>
      </NeedLogin>
    </>
  );
};

export default PublicPage;
