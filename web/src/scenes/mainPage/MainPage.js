import React, { useEffect } from 'react';
import PublicPage from '../publicPage/PublicPage';
import ProfilePage from '../profilePage/ProfilePage';
import ParticipationPage from '../participationPage/ParticipationPage';
import AdminPanel from '../adminPanel/AdminPanel';
import LoginForm from '../loginForm/LoginForm';
import InscriptionForm from '../loginForm/InscriptionForm';

import Logout from '../loginForm/Logout';
import NeedLogin from '../loginForm/NeedLogin';
import GoogleReturn from '../loginForm/GoogleReturn';
import {
  BrowserRouter as Router,
  Route,
  Switch,
  Redirect,
} from 'react-router-dom';
import { API } from '../../eventApi/api';
import { useRecoilState } from 'recoil';
import ChallengePage from '../challengePage/ChallengePage';
import Navbar from '../../components/Navbar';

/**
 * Page principale de l'application, contenant la navBar et le routage de base
 */
let MainPage = () => {
  //Variable d'interface
  const [UserState, setUserState] = useRecoilState(API.user.userAtom);
  const [, setDoneConnection] = useRecoilState(
    API.user.doneConnectionAtom,
  );

  useEffect(() => {
    launchConnection();
    function launchConnection() {
      API.user
        .whoami()
        .then((data) => {
          localStorage.setItem('token', data.jwt);
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
          <Route path="/participations">
            <NeedLogin>
              <ParticipationPage />
            </NeedLogin>
          </Route>
          <Route path="/login">
            <LoginForm />
          </Route>
          <Route path="/register">
            <InscriptionForm />
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
