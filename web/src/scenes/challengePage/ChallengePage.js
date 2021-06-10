import {
  Button,
  List,
  ListItem,
  Typography,
} from '@material-ui/core';
import React, { useEffect, useState } from 'react';
import ChallengeItem from '../../components/ChallengeItem';
import ParticipationDetails from './ParticipationDetails';
import SearchIcon from '@material-ui/icons/Search';
import BookmarkIcon from '@material-ui/icons/Bookmark';
import { API } from '../../eventApi/api';

let ChallengePage = () => {
  const [selected, setSelected] = useState(null);
  const [challenges, setChallenges] = useState([]);
  const [participations, setParticipations] = useState([]);
  const [open, setOpen] = useState(true);

  const ParticipationMenu = ({ index }) => {
    const handleClick = () => {
      setSelected(participations[index].id);
    };
    return (
      <>
        <Button
          startIcon={<SearchIcon />}
          onClick={() => handleClick()}
        >
          Consulter
        </Button>
      </>
    );
  };

  const ChallengeMenu = ({ index }) => {
    const handleClick = () => {
      setParticipations((current) => [...current, challenges[index]]);
      setChallenges((current) =>
        current.filter((_, idx) => idx !== index),
      );
      API.participation.createParticipation(challenges[index].id);
    };

    return (
      <>
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
    API.participation
      .getParticipations()
      .then((participationList) => {
        //On récupère tous les challenges publiés
        API.challenge.getChallenges().then((challengeList) => {
          //Par propreté
          let challenge_list = challengeList;
          let participation_list = [];

          for (const elem of participationList) {
            //Transfert du challenge dans la liste des participations
            participation_list = [
              ...participation_list,
              challenge_list.find(
                (challenge) => challenge.id === elem.ChallengeId,
              ),
            ];

            //Supression du challenge en question
            challenge_list = challenge_list.filter(
              (challenge) => challenge.id !== elem.ChallengeId,
            );
          }

          //Mise à jour des states
          setChallenges(
            challenge_list.filter((elem) => elem !== undefined),
          );
          setParticipations(
            participation_list.filter((elem) => elem !== undefined),
          );
        });
      })
      .catch((err) => console.error(err));
  };

  useEffect(() => fetchData(), []);
  return (
    <>
      {selected ? (
        <ParticipationDetails
          challenge_id={selected}
          setSelected={setSelected}
          open={open}
          setOpen={setOpen}
        />
      ) : null}
      <Typography variant="h3">Challenges en cours :</Typography>
      <List>
        {participations.map((elem, idx) => {
          return (
            <ListItem>
              <ChallengeItem
                challenge={elem}
                index={idx}
                key={elem.id}
                actionComponents={<ParticipationMenu index={idx} />}
              ></ChallengeItem>
            </ListItem>
          );
        })}
      </List>
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
    </>
  );
};

export default ChallengePage;
