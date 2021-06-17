import {
  Button,
  List,
  ListItem,
  Typography,
} from '@material-ui/core';
import React, { useEffect, useState } from 'react';
import ChallengeItem from '../../components/ChallengeItem';
import BookmarkIcon from '@material-ui/icons/Bookmark';
import { API } from '../../eventApi/api';
import Proposition from './Proposition';
import PreviewChallenge from './PreviewChallenge';
import SearchIcon from '@material-ui/icons/Search';

let ChallengePage = () => {
  //Variable d'interface
  const [challenges, setChallenges] = useState([]);
  const [open, setOpen] = useState(true);
  const [selected, setSelected] = useState(null);

  /**
   * Menu pour les composants de challenge côté tout les challenge
   * @param {Number} index L'index du challenge dans la liste
   */
  const ChallengeMenu = ({ index }) => {
    /**
     * Lorsqu'on clique sur le bouton participer
     */
    const handleClick = () => {
      API.participation.createParticipation(challenges[index].id);
    };

    /**
     * Lorsqu'on clique sur u bouton pour avoir la preview
     */
    const handlePreview = () => {
      setSelected(challenges[index].id);
      setOpen(true);
    };

    return (
      <>
        <Button
          onClick={() => handlePreview()}
          startIcon={<SearchIcon />}
        >
          Prévisualiser
        </Button>

        <Button
          startIcon={<BookmarkIcon />}
          onClick={() => handleClick()}
        >
          Participer
        </Button>
      </>
    );
  };

  /**
   * Permet de récupérer toutes les données de l'utilisateur pour l'affichage des valeurs
   */
  const fetchData = () => {
    //On récupère les participations de l'utilisateur
    API.challenge
      .getChallenges()
      .then((challengeList) => {
        setChallenges(challengeList);
      })
      .catch((err) => console.error(err));
  };

  useEffect(() => fetchData(), []);
  return (
    <>
      {selected ? (
        <PreviewChallenge
          challenge_id={selected}
          setSelected={() => setSelected()}
          open={open}
          setOpen={() => setOpen()}
        />
      ) : null}
      <Typography variant="h3">Challenges disponibles :</Typography>
      <List>
        {challenges.map((elem, idx) => {
          return (
            <ListItem>
              <ChallengeItem
                challenge={elem}
                index={idx}
                key={'c' + elem.id}
                actionComponents={<ChallengeMenu index={idx} />}
              />
            </ListItem>
          );
        })}
      </List>
      <Typography variant="h3">Thèmes :</Typography>

      <Proposition />
    </>
  );
};

export default ChallengePage;
