import React from 'react';

const SubComponent = ({ question, questionId, onAnswerChange, selectedAnswer }) => {
  return (
    <div className="subcomponent">
      <p className="subcomponent-question">{question.question}</p>
      <div className='radio-group'>
        {question.options.map((option, index) => (
          <label key={index}>
            <input
              type="radio"
              name={`question-${question.subheading}-${question.id}`}  // Ensure name is unique to each question
              value={option}
              checked={selectedAnswer === option}
              onChange={() => onAnswerChange(questionId, option)} // Updates the answer when changed
            />
            {option}
          </label>
        ))}
      </div>
    </div>
  );
};

export default SubComponent;
