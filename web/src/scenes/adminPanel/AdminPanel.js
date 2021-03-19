import { Button, Grid, Paper, Typography } from '@material-ui/core';
import ChallengePanel from './ChallengePanel';
import React from 'react';

let AdminPanel = () => {
  let propositions = [
    'Ajouter une vraie première map',
    'Rédiger les tests',
  ];
  let user = ['Roger', 'Bernard'];
  return (
    <>
      <Typography variant="h3" style={{ paddingTop: '1vh' }}>
        Menu d'administration
      </Typography>
      <Grid container spacing={4} style={{ padding: '3vh' }}>
        <Grid item xs={4} align="left">
          <Paper>
            <div style={{ height: '30vh' }}>
              <Typography ography variant="h4" align="center">
                Gestion des utilisateurs
              </Typography>
              {user.map((key) => {
                return <Typography>{key}</Typography>;
              })}
            </div>
          </Paper>
        </Grid>
        <Grid item xs={8} align="left">
          <Paper>
            <div style={{ height: '30vh' }}>
              <Typography variant="h4" align="center">
                Proposition des joueurs
              </Typography>
              {propositions.map((key) => {
                return <Typography>{key}</Typography>;
              })}
            </div>
          </Paper>
        </Grid>
        <Grid item xs={12} align="left">
          <Paper>
            <div style={{ height: '50vh' }}>
              <ChallengePanel />
            </div>
          </Paper>
        </Grid>
      </Grid>
    </>
  );
};

export default AdminPanel;
