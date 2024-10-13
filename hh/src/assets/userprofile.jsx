import React, { useState, useEffect } from 'react';
import axios from 'axios';

function UserProfile() {
  const [userData, setUserData] = useState(null);
  const [appointments, setAppointments] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch user data from backend
        const userResponse = await axios.post(`http://127.0.0.1:5000/user/1`);
        setUserData(userResponse.data);

        // Fetch user's past appointments
        const appointmentsResponse = await axios.post(`http://127.0.0.1:5000/user/1/appointments`);
        setAppointments(appointmentsResponse.data);
      } catch (error) {
        console.error('There was an error fetching the data!', error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="user-profile">
      <h1>User Profile</h1>
      {userData ? (
        <div>
          <h2>Information</h2>
          <div className="user-info">
            <p><strong>Name:</strong> {userData.name}</p>
            <p><strong>Height:</strong> {userData.user_metrics.height || 'N/A'}</p>
            <p><strong>Weight:</strong> {userData.user_metrics.weight || 'N/A'}</p>
            <p><strong>Allergies:</strong> {userData.user_metrics.allergies.length > 0 ? userData.user_metrics.allergies.join(', ') : 'None'}</p>
          </div>
        </div>
      ) : (
        <p>Loading user data...</p>
      )}

      <h2>Past Appointments</h2>
      <div className="appointments" style={{ maxHeight: '200px', overflowY: 'scroll', border: '1px solid #ccc', padding: '10px', width: '100%' }}>
        {appointments.length > 0 ? (
          <ul style={{ listStyleType: 'none', width: 'fit-content' }}>
            {appointments.map((appointment, index) => (
              <li key={index}>{appointment.date}: {appointment.diagnosis}</li>
            ))}
          </ul>
        ) : (
          <p>No past appointments available.</p>
        )}
      </div>
    </div>
  );
}

export default UserProfile;