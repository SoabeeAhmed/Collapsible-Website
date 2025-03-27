import React from 'react';

const SubComponent = ({ question, onAnswerChange }) => {
  const handleRadioChange = (e) => {
    onAnswerChange(question.id, parseInt(e.target.value));
  };

  return (
    <div className="subcomponent">
      <p>{question.question}</p>
      <div className="radio-group">
        {question.options.map((option) => (
          <label key={option}>
            <input
              type="radio"
              name={`question-${question.id}`}
              value={option}
              onChange={handleRadioChange}
            />
            {option}
            
          </label>
        ))}
      </div>
    </div>
  );
};

export default SubComponent;