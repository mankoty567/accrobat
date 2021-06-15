import {
  List,
  ListItem,
  TextField,
  Typography,
  Divider,
  Select,
  MenuItem,
} from '@material-ui/core';
import { useRecoilState } from 'recoil';

import React, { useEffect, useState } from 'react';
import { API } from '../../eventApi/api';

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

const UserAdminPanel = () => {
  const [UserState] = useRecoilState(API.user.userAtom);

  useEffect(() => {
    API.user.getUserWithPerms().then((res) => {
      setUserList(res.filter((elem) => elem.id !== UserState.id));
    });
  }, []);

  const [userList, setUserList] = useState([]);
  const [filter, setFilter] = useState('');

  return (
    <div style={{ marginLeft: 'auto', marginRight: 'auto' }}>
      <Typography variant="h4" align="center">
        Gestionnaire des utilisateurs
      </Typography>
      <table style={{ marginLeft: '40%', marginRight: 'auto' }}>
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

      <table
        style={{
          width: '300px%',
          display: 'block',
          marginLeft: '40vw',
          marginRight: 'auto',
        }}
      >
        {userList
          .filter((elem) => elem.username.includes(filter))
          .map((user) => {
            return (
              <UserItem
                userId={user.id}
                username={user.username}
                permission={user.permission}
              />
            );
          })}
      </table>
    </div>
  );
};

export default UserAdminPanel;
