import {
  TextField,
  Typography,
  Select,
  MenuItem,
  Grid,
} from '@material-ui/core';
import { useRecoilState } from 'recoil';
import React, { useEffect, useState } from 'react';
import { API } from '../../eventApi/api';

/**
 * Composant pour afficher un utilisateur
 * @param {Number} userId L'id de l'utilisateur
 * @param {String} username L'username concerné
 * @param {Number} permission Rôle de l'user
 */
const UserItem = ({ userId, username, permission }) => {
  return (
    <tr style={{ width: '100%' }}>
      <td style={{ width: '50%' }}>
        <Typography style={{ paddingRight: '10px' }}>
          {username}
        </Typography>
      </td>
      <td style={{ width: '50%' }}>
        <Select
          onChange={(e) =>
            API.user.editUserPerms(userId, e.target.value.toString())
          }
          defaultValue={permission}
          style={{ width: '100%' }}
        >
          <MenuItem value={0}>Utilisateur</MenuItem>
          <MenuItem value={100}>Créateur</MenuItem>
          <MenuItem value={1000}>Administrateur</MenuItem>
        </Select>
      </td>
    </tr>
  );
};

/**
 * Le panel permettant de gérer les utilisateurs
 */
const UserAdminPanel = () => {
  //Variable d'interface
  const [UserState] = useRecoilState(API.user.userAtom);
  const [userList, setUserList] = useState([]);
  const [filter, setFilter] = useState('');

  useEffect(() => {
    API.user.getUserWithPerms().then((res) => {
      setUserList(res.filter((elem) => elem.id !== UserState.id));
    });
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
        Gestionnaire des utilisateurs
      </Typography>
      <Grid
        container
        justify="center"
        style={{
          marginBottom: '1vh',
        }}
      >
        <table>
          <tr>
            <td>
              <Typography style={{ paddingRight: '10px' }}>
                Chercher un utilisateur :
              </Typography>
            </td>
            <td>
              <TextField
                placeholder="Entrez un nom d'utilisateur"
                onChange={(e) => {
                  setFilter(e.target.value);
                }}
                value={filter}
              ></TextField>
            </td>
          </tr>
        </table>
      </Grid>
      <Grid container justify="center">
        <table
        // style={{
        //   width: '300px%',
        //   display: 'block',
        //   marginLeft: '40vw',
        //   marginRight: 'auto',
        // }}
        >
          {userList
            .filter((elem) => elem.username.includes(filter))
            .map((user, idx) => {
              return (
                <UserItem
                  key={idx}
                  userId={user.id}
                  username={user.username}
                  permission={user.permission}
                />
              );
            })}
        </table>
      </Grid>
    </>
  );
};

export default UserAdminPanel;
