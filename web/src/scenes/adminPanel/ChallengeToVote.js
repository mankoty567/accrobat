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
  FormControlLabel,
  Checkbox,
  IconButton,
} from '@material-ui/core';

import EditIcon from '@material-ui/icons/Edit';

import style from './ChallengeToVote.module.css';
import { API } from '../../eventApi/api';

import classnames from 'classnames';

import Modal from '../../components/Modal';

const status = {
  open: 'Ouvert',
  close: 'Fermé',
};

export default function ChallengeToVote() {
  const [showClosed, setShowClosed] = useState(false);

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
  const [shownChallenge, setShownChallenge] = useState([]);
  const [isLoadingChallenges, setIsLoadingChallenges] =
    useState(true);

  useEffect(() => {
    API.challengeToVote.getToVoteAdmin().then((data) => {
      setIsLoadingChallenges(false);
      setChallenges(data);
    });
  }, []);

  useEffect(() => {
    setShownChallenge(
      challenges.filter((c) => showClosed || c.status === 'open'),
    );
  }, [challenges, showClosed]);

  function handleCloseChallenge(id) {
    API.challengeToVote
      .changeToVote(id, { status: 'close' })
      .then(() => {
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
    API.challengeToVote
      .changeToVote(id, { status: 'open' })
      .then(() => {
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

  const [editId, setEditId] = useState(undefined);
  const [modalEditDescOpen, setModalEditDescOpen] = useState(false);
  const [editDesc, setEditDesc] = useState('');

  function handleClickEdit(id, desc) {
    setEditId(id);
    setEditDesc(desc);
    setModalEditDescOpen(true);
  }

  function handleEditSave() {
    API.challengeToVote
      .changeToVote(editId, { description: editDesc })
      .then(() => {
        setChallenges((before) => {
          setModalEditDescOpen(false);

          return before.map((b) => {
            if (b.id === editId) {
              return { ...b, description: editDesc };
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
        <div className={style.flexCenter}>
          <FormControlLabel
            control={
              <Checkbox
                checked={showClosed}
                onChange={(e) => setShowClosed(e.target.checked)}
                name="checkedB"
                color="primary"
              />
            }
            label="Montrer les challenges fermés"
          />
        </div>

        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Status</TableCell>
              <TableCell>Description</TableCell>
              <TableCell>Somme des votes</TableCell>
              <TableCell>Nombre de votes</TableCell>
              <TableCell>Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {shownChallenge.map((c) => (
              <TableRow key={c.id} className={style.flex}>
                <TableCell
                  className={classnames(
                    [style.status],
                    [style[c.status]],
                  )}
                >
                  {status[c.status]}
                </TableCell>
                <TableCell>
                  {c.description}{' '}
                  <IconButton
                    onClick={() =>
                      handleClickEdit(c.id, c.description)
                    }
                  >
                    <EditIcon />
                  </IconButton>
                </TableCell>
                <TableCell>{c.voteSum}</TableCell>
                <TableCell>{c.userVote}</TableCell>
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

      <Modal
        open={modalEditDescOpen}
        onCancel={() => setModalEditDescOpen(false)}
      >
        <h2>Modifier la description</h2>
        <TextField
          style={{ width: '100%' }}
          value={editDesc}
          onChange={(e) => setEditDesc(e.target.value)}
          label="Description"
        />

        <Button
          style={{ width: '100%' }}
          variant="contained"
          color="primary"
          onClick={handleEditSave}
        >
          Sauvegarder
        </Button>
      </Modal>
    </>
  );
}
