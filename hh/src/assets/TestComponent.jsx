import React, { useState, useEffect } from 'react';
import axios from 'axios';

const TestComponent = () => {
  const [message, setMessage] = useState('');

  useEffect(() => {
    // Fetch the message from Flask API
    const fetchMessage = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:5000/test');
        setMessage(response.data.message); // Update state with the message from Flask
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchMessage();
  }, []);

  return (
    <div>
      <h1>Test Component</h1>
      <p>Message from Flask: {message}</p>
    </div>
  );
};

export default TestComponent;
