import React from 'react';
import { useState } from 'react'
import Dialogue from './assets/Dialogue';
import LoginForm from './assets/loginform';
import UserSelectScreen from './assets/userselectscreen';
import UserProfile from './assets/userprofile';

function App() {
  const [isAuthenticated, setAuthStatus] = useState(false); // Track auth status
  const [currentUser, setCurrentUser] = useState(null); // Track selected user
  const [showDialogue, setShowDialogue] = useState(false); // Track if Dialogue should be shown

  return (
    <div>
      {!isAuthenticated ? (
        <LoginForm setAuthStatus={setAuthStatus} />
      ) : !currentUser ? (
        <UserSelectScreen setCurrentUser={setCurrentUser} />
      ) : !showDialogue ? (
        <div className='user-profile-container'>
          <UserProfile currentUser={currentUser} />
          <button className="user-profile-button" onClick={() => setShowDialogue(true)}>Add new Appointment</button>
        </div>
      ) : (
        <Dialogue />
      )}
    </div>
  );
}

export default App;