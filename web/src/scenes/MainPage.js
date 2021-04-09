import { AppBar, Tabs, Tab } from '@material-ui/core';
import React from 'react';
import PublicPage from './PublicPage';
import ProfilePage from './ProfilePage';
import AdminPanel from './adminPanel/AdminPanel';
import ChallengeEditor from './ChallengeEditor';
import {
  BrowserRouter as Router,
  Route,
  Switch,
  Link,
} from 'react-router-dom';

let MainPage = () => {
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
            <ProfilePage />
          </Route>
          <Route path="/admin">
            <AdminPanel />
          </Route>
        </Switch>
      </Router>
    </>
  );
};

export default MainPage;
