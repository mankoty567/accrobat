import {
  Button,
  List,
  ListItem,
  Typography,
  Divider,
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
      setSelected(participations[index]);
      setOpen(true);
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
              {
                ...challenge_list.find(
                  (challenge) => challenge.id === elem.ChallengeId,
                ),
                participationId: elem.id,
              },
            ];
          }

          setParticipations(
            participation_list.filter((elem) => elem !== undefined),
          );
        });
      })
      .catch((err) => console.error(err));
  };

  useEffect(() => {
    fetchData();
  }, []);
  return (
    <>
      {selected ? (
        <ParticipationDetails
          challenge_id={selected.id}
          setSelected={setSelected}
          open={open}
          setOpen={setOpen}
          participation_id={selected.participationId}
        />
      ) : null}
      <Typography variant="h3" style={{ paddingTop: '1vh' }}>
        Challenges en cours
      </Typography>
      <List>
        {participations.map((elem, idx) => {
          return (
            <>
              <ListItem>
                <ChallengeItem
                  challenge={elem}
                  index={idx}
                  key={'participation' + elem.id + idx}
                  actionComponents={<ParticipationMenu index={idx} />}
                ></ChallengeItem>
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
    </>
  );
};

export default ParticipationPage;
