import React, { useState } from 'react';

import NeedLogin from './loginForm/NeedLogin';

import {
  Paper,
  Typography,
  Grid,
  TextField,
  Button,
} from '@material-ui/core';

let PublicPage = () => {
  const [challengeProposal, setChallengeProposal] = useState('');

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
                <Button variant="contained" style={{ width: '100%' }}>
                  Envoyer
                </Button>
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
