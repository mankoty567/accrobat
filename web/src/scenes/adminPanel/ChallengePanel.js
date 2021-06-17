import React, { useEffect, useState } from 'react';
import ChallengeItem from '../../components/ChallengeItem';
import FormChallenge from './FormChallenge';
import { Typography, Divider, Button } from '@material-ui/core';
import { API } from '../../eventApi/api';
import AddIcon from '@material-ui/icons/Add';
import MenuBookIcon from '@material-ui/icons/MenuBook';
import EditIcon from '@material-ui/icons/Edit';
import LayersIcon from '@material-ui/icons/Layers';
import DeleteOutlineIcon from '@material-ui/icons/DeleteOutline';
import ChallengeEditor from '../editorPage/ChallengeEditor';

/**
 * Le panel d'administration pour les challenges
 */
let ChallengePanel = () => {
  //Variable d'interface
  const [challenges, setChallenges] = useState([]);
  const [publishedChallenges, setPublishedChallenges] = useState([]);
  const [selected, setSelected] = useState(null);
  const [formChallenge, setFormChallenge] = useState(false);
  const [open, setOpen] = useState(true);
  const [page, setPage] = useState('list'); //list ou form

  /**
   * Fonction pour récupérer tout les challenges de l'API
   */
  const getChallenges = () => {
    API.challenge.getAdminChallenges().then((res) => {
      if (res) {
        res.forEach((challenge) => {
          if (challenge.published) {
            setPublishedChallenges((current) => [
              ...current,
              challenge,
            ]);
          } else {
            setChallenges((current) => [...current, challenge]);
          }
        });
      }
    });
  };

  /**
   * Fonction permettant d'ajouter un challenge sur l'API
   * @param {String} title Titre du challenge
   * @param {String} description Description du challenge
   * @param {Object} img_fond Image de fond de la carte
   * @param {Number} scale Echelle de la carte
   * @param {object} avatar Avatar du challenge
   */
  const addChallenge = (
    title,
    description,
    img_fond,
    scale,
    avatar,
  ) => {
    //Tester si la img_avatar est null, si c'est le cas, on met undefined
    let img_avatar;
    if (!avatar) {
      img_avatar = undefined;
    } else {
      img_avatar = avatar;
    }

    API.challenge
      .createChallenge({
        img_avatar,
        title,
        description,
        echelle: scale,
        img_fond,
      })
      .then((res) => {
        setChallenges((current) => [...current, res]);
        setSelected(res.id);
        setOpen(true);
        setPage('list');
      })
      .catch((err) => console.error(err));
  };

  /**
   * Menu des objets de challenge dans l'interface admin
   * @param {Number} index L'id du challenge
   * @param {Boolean} published Si le challenge est publié
   * @returns
   */
  const Menu = ({ index, published }) => {
    /**
     * Fonction pour gérer la délétion d'un challenge
     */
    const handleDelete = () => {
      API.challenge
        .deleteChallenge(index)
        .then(() =>
          setChallenges((current) =>
            current.filter((elem) => elem.id !== index),
          ),
        );
    };
    /**
     * Fonction permettant de dupliquer un challenge
     */
    const handleClone = () => {
      API.challenge
        .cloneChallenge(index)
        .then(() =>
          setChallenges((current) => [
            ...current,
            current.find((elem) => elem.id === index),
          ]),
        )
        .catch((err) => console.error(err));
    };
    /**
     * Fonction permettant de modifier les informaitons d'un challenge
     */
    const handleEdit = () => {
      setSelected(index);
      setOpen(true);
    };

    return (
      <>
        {!published ? (
          <Button
            startIcon={<EditIcon />}
            onClick={() => handleEdit()}
          >
            Modifier
          </Button>
        ) : null}
        <Button
          startIcon={<LayersIcon />}
          onClick={() => handleClone()}
        >
          Dupliquer
        </Button>
        {!published ? (
          <Button
            startIcon={<DeleteOutlineIcon />}
            onClick={() => handleDelete()}
          >
            Supprimer
          </Button>
        ) : null}
      </>
    );
  };

  useEffect(() => {
    getChallenges();
  }, []);

  useEffect(() => {
    getChallenges();
  }, [open]);

  return (
    <>
      {page === 'list' ? (
        <>
          <Typography variant="h4" align="center">
            Gestionnaire des challenges
          </Typography>
          <div style={{ display: 'flex', flexDirection: 'row' }}>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <Typography variant="h6">Publiés</Typography>
              <table
                style={{
                  display: 'block',
                }}
              >
                {publishedChallenges.map((challenge, idx) => {
                  return (
                    <tr>
                      <td>
                        <ChallengeItem
                          challenge={challenge}
                          index={challenge.id}
                          key={idx}
                          actionComponents={
                            <Menu
                              index={challenge.id}
                              published={challenge.published}
                            />
                          }
                        />
                      </td>
                    </tr>
                  );
                })}
              </table>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <Typography variant="h6">Non publiés</Typography>
              {challenges.map((challenge, idx) => {
                return (
                  <tr>
                    <td>
                      <ChallengeItem
                        challenge={challenge}
                        index={challenge.id}
                        key={idx}
                        actionComponents={
                          <Menu
                            index={challenge.id}
                            published={challenge.published}
                          />
                        }
                      />
                    </td>
                  </tr>
                );
              })}
            </div>
          </div>
          <Divider orientation="horizontal" />
          <Button
            startIcon={<AddIcon />}
            onClick={() => {
              setSelected(null);
              setPage('form');
            }}
          >
            Ajouter un challenge
          </Button>
          {selected ? (
            <ChallengeEditor
              challenge_id={selected}
              setSelected={setSelected}
              open={open}
              setOpen={setOpen}
            />
          ) : null}
        </>
      ) : (
        <FormChallenge
          callback={addChallenge}
          handleCancel={() => setPage('list')}
        />
      )}
    </>
  );
};

export default ChallengePanel;
