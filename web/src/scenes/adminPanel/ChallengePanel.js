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

let ChallengePanel = () => {
  const [challenges, setChallenges] = useState([]);
  const [addmode, setAddmode] = useState(false);
  const [selected, setSelected] = useState(null);
  const [open, setOpen] = useState(true);

  const getChallenges = () => {
    API.challenge.getAdminChallenges().then((res) => {
      setChallenges(res);
      // console.log(res);
    });
  };

  const addChallenge = (
    title,
    description,
    img_fond,
    scale,
    avatar,
  ) => {
    setAddmode(false);
    //Tester si la img_avatar est null, si c'est le cas, on met undefined

    let img_avatar;
    if (!avatar) {
      img_avatar = undefined;
    }

    let frontId = challenges.length + 1;

    API.challenge
      .createChallenge({
        img_avatar,
        frontId,
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

  useEffect(() => getChallenges(), []);

  useEffect(() => {
    getChallenges();
  }, [open]);

  const Menu = ({ index }) => {
    const handleDelete = () => {
      API.challenge
        .deleteChallenge({
          challenge_id: index,
        })
        .then(() =>
          setChallenges((current) =>
            current.filter((elem) => elem.id !== index),
          ),
        );
    };
    const handleClone = () => {};
    const handleEdit = () => {
      setSelected(index);
      setOpen(true);
    };
    return (
      <>
        <Button startIcon={<EditIcon />} onClick={() => handleEdit()}>
          Modifier
        </Button>
        <Button startIcon={<LayersIcon />}>Dupliquer</Button>
        <Button
          startIcon={<DeleteOutlineIcon />}
          onClick={() => handleDelete()}
        >
          Supprimer
        </Button>
      </>
    );
  };

  return (
    <>
      <Typography variant="h4" align="center">
        {addmode ? 'Ajouter un challenge' : 'Liste des challenges'}
      </Typography>
      <Divider orientation="horizontal" />
      <Button
        startIcon={<AddIcon />}
        onClick={() => {
          setAddmode(true), setSelected(null);
        }}
      >
        Ajouter un challenge
      </Button>
      <Button
        startIcon={<MenuBookIcon />}
        onClick={() => setAddmode(false)}
      >
        Consulter les challenge existants
      </Button>
      {addmode ? (
        <FormChallenge callback={addChallenge} />
      ) : (
        <>
          {challenges
            ? challenges.map((key, idx) => {
                return (
                  <ChallengeItem
                    challenge={key}
                    index={key.id}
                    key={idx}
                    actionComponents={<Menu index={key.id} />}
                  />
                );
              })
            : null}
        </>
      )}
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
