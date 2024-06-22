import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Global, css } from '@emotion/react';
import Menu from './Menu';
import { FaTrash } from 'react-icons/fa';
import { useNavigate } from "react-router-dom"; // Import useNavigate

function Correction() {
  const [setQuestions] = useState([]);
  const [dbqst , setdbqst]= useState([]);
  const [data, setData] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);
  const [newQuestion, setNewQuestion] = useState({ question: '', answer: '', distractors: ['', '', ''] });
  const [formattedQuestions, setFormattedQuestions] = useState([]); 
  const navigate = useNavigate(); // Initialize useNavigate

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/data.json');
        const data = await response.json();
        setData(data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  const handleSubmit = async (description) => {
    try {
      const responseFlask = await axios.post('http://localhost:5000/', [{ text: description }], {
        headers: {
          'Content-Type': 'application/json'
        }
      });

      setFormattedQuestions(prevFormattedQuestions => [
        ...prevFormattedQuestions,
        ...responseFlask.data.map(question => ({
          ...question,
          questionId: Math.floor(Math.random() * 10000)
        }))
      ]);
    } catch (error) {
      console.error('Error sending data:', error);
    }
  };

  const handleDistractorChange = (groupIndex, distractorIndex, newValue) => {
    setFormattedQuestions(prevFormattedQuestions => {
      const updatedQuestions = [...prevFormattedQuestions];
      const updatedDistractors = [...updatedQuestions[groupIndex].distractors];
      updatedDistractors[distractorIndex] = newValue;
      updatedQuestions[groupIndex].distractors = updatedDistractors;
      return updatedQuestions;
    });
  };

  const handleDeleteGeneratedQuestion = (questionId) => {
    setFormattedQuestions(prevFormattedQuestions =>
      prevFormattedQuestions.filter(question => question.questionId !== questionId)
    );
  };

  useEffect(() => {
    const fetchQuestionsFromDB = async () => {
      try {
        const response = await axios.get('http://localhost:5000/validate');
        setdbqst(response.data);
      } catch (error) {
        console.error('Error fetching questions:', error);
      }
    };

    fetchQuestionsFromDB();
  }, []);

const handleDeleteQuestion = async (questionId) => {
  try {
    await axios.delete(`/api/questions/${questionId}`);
    setQuestions(prevQuestions => prevQuestions.filter(question => question.id !== questionId));
    alert('Question supprimée avec succès');
  } catch (error) {
    console.error('Error deleting question:', error);
    alert('Erreur lors de la suppression de la question');
  }
};


  const handleValidation = async () => {
    try {
      await axios.post('http://localhost:5000/validate', formattedQuestions, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      alert('Questions validées avec succès');
      navigate("/dashboard/teacher-app"); // Navigate to /user-list

    } catch (error) {
      console.error('Error validating data:', error);
    }
  };

  const handleSelectItem = (item) => {
    if (!selectedItems.includes(item)) {
      setSelectedItems(prevSelected => [...prevSelected, item]);
    }
  };

  const handleDeselectItem = (item) => {
    setSelectedItems(prevSelected => prevSelected.filter(selected => selected !== item));
  };

  const handleValidateSelection = () => {
    selectedItems.forEach(item => handleSubmit(item.description));
    setSelectedItems([]);
  };

  const handleNewQuestionChange = (field, value) => {
    setNewQuestion(prevNewQuestion => ({
      ...prevNewQuestion,
      [field]: value
    }));
  };

  const handleNewDistractorChange = (index, value) => {
    const newDistractors = [...newQuestion.distractors];
    newDistractors[index] = value;
    setNewQuestion(prevNewQuestion => ({
      ...prevNewQuestion,
      distractors: newDistractors
    }));
  };

  const handleAddNewQuestion = async () => {
    try {
      const fullDistractors = [...newQuestion.distractors, newQuestion.answer];
      const response = await axios.post('http://localhost:5000/add_question', {
        question: newQuestion.question,
        answer: newQuestion.answer,
        distractors: fullDistractors
      }, {
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (response.data.message) {
        alert(response.data.message);

        setQuestions(prevQuestions => [
          ...prevQuestions,
          {
            question: newQuestion.question,
            answer: newQuestion.answer,
            distractors: fullDistractors
          }
        ]);
        setNewQuestion({ question: '', answer: '', distractors: ['', '', ''] });
      } else {
        alert(response.data.error);
      }
    } catch (error) {
      console.error('Error adding question:', error);
    }
  };

  const handleModifyDistractors = (groupIndex) => {
    const { answer, distractors } = formattedQuestions[groupIndex];
    const incorrectDistractors = distractors.filter(distractor => distractor !== answer);
    return (
      <div style={styles.inputGroup}>
        {incorrectDistractors.map((distractor, distractorIndex) => (
          <div key={distractorIndex}>
            <input
              type="text"
              value={distractor}
              onChange={(e) => handleDistractorChange(groupIndex, distractorIndex, e.target.value)}
              style={styles.input} 
            />
          </div>
        ))}
        <label style={styles.labelAnswer}>Réponse : {answer}</label>
      </div>
    );
  };
  
  const styles = {
    container: {
      padding: "0px",
      backgroundColor: '#f5f5f5',
      color: '#121212',
      minHeight: '100vh',
    },
    header: {
      backgroundImage: `linear-gradient(to right, #2682c399, #4a6494b8), url('https://manon.qodeinteractive.com/wp-content/uploads/2019/01/home-8-rev-img-1.png')`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundAttachment: 'fixed',
      backgroundColor: '#f0f0f0',
      padding: '20px',
      maxHeight: '50px',
      color: 'white',
      marginBottom: '30px',
      textAlign: 'center',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    },
    title: {
      fontSize: '1.8em',
      fontWeight: '570',
    },
    flexContainer: {
      padding: '20px',
      margin: '40px',      
      boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)',
      display: 'flex',
      justifyContent: 'space-between',
      flexWrap: 'wrap',
    },
    descriptionContainer: {
      backgroundColor: ' #E0E0E0',
      margin: '20px 0',
      maxHeight: '150px',
      overflowY: 'auto',
      border: '1px solid #ccc',
      padding: '10px',
      borderRadius: '5px',
      width: '45%',
    },
    descriptionText: {
      fontSize: '16px',
      marginBottom: '10px',
    },
    button: {
      padding: '10px 15px',
      fontSize: '14px',
      cursor: 'pointer',
      backgroundColor: 'transparent',
      border: 'none',
    },
    selectedItemContainer: {
      overflowY: 'auto',
      backgroundColor: '#E0E0E0',
      marginTop: '20px',
      padding: '10px',
      border: '1px solid #ccc',
      borderRadius: '5px',
      width: '45%',
      maxHeight: '150px',
    },
    selectedItem: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: '10px',
    },
    formContainer: {
      backgroundColor: '#f5f5f5',
      padding: '20px',
      borderRadius: '5px',
      boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)',
      marginBottom: '20px',
      width: '100%',
    },
    questionContainer: {
      marginBottom: '20px',
    },
    form: {
      backgroundColor: '#fff',
      padding: '10px',
      borderRadius: '5px',
      marginBottom: '10px',
    },
    label: {
      display: 'block',
      fontWeight: 'bold',
      marginBottom: '5px',
    },
    input: {
      padding: '8px',
      maxWidth: '600px',
      marginBottom: '10px',
      border: '1px solid #ccc',
      borderRadius: '5px',
      width: '100%',
    },
    validateButton: {
      padding: '10px 20px',
      fontSize: '16px',
      cursor: 'pointer',
      backgroundColor: '#085492',
      color: 'white',
      border: 'none',
      borderRadius: '5px',
      marginTop: '10px',
    },
    labelAnswer: {
      display: 'block',
      fontWeight: 'bold',
      marginBottom: '5px',
      
    },
    validateSelectionButton: {
      padding: '10px 20px',
      fontSize: '16px',
      cursor: 'pointer',
      backgroundColor: '#085492',
      color: 'white',
      border: 'none',
      borderRadius: '5px',
    },
    addQuestionContainer: {
      backgroundColor: '#f5f5f5',
      padding: '20px',
      borderRadius: '5px',
      boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)',
      marginBottom: '20px',
      width: '100%',
    },
    addQuestionTitle: {
      fontSize: '18px',
      marginBottom: '10px',
    },
    addQuestionButton: {
      padding: '10px 20px',
      fontSize: '16px',
      cursor: 'pointer',
      backgroundColor: '#085492',
      color: 'white',
      border: 'none',
      borderRadius: '5px',
      marginTop: '10px',
    },
    trashButton: {
      cursor: 'pointer',
      color: 'red',
      marginLeft: '5px', 
    },
    tableContainer: {
      backgroundColor: '#fff',
      padding: '20px',
      borderRadius: '5px',
      boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)',
      marginBottom: '20px',
      width: '100%',
    },
    table: {
      width: '100%',
      borderCollapse: 'collapse',
    },
    th: {
      backgroundColor: '#085492',
      color: '#fff',
      padding: '10px',
      textAlign: 'left',
    },
    td: {
      borderBottom: '1px solid #ccc',
      padding: '10px',
    },
  };
  // const combinedQuestions = questions.concat(formattedQuestions);

  return (
    <>
      <Global
        styles={css`
          body {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
            background-color: #E0E0E0;
            color: #121212;
          }
        `}
      />
      <Menu />
      
      <div style={styles.container}>
        <header style={styles.header}>
          <h1 style={styles.title}>Quiz Generator pour les sujets dermatologiques</h1>
        </header>
        <div style={styles.flexContainer}>
          <div style={{ width: '100%' }}>
            <h3>Sujets de quiz :</h3>
          </div>
          <div style={styles.descriptionContainer}>
            {data.map((item, index) => (
              <div key={index} style={styles.selectedItem}>
                <p style={styles.descriptionText}>{item.title}</p>
                <input
                  type="checkbox"
                  onChange={(e) => {
                    if (e.target.checked) {
                      handleSelectItem(item);
                    } else {
                      handleDeselectItem(item);
                    }
                  }}
                />
              </div>
            ))}
          </div>
          {selectedItems.length > 0 && (
            <div style={styles.selectedItemContainer}>
              {selectedItems.map((item, index) => (
                <div key={index} style={styles.selectedItem}>
                  <span>{item.title}</span>
                  <FaTrash style={styles.trashButton} onClick={() => handleDeselectItem(item)} />
                </div>
              ))}
              <button style={styles.validateSelectionButton} onClick={handleValidateSelection}>Valider</button>
            </div>
          )}
        </div>

        {formattedQuestions.length > 0 && (
  <div style={styles.formContainer}>
    {formattedQuestions.map((question, groupIndex) => (
      <div key={groupIndex} style={styles.questionContainer}>
        <form style={styles.form}>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <label style={styles.label}>Question: {question.question}</label>
            <FaTrash
              style={styles.trashButton}
              onClick={() => handleDeleteGeneratedQuestion(question.questionId)}
            />
          </div>


          <div>
            <label>Distracteurs :</label>
            {handleModifyDistractors(groupIndex)}
          </div>
        </form>
      </div>
    ))}
    <button style={styles.validateButton} onClick={handleValidation}>Valider</button>
  </div>
)}

          <div style={styles.addQuestionContainer}>
          <h3 style={styles.addQuestionTitle}>Ajouter une nouvelle question</h3>
          <label style={styles.label}>Question:</label>
          <input
            style={styles.input}
            type="text"
            value={newQuestion.question}
            onChange={(e) => handleNewQuestionChange('question', e.target.value)}
          />
          <label style={styles.label}>Réponse correcte:</label>
          <input
            style={styles.input}
            type="text"
            value={newQuestion.answer}
            onChange={(e) => handleNewQuestionChange('answer', e.target.value)}
          />
          {newQuestion.distractors.map((distractor, index) => (
            <div key={index}>
              <label style={styles.label}>Distracteur {index + 1}:</label>
              <input
                style={styles.input}
                type="text"
                value={distractor}
                onChange={(e) => handleNewDistractorChange(index, e.target.value)}
              />
            </div>
          ))}
          <button style={styles.addQuestionButton} onClick={handleAddNewQuestion}>Ajouter la question</button>
        </div>
        <div style={styles.tableContainer}>
          <h3>Liste des questions</h3>
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>Question</th>
                <th style={styles.th}>Action</th>
              </tr>
            </thead>
            <tbody>
              {dbqst.flat().map((question, index) => (
                <tr key={index}>
                  <td style={styles.td}>{question.question}</td>
                  <td style={styles.td}>
                    <FaTrash style={styles.trashButton} onClick={() => handleDeleteQuestion(question.id)} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}

export default Correction;
