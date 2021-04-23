import React, { useEffect } from 'react';
import './App.css';
import ChallengeEditor from './scenes/ChallengeEditor';
import AdminMenu from './scenes/adminPanel/AdminPanel';
import MainPage from './scenes/MainPage';

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
