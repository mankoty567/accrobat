import React, { useState } from 'react';

import { TextField, Typography } from '@material-ui/core';

import style from './ChallengeToVote.module.css';

export default function ChallengeToVote() {
  const [addDescription, setAddDescription] = useState('');

  return (
    <>
      <div>
        <Typography variant="h5" className={style.center}>
          Ajouter une proposition
        </Typography>
      </div>
    </>
  );
}
