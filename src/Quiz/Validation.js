import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { Global, css } from '@emotion/react';
import toast from "react-hot-toast";

function DisplayQuestions() {
  const [questions, setQuestions] = useState([]);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [selectedOptions, setSelectedOptions] = useState({});
  const navigate = useNavigate(); // Hook to navigate

  useEffect(() => { 
    const fetchQuestions = async () => {
      try {
        const response = await axios.get('http://localhost:5000/validate');
        const fetchedQuestions = response.data;
        const initialSelectedOptions = fetchedQuestions.reduce((acc, question) => {
          acc[question.id] = "";
          return acc;
        }, {});
        setSelectedOptions(initialSelectedOptions);
        setQuestions(fetchedQuestions);
      } catch (error) {
        console.error('Error fetching questions:', error);
      }
    };

    fetchQuestions();
  }, []);

  const handleOptionChange = (questionId, value) => {
    setSelectedOptions({
      ...selectedOptions,
      [questionId]: value
    });
  };

  const handleCorrection = async () => {
    if (Object.values(selectedOptions).some(option => option === "")) {
      alert('Veuillez répondre à toutes les questions avant de corriger.');
      return;
    }
    try {
      const response = await axios.post('http://localhost:5000/correct', selectedOptions);
      const { correct_answers: correctAnswersCount } = response.data;
      setCorrectAnswers(correctAnswersCount);
      alert(`Nombre de réponses correctes : ${correctAnswersCount}/${questions.length}`);
     // Prepare data for quiz result submission
     const quizTitle = `quiz_${new Date().toLocaleDateString('fr-CA').replace(/\//g, '-')}`;
     const quizResultData = { quizTitle, score: correctAnswersCount };

     // Send quiz result to server using fetch
     const accessToken = localStorage.getItem("accessToken");
        const response1 = await fetch('https://myserver.oulkaid-elhoussin.workers.dev/api/quiz-results', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': accessToken
          },
          body: JSON.stringify(quizResultData)
        });
        // const data = await response1.json();

        if (response1.ok) {
          toast.success("Your quiz result has been submitted successfully!");
          navigate("/dashboard"); // Navigate to /user-list
        } else {
          toast.error("An error occurred while submitting your quiz result. Please try again.");
        }

   } catch (error) {
     console.error('Error correcting answers:', error);
   }
 };

  const styles = {

    container: {
      fontFamily: '"Noto Sans", sans-serif',
      maxWidth: '800px',
      margin: '40px auto',
      padding: '20px',
      backgroundColor: '#1e1e1e',
      color: '#e0e0e0',
      borderRadius: '10px',
      boxShadow: '0 0 20px rgba(0, 0, 0, 0.5)',
    
    },
    header: {

      textAlign: 'center',
      color: '#fff',
      marginBottom: '40px',
    },
    headerImage: {
      width: '100%',
      height: '200px',
      objectFit: 'cover',
      borderRadius: '10px 10px 0 0',
    },
    headerTitle: {

      top: '50%',

      fontSize: '2.5em',
      fontWeight: 'bold',
      textShadow: '2px 2px 5px rgba(0, 0, 0, 0.7)',
    },
    questionContainer: {
      marginBottom: '20px',
      marginTop:'50px',
      border: '1px solid #333',
      borderRadius: '5px',
      padding: '15px',
      backgroundColor: '#2e2e2e',
    },
    questionText: {
      fontWeight: 'bold',
      marginBottom: '10px',
    },
    distractorContainer: {
      marginTop: '5px',
    },
    radioInput: {
      marginRight: '5px',
    },
    label: {
      cursor: 'pointer',
    },
    correctButton: {
      display: 'block',
      margin: '20px auto',
      padding: '10px 20px',
      backgroundColor: '#007bff',
      color: '#fff',
      border: 'none',
      borderRadius: '5px',
      cursor: 'pointer',
    },
    resultText: {
      textAlign: 'center',
      marginTop: '20px',
    },
    link: {
      display: 'block',
      textAlign: 'center',
      marginTop: '20px',
      textDecoration: 'none',
      color: '#007bff',
      fontWeight: 'bold',
    },
  };

  return (
    <>
      <Global
        styles={css`
          body {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
            background-color: #121215;
            color: #E0E0E0;
            font-family: 'Noto Sans', sans-serif;
          }
        `}
      />
      <div style={styles.container}>
        <header style={styles.header}>
          <h1 style={styles.headerTitle}>Quiz pour tester vos connaissances</h1>
          <img src="./dermatologie.jpeg" alt="Quiz Banner" style={styles.headerImage} />
          
        </header>
        {questions.map((question) => (
          <div key={question.id} style={styles.questionContainer}>
            <div style={styles.questionText}>
              <div>Question:</div>
              <div>{question.question}</div>
            </div>
            {question.distractors &&
              question.distractors.map((distractor, distractorIndex) => (
                <div key={distractorIndex} style={styles.distractorContainer}>
                  <input
                    type="radio"
                    id={`distractor-${question.id}-${distractorIndex}`}
                    name={`question-${question.id}`}
                    value={distractor}
                    onChange={() => handleOptionChange(question.id, distractor)}
                    checked={selectedOptions[question.id] === distractor}
                    style={styles.radioInput}
                  />
                  <label
                    htmlFor={`distractor-${question.id}-${distractorIndex}`}
                    style={styles.label}
                  >
                    {distractor}
                  </label>
                </div>
              ))}
          </div>
        ))}
        <button onClick={handleCorrection} style={styles.correctButton}>Corriger</button>
        <p style={styles.resultText}>
          Nombre de réponses correctes : {correctAnswers}/{questions.length}
        </p>
        <Link to="/Correction" style={styles.link}>Retour</Link>
      </div>
    </>
  );
}

export default DisplayQuestions;
