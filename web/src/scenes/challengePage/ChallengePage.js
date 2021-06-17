import {
  Button,
  List,
  ListItem,
  Typography,
  Divider,
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
      <Typography variant="h3" style={{ paddingTop: '1vh' }}>
        Challenges disponibles
      </Typography>
      <List
        style={{
          marginBottom: '2vh',
        }}
      >
        {challenges.map((elem, idx) => {
          return (
            <>
              <ListItem>
                <ChallengeItem
                  challenge={elem}
                  index={idx}
                  key={'challenge' + elem.id + idx}
                  actionComponents={<ChallengeMenu index={idx} />}
                />
              </ListItem>
              <Divider
                style={{
                  marginLeft: '5vh',
                  marginRight: '5vh',
                }}
              />
            </>
          );
        })}
      </List>
      <Typography
        variant="h4"
        align="center"
        style={{
          marginBottom: '2vh',
        }}
      >
        Thèmes
      </Typography>
      <Proposition />
    </>
  );
};

export default ChallengePage;
