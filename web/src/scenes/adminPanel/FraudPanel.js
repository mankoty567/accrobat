import React, { useEffect, useState } from 'react';
import { Typography } from '@material-ui/core';
import { API } from '../../eventApi/api';

/**
 * Page de l'historique des fraudes
 */
export default function FraudPanel() {
  //Variable d'interface
  const [fraudList, setFraudList] = useState([]);

  //variable d'interface
  useEffect(() => {
    API.event.getAllFraud().then((res) => setFraudList(res));
  }, []);

  return (
    <>
      <Typography variant="h3">Historique des fraudes</Typography>
      {fraudList.map((elem, idx) => {
        return (
          <div
            key={idx}
            style={{
              display: 'flex',
              flexDirection: 'row',
              paddingLeft: '40%',
              paddingRight: 'auto',
            }}
          >
            <Typography variant="h6" style={{ paddingRight: '40px' }}>
              {elem.User.username}
            </Typography>

            <Typography variant="h6">{elem.createdAt}</Typography>
          </div>
        );
      })}
    </>
  );
}