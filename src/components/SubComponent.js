import React from 'react';

const SubComponent = ({ question, questionId, onAnswerChange, selectedAnswer }) => {
  return (
    <div className="subcomponent">
      <p>{question.question}</p>
      <div className='radio-group'>
      {question.options.map((option, index) => (
        <label key={index}>
          <input
            type="radio"
            name={`question_${questionId}`} 
            value={option}
            checked={selectedAnswer === option}
            onChange={() => onAnswerChange(questionId, option)}
          />
          {option}
        </label>
      ))}
      </div>
    </div>
  );
};

export default SubComponent;
