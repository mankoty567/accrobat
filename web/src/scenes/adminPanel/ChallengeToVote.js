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
  Grid,
  IconButton,
} from '@material-ui/core';
import EditIcon from '@material-ui/icons/Edit';
import style from './ChallengeToVote.module.css';
import { API } from '../../eventApi/api';
import classnames from 'classnames';
import Modal from '../../components/Modal';

/**
 * Interface de status
 */
const status = {
  open: 'Ouvert',
  close: 'Fermé',
};

/**
 * Page permettant de voter pour des propositions
 * @param {Object} propositions UseState des différentes propositions des utilisateurs
 */
export default function ChallengeToVote({ propositions }) {
  //Variables d'interface
  const [showClosed, setShowClosed] = useState(false);
  const [addDescription, setAddDescription] = useState('');
  const [isLoadingAdd, setIsLoadingAdd] = useState(false);
  // Partie liste des challengeToVote
  const [challenges, setChallenges] = useState([]);
  const [shownChallenge, setShownChallenge] = useState([]);
  const [isLoadingChallenges, setIsLoadingChallenges] =
    useState(true);
  const [editId, setEditId] = useState(undefined);
  const [modalEditDescOpen, setModalEditDescOpen] = useState(false);
  const [editDesc, setEditDesc] = useState('');

  /**
   * Fonction pour ajouter une proposition
   */
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

  /**
   * Permet de faire de fermer l'ouverture d'un vote de proposition
   * @param {Number} id L'id de la proposition en question
   */
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

  /**
   * Permet de mettre le status d'une proposition de vote à ouvert
   * @param {Number} id L'id de la proposition
   */
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

  /**
   * Fonction pour modifier les informaitons d'une proposition
   * @param {Number} id Id de la proposition en question
   * @param {String} desc Description de la proposition
   */
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

  useEffect(() => {
    API.challengeToVote.getToVoteAdmin().then((data) => {
      setIsLoadingChallenges(false);
      setChallenges(data);
    });
  }, [propositions]);

  useEffect(() => {
    setShownChallenge(
      challenges.filter((c) => showClosed || c.status === 'open'),
    );
  }, [challenges, showClosed]);

  return (
    <>
      <div>
        <Typography
          variant="h5"
          style={{
            marginTop: '2vh',
          }}
        >
          Liste des votes
        </Typography>
        <div>
          <Typography variant="h6">Ajouter un vote</Typography>
          <div
            style={{
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {' '}
            <TextField
              value={addDescription}
              onChange={(e) => setAddDescription(e.target.value)}
              label="Description courte"
              style={{ width: '80%' }}
            />
            <Button
              variant="contained"
              color="primary"
              style={{ marginLeft: '2vh' }}
              onClick={handleClickAdd}
              disabled={addDescription === ''}
            >
              Ajouter
            </Button>
          </div>
          {isLoadingAdd ? <CircularProgress /> : null}
        </div>
        {isLoadingChallenges ? <CircularProgress /> : null}
        <div>
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
        <Grid container justify="center">
          <Table
            style={{
              marginBottom: '2vh',
              width: '90%',
              border: '1px solid black',
            }}
          >
            <TableHead>
              <TableRow>
                <TableCell
                  style={{
                    border: '1px solid black',
                  }}
                >
                  Status
                </TableCell>
                <TableCell
                  style={{
                    border: '1px solid black',
                  }}
                >
                  Description
                </TableCell>
                <TableCell
                  style={{
                    border: '1px solid black',
                  }}
                >
                  Somme des votes
                </TableCell>
                <TableCell
                  style={{
                    border: '1px solid black',
                  }}
                >
                  Nombre de votes
                </TableCell>
                <TableCell
                  style={{
                    border: '1px solid black',
                  }}
                >
                  Action
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {shownChallenge.map((c) => (
                <TableRow key={c.id}>
                  <TableCell
                    style={{
                      border: '1px solid black',
                    }}
                    className={classnames(
                      [style.status],
                      [style[c.status]],
                    )}
                  >
                    {status[c.status]}
                  </TableCell>
                  <TableCell
                    style={{
                      border: '1px solid black',
                    }}
                  >
                    {c.description}{' '}
                    <IconButton
                      onClick={() =>
                        handleClickEdit(c.id, c.description)
                      }
                    >
                      <EditIcon />
                    </IconButton>
                  </TableCell>
                  <TableCell
                    style={{
                      border: '1px solid black',
                    }}
                  >
                    {c.voteSum}
                  </TableCell>
                  <TableCell
                    style={{
                      border: '1px solid black',
                    }}
                  >
                    {c.userVote}
                  </TableCell>
                  <TableCell
                    style={{
                      border: '1px solid black',
                    }}
                  >
                    <Grid container justify="center">
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
                    </Grid>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Grid>
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
