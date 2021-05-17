import React, { useEffect, useState } from 'react';

import {
  Button,
  TextField,
  Typography,
  CircularProgress,
  Divider,
  Table,
  TableHead,
  TableBody,
  TableCell,
  TableRow,
  Select,
  MenuItem,
} from '@material-ui/core';

import style from './ChallengeToVote.module.css';
import { API } from '../../eventApi/api';

import classnames from 'classnames';

const status = {
  open: 'Ouvert',
  close: 'Fermé',
};

export default function ChallengeToVote() {
  // Partie ajout de ChallengeToVote
  const [addDescription, setAddDescription] = useState('');
  const [isLoadingAdd, setIsLoadingAdd] = useState(false);

  function handleClickAdd() {
    if (isLoadingAdd) return;

    setIsLoadingAdd(true);
    API.challengeToVote.addToVote(addDescription).then(() => {
      setChallenges((before) => {
        return [
          ...before,
          {
            description: addDescription,
            status: 'open',
            userVote: 0,
            voteSum: 0,
          },
        ];
      });
      setAddDescription('');
      setIsLoadingAdd(false);
    });
  }

  // Partie liste des challengeToVote
  const [challenges, setChallenges] = useState([]);
  const [isLoadingChallenges, setIsLoadingChallenges] =
    useState(true);

  useEffect(() => {
    API.challengeToVote.getToVoteAdmin().then((data) => {
      console.log(data);
      setIsLoadingChallenges(false);
      setChallenges(data);
    });
  }, []);

  function handleCloseChallenge(id) {
    API.challengeToVote.changeToVoteStatus(id, 'close').then(() => {
      setChallenges((before) => {
        return before.map((b) => {
          if (b.id === id) {
            return { ...b, status: 'close' };
          } else {
            return b;
          }
        });
      });
    });
  }

  function handleOpenChallenge(id) {
    API.challengeToVote.changeToVoteStatus(id, 'open').then(() => {
      setChallenges((before) => {
        return before.map((b) => {
          if (b.id === id) {
            return { ...b, status: 'open' };
          } else {
            return b;
          }
        });
      });
    });
  }

  return (
    <>
      <div>
        <Typography variant="h5" className={style.center}>
          Ajouter une proposition
        </Typography>
        <div className={style.flex}>
          <TextField
            value={addDescription}
            onChange={(e) => setAddDescription(e.target.value)}
            label="Description"
            style={{ width: '80%' }}
          />
          <Button
            variant="contained"
            color="primary"
            style={{ width: '20%' }}
            onClick={handleClickAdd}
            disabled={addDescription === ''}
          >
            Ajouter
          </Button>
        </div>
        {isLoadingAdd ? <CircularProgress /> : null}
      </div>

      <Divider
        orientation="horizontal"
        style={{ marginTop: '10px' }}
      />

      <div>
        <Typography variant="h5" className={style.center}>
          Liste des propositions
        </Typography>
        {isLoadingChallenges ? <CircularProgress /> : null}
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Status</TableCell>
              <TableCell>Description</TableCell>
              <TableCell>Somme des votes</TableCell>
              <TableCell>Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {challenges.map((c) => (
              <TableRow key={c.id} className={style.flex}>
                <TableCell
                  className={classnames(
                    [style.status],
                    [style[c.status]],
                  )}
                >
                  {status[c.status]}
                </TableCell>
                <TableCell>{c.description}</TableCell>
                <TableCell>{c.voteSum}</TableCell>
                <TableCell>
                  {c.status === 'open' ? (
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={() => handleCloseChallenge(c.id)}
                    >
                      Fermer
                    </Button>
                  ) : (
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={() => handleOpenChallenge(c.id)}
                    >
                      Ouvrir
                    </Button>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </>
  );
}
