import React, { useState, useEffect } from 'react';
import { Global, css } from '@emotion/react';

const getRandomChoices = (correctTitle, allTitles) => {
  let incorrectTitles = allTitles.filter(title => title !== correctTitle);
  let choices = [];
  while (choices.length < 3) {
    const randomIndex = Math.floor(Math.random() * incorrectTitles.length);
    if (!choices.includes(incorrectTitles[randomIndex])) {
      choices.push(incorrectTitles[randomIndex]);
    }
  }
  choices.push(correctTitle);
  choices.sort(() => Math.random() - 0.5); 
  return choices;
};

const Quiz = () => {
  const [quizData, setQuizData] = useState([]);
  const [shuffledChoices, setShuffledChoices] = useState({});
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [showResults, setShowResults] = useState(false);
  const [score, setScore] = useState(0);

  useEffect(() => {
    fetch('/data.json')
      .then(response => response.json())
      .then(data => {
        const selectedData = data.sort(() => 0.5 - Math.random()).slice(0, 20);
        setQuizData(selectedData);
        const allTitles = selectedData.map(item => item.title);
        const choices = {};
        selectedData.forEach((question) => {
          choices[question.id] = getRandomChoices(question.title, allTitles);
        });
        setShuffledChoices(choices);
      })
      .catch(error => console.error('Error fetching quiz data:', error));
  }, []);

  if (quizData.length === 0) {
    return <div>Loading...</div>;
  }

  const handleAnswerSelect = (questionId, choice) => {
    setSelectedAnswers({
      ...selectedAnswers,
      [questionId]: choice,
    });
  };

  const handleShowResults = () => {
    let newScore = 0;
    quizData.forEach(question => {
      if (selectedAnswers[question.id] === question.title) {
        newScore++;
      }
    });
    setScore(newScore);
    setShowResults(true);
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
      fontSize: '2.5em',
      fontWeight: 'bold',
      textShadow: '2px 2px 5px rgba(0, 0, 0, 0.7)',
    },
    questionContainer: {
      marginBottom: '20px',
      marginTop: '50px',
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
  };

  return (
    <>
      {/* Global styles */}
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
          <h1 style={styles.headerTitle}>Quiz</h1>
        </header>
        {quizData.map((question, index) => {
          const choices = shuffledChoices[question.id];
          return (
            <div key={index} style={styles.questionContainer}>
              <img src={question.url} alt={`Question ${index + 1}`} style={{ borderRadius: '10px' , width:'300px', height:'300px'}} />
              <div style={styles.questionText}>{question.question}</div>
              <form>
                {choices.map((choice, idx) => (
                  <div key={idx} style={styles.distractorContainer}>
                    <input
                      type="radio"
                      id={`question-${index}-choice-${idx}`}
                      name={`question-${index}`}
                      value={choice}
                      checked={selectedAnswers[question.id] === choice}
                      onChange={() => handleAnswerSelect(question.id, choice)}
                      disabled={showResults}
                      style={styles.radioInput}
                    />
                    <label htmlFor={`question-${index}-choice-${idx}`} style={styles.label}>{choice}</label>
                  </div>
                ))}
              </form>
            </div>
          );
        })}
        <button onClick={handleShowResults} style={styles.correctButton}>Corriger</button>
        {showResults && (
          <div style={styles.resultText}>
            <p>Votre score est : {score} sur {quizData.length}</p>
          </div>
        )}
      </div>
    </>
  );
};

export default Quiz;