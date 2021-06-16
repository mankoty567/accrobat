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
import { API } from '../../eventApi/api';

let ParticipationPage = () => {
  //Variable d'interface
  const [selected, setSelected] = useState(null);
  const [participations, setParticipations] = useState([]);
  const [open, setOpen] = useState(true);

  /**
   * Menu pour les composants de challenge côté participation
   * @param {Number} index L'index du challenge dans la liste
   */
  const ParticipationMenu = ({ index }) => {
    /**
     * Lorsqu'on clique sur le bouton consulter
     */
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
          }

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
    </>
  );
};

export default ParticipationPage;