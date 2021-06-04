import React, { useEffect, useState } from 'react';
import { AppBar, Tabs, Tab } from '@material-ui/core';
import { Link, useLocation } from 'react-router-dom';
import { API } from '../eventApi/api';
import { useRecoilState } from 'recoil';
import { createBrowserHistory } from 'history';

/**
 * La barre de navigation du site, utilisable partout
 */
export const Navbar = () => {
  let location = useLocation();

  const [page, setPage] = useState(location.pathname);
  const [userState] = useRecoilState(API.user.userAtom);

  const history = createBrowserHistory();

  //En cas de changement d'url, est
  useEffect(() => {
    handleChanges(null, location.pathname.split('/')[1]);
  }, [history]);

  /**
   * En cas de changement de valeurs
   * @param {any} event Evenement actuel, non utilisé
   * @param {String} value L'url de la page courante
   */
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
