import React, { useEffect, useState } from 'react';
import ChallengeItem from '../../components/ChallengeItem';
import FormChallenge from './FormChallenge';
import {
  List,
  ListItem,
  Typography,
  Divider,
  Button,
} from '@material-ui/core';
import API from '../../eventApi/eventApi';
import AddIcon from '@material-ui/icons/Add';
import MenuBookIcon from '@material-ui/icons/MenuBook';
import EditIcon from '@material-ui/icons/Edit';
import LayersIcon from '@material-ui/icons/Layers';
import DeleteOutlineIcon from '@material-ui/icons/DeleteOutline';

let ChallengePanel = () => {
  const [challenges, setChallenges] = useState([]);
  const [addmode, setAddmode] = useState(false);

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

    API.createChallenge({
      img_avatar,
      frontId,
      title,
      description,
      echelle: scale,
      img_fond,
    })
      .then((res) => {
        console.log(res);
        setChallenges((current) => [...current, res]);
      })
      .catch((err) => console.error(err));
  };

  useEffect(
    () =>
      API.getAdminChallenges().then((res) => {
        setChallenges(res);
      }),
    [],
  );

  const Menu = (index) => {
    const handleDelete = (index) => {
      API.deleteChallenge({ challenge_id: index }).then(() =>
        setChallenges((current) =>
          current.filter((elem) => elem.id === index),
        ),
      );
    };
    const handleClone = () => {};
    const handleEdit = () => {};
    return (
      <>
        <Button startIcon={<EditIcon />}>Modifier</Button>
        <Button startIcon={<LayersIcon />}>Dupliquer</Button>
        <Button
          startIcon={<DeleteOutlineIcon />}
          onClick={() => handleDelete(index)}
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
        onClick={() => setAddmode(true)}
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
                    menuComponents={<Menu index={key.id} />}
                  />
                );
              })
            : null}
        </>
      )}
    </>
  );
};

export default ChallengePanel;
