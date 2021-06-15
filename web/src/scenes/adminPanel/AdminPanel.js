import { Typography, Tabs, Tab } from '@material-ui/core';
import ChallengePanel from './ChallengePanel';
import React, { useState, useEffect } from 'react';
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
import ChallengeToVote from './ChallengeToVote';
import { useRecoilState } from 'recoil';
import { API } from '../../eventApi/api';

let AdminPanel = () => {
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

  useEffect(() => console.log(page), [page]);

  return (
    <>
      <Typography variant="h3" style={{ paddingTop: '1vh' }}>
        Menu d'administration
      </Typography>

      <Router basename="/admin">
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

          <Tab
            label="Historique des fraudes"
            component={Link}
            to="/fraud"
            value="/fraud"
          />
        </Tabs>
        <Switch>
          <Route path="/editor">
            <ChallengePanel />
          </Route>
          <Route path="/propositions">
            <PropositionPanel />
            <ChallengeToVote />
          </Route>
          <Route path="/user">
            {userState.permission > 100 ? (
              <UserAdminPanel />
            ) : (
              <Redirect path="admin/editor" />
            )}
          </Route>
          <Route path="/fraud">
            <p>Not implemented yet</p>
          </Route>
          <Route path="/">
            <Redirect to="/editor" />
          </Route>
        </Switch>
      </Router>
    </>
  );
};

export default AdminPanel;
