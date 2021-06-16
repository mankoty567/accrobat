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
import ChallengeEditor from '../ChallengeEditor';

/**
 * Le panel d'administration pour les challenges
 */
let ChallengePanel = () => {
  //Variable d'interface
  const [challenges, setChallenges] = useState([]);
  const [addmode, setAddmode] = useState('add');
  const [selected, setSelected] = useState(null);
  const [open, setOpen] = useState(true);

  /**
   * Fonction pour récupérer tout les challenges de l'API
   */
  const getChallenges = () => {
    API.challenge.getAdminChallenges().then((res) => {
      setChallenges(res);
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
    setAddmode('add');
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

    useEffect(() => getChallenges(), []);

    useEffect(() => {
      getChallenges();
    }, [open]);

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

  return (
    <>
      <Typography variant="h4" align="center">
        {addmode == 'add'
          ? 'Ajouter un challenge'
          : addmode === 'list'
          ? 'Liste des challenges'
          : 'Challenges à voter'}
      </Typography>
      <Divider orientation="horizontal" />
      <Button
        startIcon={<AddIcon />}
        onClick={() => {
          setAddmode('add');
          setSelected(null);
        }}
      >
        Ajouter un challenge
      </Button>
      <Button
        startIcon={<MenuBookIcon />}
        onClick={() => setAddmode('list')}
      >
        Consulter les challenge existants
      </Button>

      {addmode === 'add' ? (
        <FormChallenge callback={addChallenge} />
      ) : addmode === 'list' ? (
        <>
          {challenges
            ? challenges.map((key, idx) => {
                return (
                  <ChallengeItem
                    challenge={key}
                    index={key.id}
                    key={idx}
                    actionComponents={
                      <Menu
                        index={key.id}
                        published={key.published}
                      />
                    }
                  />
                );
              })
            : null}
        </>
      ) : null}
      {selected ? (
        <ChallengeEditor
          challenge_id={selected}
          setSelected={setSelected}
          open={open}
          setOpen={setOpen}
        />
      ) : null}
    </>
  );
};

export default ChallengePanel;
