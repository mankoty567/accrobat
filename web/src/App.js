import React from 'react';
import './App.css';
import ChallengeEditor from './scenes/ChallengeEditor';
import AdminMenu from './scenes/adminPanel/AdminPanel';
import MainPage from './scenes/MainPage';

import {
  userApi,
  userAtom,
  duringConnectionAtom,
} from './eventApi/userApi';
import { useRecoilState } from 'recoil';

const JWT_VALIDITY = 2 * 60 * 60 * 1000;

function App() {
  // Tentative de connection automatique de l'utilisateur
  const [, setUserState] = useRecoilState(userAtom);
  const [, setDoneConnection] = useRecoilState(doneConnectionAtom);

  useEffect(() => {
    launchConnection();
    function launchConnection() {
      userApi
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
    }
  }, []);

  return (
    <div className="App">
      {/* <ChallengeEditor /> */}
      {/* <AdminMenu /> */}
      <MainPage />
    </div>
  );
}

export default App;
