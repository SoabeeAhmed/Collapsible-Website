import React, { useState, useEffect } from 'react';
import SubComponent from './SubComponent';

const Component = ({ componentId, jsonFile }) => {
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [empId, setEmpId] = useState('');
  const [subheading, setSubheading] = useState('');

  useEffect(() => {
    const loadQuestions = async () => {
      try {
        const questionsModule = await import(`../assets/${jsonFile}.json`);
        
        // Ensure `questions` exists in the loaded JSON
        if (questionsModule.default && Array.isArray(questionsModule.default.questions)) {
          setQuestions(questionsModule.default.questions);
          setSubheading(questionsModule.default.subheading || '');
        } else {
          console.error('Invalid JSON structure: "questions" array missing');
        }
      } catch (error) {
        console.error('Error loading questions:', error);
      }
    };

    loadQuestions();
  }, [jsonFile]);

  const handleAnswerChange = (questionId, answer) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: answer
    }));
  };

  const handleSubmit = () => {
    if (empId.length !== 5) {
      alert('Please enter a 5-character Employee ID');
      return;
    }

    const submissionData = {
      empId,
      componentId,
      subheading,
      answers
    };

    console.log('Submission Data:', submissionData);
    localStorage.setItem(`submission_${componentId}_${jsonFile}`, JSON.stringify(submissionData));
  };

  return (
    <div className="component-questions">
      {questions.length > 0 ? (
        questions.map((question, index) => (
          <SubComponent 
            key={index}
            question={question}
            onAnswerChange={handleAnswerChange}
          />
        ))
      ) : (
        <p>Loading questions...</p>
      )}
      <input 
        type="text" 
        placeholder="Enter 5-character Employee ID" 
        maxLength="5"
        className="emp-id-input"
        value={empId}
        onChange={(e) => setEmpId(e.target.value)}
      />
      <button 
        className="submit-button"
        onClick={handleSubmit}
      >
        Submit
      </button>
      
    </div>
  );
};

export default Component;