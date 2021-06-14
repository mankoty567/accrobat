import { Typography, Tabs, Tab } from '@material-ui/core';
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
import { createBrowserHistory } from 'history';
import PropositionPanel from './PropositionPanel';
import UserAdminPanel from './UserAdminPanel';
import ChallengeToVote from './ChallengeToVote';
import { useRecoilState } from 'recoil';
import { API } from '../../eventApi/api';

let AdminPanel = () => {
  let location = useLocation();

  const history = createBrowserHistory();
  const [page, setPage] = useState(location.pathname);
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
        <Tabs value={page} onChange={handleChanges}>
          <Tab
            label="Gestionnaire de challenge"
            component={Link}
            to="/admin/editor"
            value="/admin/editor"
          />
          <Tab
            label="Proposition utilisateurs"
            component={Link}
            to="/admin/propositions"
            value="admin/propositions"
          />
          {userState.permission > 100 ? (
            <Tab
              label="Gestionnaire des utilisateurs"
              component={Link}
              to="/admin/user"
              value="/admin/user"
            />
          ) : null}

          <Tab
            label="Historique des fraudes"
            component={Link}
            to="/admin/fraud"
            value="/admin/fraud"
          />
        </Tabs>
        <Switch>
          <Route path="/admin/editor">
            <ChallengePanel />
          </Route>
          <Route path="/admin/propositions">
            <PropositionPanel />
            <ChallengeToVote />
          </Route>
          <Route path="/admin/user">
            {userState.permission > 100 ? (
              <UserAdminPanel />
            ) : (
              <Redirect path="admin/editor" />
            )}
          </Route>
          <Route path="/admin/fraud">
            <p>Not implemented yet</p>
          </Route>
          <Route path="/">
            <Redirect path="/editor" />
          </Route>
        </Switch>
      </Router>
    </>
  );
};

export default AdminPanel;
