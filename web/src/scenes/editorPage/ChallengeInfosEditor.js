import { List, ListItem, TextField } from '@material-ui/core';

let ChallengeInfosEditor = () => {
  return (
    <List>
      <ListItem>
        <TextField label="Titre" />
      </ListItem>
      <ListItem>
        <TextField label="Truc" />
      </ListItem>
    </List>
  );
};

export default ChallengeInfosEditor;
