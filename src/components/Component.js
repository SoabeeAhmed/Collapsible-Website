import React, { useState, useEffect } from 'react';
import SubComponent from './SubComponent';

const Component = ({ componentTitle, jsonFile, answers, setAnswers, subheading, setSubheading }) => {
  const [questions, setQuestions] = useState([]);

  useEffect(() => {
    const loadQuestions = async () => {
      try {
        const questionsModule = await import(`../assets/${jsonFile}.json`);
        
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
  }, [jsonFile, setSubheading]);

  const handleAnswerChange = (questionId, answer) => {
    setAnswers(prev => ({
      ...prev,
      [`${componentTitle}_${subheading}_${questionId}`]: answer
    }));
  };

  return (
    <div className="component-questions">
      {/* <h3>{subheading}</h3> */}
      {questions.length > 0 ? (
        questions.map((question, index) => (
          <SubComponent 
            key={index}
            question={question}
            questionId={index}
            onAnswerChange={handleAnswerChange}
            selectedAnswer={answers[`${componentTitle}_${subheading}_${index}`] || ""}
          />
        ))
      ) : (
        <p>Loading questions...</p>
      )}
    </div>
  );
};

export default Component;
