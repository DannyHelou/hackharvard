import React, { useEffect, useState } from 'react';  // Import React and hooks
import axios from 'axios';  // Import Axios for making HTTP requests

const DoctorQuestions = () => {
    const [questions, setQuestions] = useState('');  // State for storing questions
    // const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);  // State for tracking the current question

    useEffect(() => {  // Effect to fetch questions from the server
        const fetchQuestions = async () => {
            try {
                const response = await axios.get('http://127.0.0.1:5000/api/questions');  // Send GET request
                console.log(response)
                setQuestions(response.data);  // Store the fetched questions in state
            } catch (error) {
                console.error("Error fetching questions:", error);  // Log any errors
            }
        };

        fetchQuestions();  // Call the function to fetch questions
    }, []);  // Empty array means this effect runs once when the component mounts

    const handleNextQuestion = () => {
        setCurrentQuestionIndex((prevIndex) => Math.min(prevIndex + 1, questions.length - 1));  // Move to the next question
    };

    return (
        <div>
            <h2>AI Doctor's Questions</h2>
            <p>Message from Flask: {questions}</p>
        </div>
    );
};

export default DoctorQuestions; 