import React from 'react';

function UserSelectScreen({ setCurrentUser }) {
    const user_info = [
      { id: 1, name: "Mom", profilePic: "mom_icon.png" },
      { id: 2, name: "Dad", profilePic: "dad_icon.png" },
      { id: 3, name: "John Harvard", profilePic: "you_icon.png" }
    ];

  const handleUserClick = (user) => {
    console.log('Selected User Data:', user);
    setCurrentUser(user);
  };

  return (
    <div className="user-select-screen">
      <h1>Select Your Profile</h1>
      <div className="user-container">
        {user_info.map(user => (
          <div key={user.id} className="user-box" onClick={() => handleUserClick(user)}>
            <img src={user.profilePic} alt={`${user.name}'s profile`} />
            <h2>{user.name}</h2>
          </div>
        ))}
      </div>
    </div>
  );
}

export default UserSelectScreen;