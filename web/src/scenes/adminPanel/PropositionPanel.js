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

const PropositionPanel = () => {
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
  return (
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
              <Typography key={key.id}>{key.description}</Typography>
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
  );
};

export default PropositionPanel;
