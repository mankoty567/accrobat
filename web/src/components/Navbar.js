import React, { useCallback, useEffect, useState } from 'react';
import { AppBar, Tabs, Tab } from '@material-ui/core';
import { Link, useHistory } from 'react-router-dom';
import { API } from '../eventApi/api';
import { useRecoilState } from 'recoil';
import { createBrowserHistory } from 'history';

/**
 * La barre de navigation du site, utilisable partout
 * @returns
 */
export const Navbar = () => {
  const [page, setPage] = useState(
    window.location.href.split('/')[3],
  );

  const [userState] = useRecoilState(API.user.userAtom);

  // const history = useHistory();
  const history = createBrowserHistory();

  useEffect(() => {
    handleChanges(null, location.pathname.split('/')[1]);
    console.log(location.pathname.split('/')[1] === 'home');
  }, [history]);

  const handleChanges = (event, value) => {
    setPage(value);
  };

  return (
    <AppBar position="static">
      <Tabs value={page} onChange={handleChanges}>
        <Tab
          label="Accueil"
          component={Link}
          to="/home"
          value="home"
        />

        <Tab
          label="Espace personnel"
          component={Link}
          to="/profile"
          value="profile"
        />
        <Tab
          label="Vos challenges"
          component={Link}
          to="/challenges"
          value="challenges"
        />
        <Tab
          label="Administration"
          component={Link}
          value="admin"
          to="/admin"
        />
        {userState ? (
          <Tab
            label="Se déconnecter"
            component={Link}
            value="logout"
            to="/logout"
          />
        ) : null}
      </Tabs>
    </AppBar>
  );
};

export default Navbar;
