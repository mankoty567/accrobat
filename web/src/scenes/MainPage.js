import { AppBar, Tabs, Tab } from '@material-ui/core';
import React, { useEffect } from 'react';
import PublicPage from './PublicPage';
import ProfilePage from './ProfilePage';
import AdminPanel from './adminPanel/AdminPanel';
import ChallengeEditor from './ChallengeEditor';

import LoginForm from './loginForm/LoginForm';
import Logout from './loginForm/Logout';
import NeedLogin from './loginForm/NeedLogin';

import {
  BrowserRouter as Router,
  Route,
  Switch,
  Link,
} from 'react-router-dom';

import { API } from '../eventApi/api';
import { useRecoilState } from 'recoil';

let MainPage = () => {
  // Tentative de connection automatique de l'utilisateur
  const [, setUserState] = useRecoilState(API.user.userAtom);
  const [, setDoneConnection] = useRecoilState(
    API.user.doneConnectionAtom,
  );

  useEffect(() => {
    API.user
      .whoami()
      .then((data) => {
        localStorage.setItem('jwt', data.jwt);
        setDoneConnection(true);
        setUserState(data);

        setTimeout(launchConnection, JWT_VALIDITY);
      })
      .catch((err) => {
        setDoneConnection(true);
      });
  }, []);

  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  return (
    <>
      <Router>
        <AppBar position="static">
          <Tabs value={value} onChange={handleChange}>
            <Tab label="Accueil" component={Link} to="/home" />
            <Tab
              label="Espace personnel"
              component={Link}
              to="/profile"
            />
            <Tab
              label="Administration"
              component={Link}
              to="/admin"
            />
          </Tabs>
        </AppBar>
        <Switch>
          <Route path="/home">
            <PublicPage />
            {/* <ChallengeEditor challenge_id={25} /> */}
          </Route>
          <Route path="/profile">
            <NeedLogin>
              <ProfilePage />
            </NeedLogin>
          </Route>
          <Route path="/admin">
            <NeedLogin admin={true}>
              <AdminPanel />
            </NeedLogin>
          </Route>

          <Route path="/login">
            <LoginForm />
          </Route>
          <Route path="/logout">
            <Logout />
          </Route>
        </Switch>
      </Router>
    </>
  );
};

export default MainPage;
