import React, { useState } from 'react';
import { AppBar, Tabs, Tab } from '@material-ui/core';
import { Link } from 'react-router-dom';

/**
 * La barre de navigation du site, utilisable partout
 * @returns
 */
let Navbar = () => {
  const [page, setPage] = useState(
    window.location.href.split('/')[3],
  );

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
      </Tabs>
    </AppBar>
  );
};

export default Navbar;
