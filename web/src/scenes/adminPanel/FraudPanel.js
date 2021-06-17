import React, { useEffect, useState } from 'react';
import { Typography, Grid } from '@material-ui/core';
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
      <Typography
        variant="h4"
        align="center"
        style={{
          marginBottom: '2vh',
        }}
      >
        Historique des fraudes
      </Typography>
      <Grid
        container
        justify="center"
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        {fraudList.map((elem, idx) => {
          let date = new Date(elem.createdAt);
          return (
            <div
              key={idx}
              style={{
                display: 'flex',
                flexDirection: 'raw',
              }}
            >
              <Typography variant="h6" key={idx + 'username'}>
                {elem.User.username + ' :'}
              </Typography>
              <Typography
                variant="h6"
                key={idx + 'date'}
                style={{
                  marginLeft: '5px',
                }}
              >
                {`${('0' + date.getDay()).toString().slice(-2)}/${(
                  '0' + date.getMonth()
                )
                  .toString()
                  .slice(-2)}/${date.getFullYear()}`}
              </Typography>
            </div>
          );
        })}
      </Grid>
    </>
  );
}
