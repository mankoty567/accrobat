import React, { useState } from 'react';

import {
  Button,
  TextField,
  Typography,
  CircularProgress,
} from '@material-ui/core';

import style from './ChallengeToVote.module.css';
import { API } from '../../eventApi/api';

export default function ChallengeToVote() {
  const [addDescription, setAddDescription] = useState('');
  const [isLoadingAdd, setIsLoadingAdd] = useState(false);

  function handleClickAdd() {
    if (isLoadingAdd) return;

    setIsLoadingAdd(true);
    API.challengeToVote.addToVote(addDescription).then(() => {
      setAddDescription('');
      setIsLoadingAdd(false);
    });
  }

  return (
    <>
      <div>
        <Typography variant="h5" className={style.center}>
          Ajouter une proposition
        </Typography>
        <div className={style.flex}>
          <TextField
            value={addDescription}
            onChange={(e) => setAddDescription(e.target.value)}
            label="Description"
            style={{ width: '80%' }}
          />
          <Button
            variant="contained"
            color="primary"
            style={{ width: '20%' }}
            onClick={handleClickAdd}
            disabled={addDescription === ''}
          >
            Ajouter
          </Button>
        </div>
        {isLoadingAdd ? <CircularProgress /> : null}
      </div>
    </>
  );
}
