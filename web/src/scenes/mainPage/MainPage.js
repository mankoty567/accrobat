import { AppBar, Tabs, Tab } from '@material-ui/core';
import React, { useEffect } from 'react';
import PublicPage from '../PublicPage';
import ProfilePage from '../profilePage/ProfilePage';

import AdminPanel from '../adminPanel/AdminPanel';
import ChallengeEditor from '../ChallengeEditor';

import LoginForm from '../loginForm/LoginForm';
import Logout from '../loginForm/Logout';
import NeedLogin from '../loginForm/NeedLogin';
import GoogleReturn from '../loginForm/GoogleReturn';

import {
  BrowserRouter as Router,
  Route,
  Switch,
  Link,
  Redirect,
} from 'react-router-dom';

import { API } from '../../eventApi/api';
import { useRecoilState } from 'recoil';
import ChallengePage from '../challengePage/ChallengePage';
import Navbar from '../../components/Navbar';

let MainPage = () => {
  // Tentative de connection automatique de l'utilisateur
  const [, setUserState] = useRecoilState(API.user.userAtom);
  const [, setDoneConnection] = useRecoilState(
    API.user.doneConnectionAtom,
  );

  useEffect(() => {
    launchConnection();
    function launchConnection() {
      API.user
        .whoami()
        .then((data) => {
          localStorage.setItem('jwt', data.jwt);
          setDoneConnection(true);
          setUserState(data);

          setTimeout(launchConnection, API.user.JWT_VALIDITY);
        })
        .catch((err) => {
          setDoneConnection(true);
        });
    }
  }, []);

  return (
    <>
      <Router>
        <Navbar />
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
          <Route path="/challenges">
            <NeedLogin>
              <ChallengePage />
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
          <Route path="/google_return">
            <GoogleReturn />
          </Route>
          <Redirect to="/home" />
        </Switch>
      </Router>
    </>
  );
};

export default MainPage;
