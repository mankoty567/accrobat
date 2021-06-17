import {
  Typography,
  Divider,
  CircularProgress,
  IconButton,
} from '@material-ui/core';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import CancelIcon from '@material-ui/icons/Cancel';
import React, { useState, useEffect } from 'react';
import { API } from '../../eventApi/api';
import useStyles from '../../components/MaterialUI';
import ChallengeToVote from './ChallengeToVote';

/**
 * Pannel permettant de gérer les propositions
 */
const PropositionPanel = () => {
  const classes = useStyles();

  //Variable d'interface
  const [propositions, setPropositions] = useState([]);
  const [isLoadingProposition, setIsLoadingPropositions] =
    useState(true);
  /**
   * Permet de mettre à jour la proposition voulue
   * @param {*} id
   * @param {*} status
   */
  function handleChangeProposition(id, status) {
    API.proposition.updateProposition(id, status).then(() => {
      setPropositions((before) => {
        return before.filter((b) => b.id !== id);
      });
    });
  }

  useEffect(() => {
    API.proposition.getPropositions().then((data) => {
      setPropositions(data);
      setIsLoadingPropositions(false);
    });
  }, []);

  return (
    <>
      <Typography
        variant="h4"
        align="center"
        style={{
          marginBottom: '2vh',
        }}
      >
        Propositions de thèmes
      </Typography>
      <Typography
        variant="h5"
        align="center"
        style={{
          marginBottom: '1vh',
        }}
      >
        Proposition des joueurs
      </Typography>
      {isLoadingProposition ? (
        <CircularProgress />
      ) : (
        propositions.map((key) => {
          return (
            <div
              style={{
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Typography
                key={key.id}
                style={{
                  marginRight: '4vh',
                }}
              >
                {key.description}
              </Typography>
              <IconButton
                style={{
                  color: 'darkgreen',
                  padding: '1vh',
                  // margin: '1vh',
                }}
                onClick={(e) =>
                  handleChangeProposition(key.id, 'accepted')
                }
              >
                <CheckCircleIcon />
              </IconButton>
              <IconButton
                style={{
                  color: 'darkred',
                  padding: '1vh',
                  // margin: '1vh',
                }}
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
      <ChallengeToVote propositions={propositions} />
    </>
  );
};

export default PropositionPanel;
