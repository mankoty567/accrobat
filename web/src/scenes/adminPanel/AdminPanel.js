import { Typography, Tabs, Tab, Grid } from '@material-ui/core';
import ChallengePanel from './ChallengePanel';
import React, { useState } from 'react';
import {
  Link,
  BrowserRouter as Router,
  Route,
  Redirect,
  Switch,
  useLocation,
} from 'react-router-dom';
import PropositionPanel from './PropositionPanel';
import UserAdminPanel from './UserAdminPanel';
import FraudPanel from './FraudPanel';
import { useRecoilState } from 'recoil';
import { API } from '../../eventApi/api';

/**
 * La page de base du menu d'administration. C'est le point d'entrée de la page admin
 */
let AdminPanel = () => {
  //Variables d'interface
  let location = useLocation();
  const [page, setPage] = useState(
    '/' + location.pathname.split('/')[2],
  );
  const [userState] = useRecoilState(API.user.userAtom);

  /**
   * En cas de changement de valeurs
   * @param {any} event Evenement actuel, non utilisé
   * @param {String} value L'url de la page courante
   */
  const handleChanges = (event, value) => {
    setPage(value);
  };

  return (
    <>
      <Typography variant="h3" style={{ paddingTop: '1vh' }}>
        Menu d'administration
      </Typography>

      <Router basename="/admin">
        <Grid
          container
          justify="center"
          style={{
            paddingBottom: '1vh',
          }}
        >
          <Tabs value={page} onChange={handleChanges}>
            <Tab
              label="Gestionnaire de challenge"
              component={Link}
              to="/editor"
              value="/editor"
            />
            <Tab
              label="Proposition utilisateurs"
              component={Link}
              to="/propositions"
              value="/propositions"
            />
            {userState.permission > 100 ? (
              <Tab
                label="Gestionnaire des utilisateurs"
                component={Link}
                to="/user"
                value="/user"
              />
            ) : null}

            {userState.permission > 100 ? (
              <Tab
                label="Historique des fraudes"
                component={Link}
                to="/fraud"
                value="/fraud"
              />
            ) : null}
          </Tabs>
        </Grid>

        <Switch>
          <Route path="/editor">
            <ChallengePanel />
          </Route>
          <Route path="/propositions">
            <PropositionPanel />
          </Route>
          <Route path="/user">
            {userState.permission > 100 ? (
              <UserAdminPanel />
            ) : (
              <Redirect path="admin/editor" />
            )}
          </Route>
          {userState.permission > 100 ? (
            <Route path="/fraud">
              <FraudPanel />
            </Route>
          ) : null}
          <Route path="/">
            <Redirect to="/editor" />
          </Route>
        </Switch>
      </Router>
    </>
  );
};

export default AdminPanel;
