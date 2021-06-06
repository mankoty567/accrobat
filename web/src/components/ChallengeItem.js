import {
  Typography,
  List,
  ListItem,
  Grid,
  Avatar,
} from '@material-ui/core';
import React from 'react';

let ChallengeItem = ({ challenge, actionComponents }) => {
  return (
    <>
      <Grid container>
        <Grid
          container
          item
          xs={1}
          align="Center"
          alignContent="center"
          justify="center"
        >
          <Avatar
            src={`https://api.acrobat.bigaston.dev/api/challenge/${challenge.id}/avatar`}
          ></Avatar>
        </Grid>
        <Grid item xs={8}>
          <List>
            <ListItem>
              <Typography variant="h6" align="center">
                {challenge.title}
              </Typography>
            </ListItem>
            <ListItem>
              <Typography>
                <div
                  dangerouslySetInnerHTML={{
                    __html: challenge.description,
                  }}
                ></div>
              </Typography>
            </ListItem>
          </List>
        </Grid>
        <Grid item xs={3} align="right">
          {actionComponents}
        </Grid>
      </Grid>
    </>
  );
};

export default ChallengeItem;
