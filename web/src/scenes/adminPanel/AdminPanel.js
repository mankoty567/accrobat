import {
  Grid,
  Paper,
  Typography,
  Divider,
  CircularProgress,
  IconButton,
} from '@material-ui/core';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import CancelIcon from '@material-ui/icons/Cancel';
import ChallengePanel from './ChallengePanel';
import React, { useState, useEffect } from 'react';
import { API } from '../../eventApi/api';

import style from './AdminPanel.module.css';

let AdminPanel = () => {
  const [propositions, setPropositions] = useState([]);
  const [isLoadingProposition, setIsLoadingPropositions] =
    useState(true);

  useEffect(() => {
    API.proposition.getPropositions().then((data) => {
      setPropositions(data);
      setIsLoadingPropositions(false);
    });
  }, []);

  function handleChangeProposition(id, status) {
    API.proposition.updateProposition(id, status).then(() => {
      setPropositions((before) => {
        return before.filter((b) => b.id !== id);
      });
    });
  }

  let user = [
    'Jules Poulain',
    'Xavier Schuszter',
    'Céleste Lavigne',
    'Nohan Jaugey',
    'Vincent Seyller',
  ];

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

              {isLoadingProposition ? (
                <CircularProgress />
              ) : (
                propositions.map((key) => {
                  return (
                    <div className={style.flexRow}>
                      <Typography key={key.id}>
                        {key.description}
                      </Typography>
                      <IconButton
                        onClick={(e) =>
                          handleChangeProposition(key.id, 'accepted')
                        }
                      >
                        <CheckCircleIcon />
                      </IconButton>
                      <IconButton
                        onClick={(e) =>
                          handleChangeProposition(key.id, 'refused')
                        }
                      >
                        <CancelIcon />
                      </IconButton>
                    </div>
                  );
                })
              )}
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
