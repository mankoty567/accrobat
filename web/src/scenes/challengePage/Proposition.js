import React, { useEffect, useState } from 'react';
import {
  Divider,
  Typography,
  TextField,
  Button,
} from '@material-ui/core';
import SmallMessage from '../../components/SmallMessage';
import { API } from '../../eventApi/api';
import style from './Proposition.module.css';
import classnames from 'classnames';

let Proposition = () => {
  // Propositions de challenges
  const [challengeProposal, setChallengeProposal] = useState('');
  const [messageProposal, setMessageProposal] = useState({
    type: undefined,
    message: undefined,
  });
  const [duringProposition, setDuringProposition] = useState(false);

  function handleAddProposal() {
    if (duringProposition) return;

    if (challengeProposal === '') {
      setMessageProposal({
        type: 'error',
        message: 'Merci de rentrer une description',
      });
      return;
    }

    setMessageProposal({ type: undefined, message: undefined });
    setDuringProposition(true);

    API.proposition
      .postProposition(challengeProposal)
      .then((data) => {
        setMessageProposal({
          type: 'valide',
          message: 'Votre proposition a bien été ajoutée!',
        });
        setDuringProposition(false);
        setChallengeProposal('');
      })
      .catch((err) => {
        console.log(err);
      });
  }

  // Vote pour des ChallengeToVote
  const [challengesToVote, setChallengesToVote] = useState([]);

  useEffect(() => {
    API.challengeToVote
      .getToVote()
      .then((data) => {
        setChallengesToVote(data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  function handleVote(id, vote) {
    API.challengeToVote
      .vote(id, vote)
      .then(() => {
        setChallengesToVote((before) => {
          return before.map((b) => {
            if (b.id === id) {
              return { ...b, vote: vote };
            } else {
              return b;
            }
          });
        });
      })
      .catch((err) => {
        console.log(err);
      });
  }

  return (
    <>
      {/* <Typography variant="h5" align="center">
        Challenges à voter
      </Typography> */}
      <div className={style.challengeToVoteContainer}>
        {challengesToVote.map((challenge) => (
          <>
            <div key={challenge.id} className={style.challengeToVote}>
              <Typography>{challenge.description}</Typography>
              <div className={style.voteContainer}>
                <p
                  className={classnames([style.no], {
                    [style.selected]: challenge.vote === -1,
                  })}
                  onClick={() => handleVote(challenge.id, -1)}
                >
                  -1
                </p>
                <p
                  className={classnames([style.neutral], {
                    [style.selected]: challenge.vote === 0,
                  })}
                  onClick={() => handleVote(challenge.id, 0)}
                >
                  0
                </p>
                <p
                  className={classnames([style.yes], {
                    [style.selected]: challenge.vote === 1,
                  })}
                  onClick={() => handleVote(challenge.id, 1)}
                >
                  +1
                </p>
              </div>
            </div>
            <Divider
              style={{
                marginLeft: '5vh',
                marginRight: '5vh',
              }}
            />
          </>
        ))}
      </div>

      <SmallMessage
        message={messageProposal.message}
        type={messageProposal.type}
      />
      <div
        style={{
          marginTop: '2vh',
          marginBottom: '2vh',
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <TextField
          value={challengeProposal}
          onChange={(e) => setChallengeProposal(e.target.value)}
          label="Description du thème à proposer"
          style={{ width: '60%' }}
        />
        <Button
          variant="contained"
          style={{ marginLeft: '2vh' }}
          onClick={handleAddProposal}
        >
          Proposer un nouveau thème
        </Button>
      </div>
    </>
  );
};

export default Proposition;
