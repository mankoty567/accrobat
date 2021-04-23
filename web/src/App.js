import React, { useEffect } from 'react';
import './App.css';
import ChallengeEditor from './scenes/ChallengeEditor';
import AdminMenu from './scenes/adminPanel/AdminPanel';
import MainPage from './scenes/MainPage';

const JWT_VALIDITY = 2 * 60 * 60 * 1000;

function App() {
  return (
    <div className="App">
      {/* <ChallengeEditor /> */}
      {/* <AdminMenu /> */}
      <MainPage />
    </div>
  );
}

export default App;
