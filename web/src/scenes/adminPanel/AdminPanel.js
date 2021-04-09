import {
  Button,
  Grid,
  Paper,
  Typography,
  Divider,
} from '@material-ui/core';
import ChallengePanel from './ChallengePanel';
import React from 'react';

let AdminPanel = () => {
  let propositions = [
    'Créer un challenge pour se balader sur Namek',
    'Faire une thématique à propos de Kaamelot !',
    'Naviguer autour du système solaire',
    'Parcourir le monde de Oui-Oui',
    'THEMATIQUE A PROPOS DE HARRY POTTER',
  ];
  let user = ['Jules Poulain', 'Xavier Schuszter', 'Céleste Lavigne', 'Nohan Jaugey', 'Vincent Seyller'];

  return (
    <>
      <Typography variant="h3" style={{ paddingTop: '1vh' }}>
        Menu d'administration
      </Typography>
      <Grid container spacing={4} style={{ padding: '3vh' }}>
        <Grid item xs={4} align="left">
          <Paper>
            <div style={{ height: '30vh' }}>
              <Typography variant="h4" align="center">
                Gestion des utilisateurs
              </Typography>
              <Divider orientation="horizontal" />

              {user.map((key, idx) => {
                return <Typography key={idx}>{key}</Typography>;
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
              <Divider orientation="horizontal" />

              {propositions.map((key, idx) => {
                return <Typography key={idx}>{key}</Typography>;
              })}
            </div>
          </Paper>
        </Grid>
        <Grid item xs={12} align="left">
          <Paper>
            <div>
              <ChallengePanel />
            </div>
          </Paper>
        </Grid>
      </Grid>
    </>
  );
};

export default AdminPanel;
