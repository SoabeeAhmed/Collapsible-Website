import React from 'react';

const SubComponent = ({ question, questionId, onAnswerChange, selectedAnswer }) => {
  return (
    <div className="subcomponent">
      <p className="subcomponent-question">
        {question.question}
        <span className="required-asterisk"> *</span>
      </p>
      <div className="radio-group">
        {question.options.map((option, index) => (
          <label key={index}>
            <input
              type="radio"
              name={`question-${question.subheading}-${question.id}`}
              value={option}
              checked={selectedAnswer === option}
              onChange={() => onAnswerChange(questionId, option)}
              required={index === 0} 
            />
            {option}
          </label>
        ))}
      </div>
    </div>
  );
};

export default SubComponent;
