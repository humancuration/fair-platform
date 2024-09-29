import React, { useState, useEffect } from 'react';
import './PollWidget.css';

const PollWidget = ({ question, options }) => {
  const [votes, setVotes] = useState({});
  const [voted, setVoted] = useState(false);

  useEffect(() => {
    const initialVotes = options.reduce((acc, option) => {
      acc[option] = Math.floor(Math.random() * 10); // Random initial votes
      return acc;
    }, {});
    setVotes(initialVotes);
  }, [options]);

  const handleVote = (option) => {
    if (!voted) {
      setVotes(prev => ({ ...prev, [option]: prev[option] + 1 }));
      setVoted(true);
    }
  };

  const totalVotes = Object.values(votes).reduce((sum, count) => sum + count, 0);

  return (
    <div className="poll-widget">
      <h3>{question}</h3>
      {options.map(option => {
        const percent = totalVotes ? ((votes[option] / totalVotes) * 100).toFixed(1) : 0;
        return (
          <button 
            key={option}
            onClick={() => handleVote(option)} 
            disabled={voted}
            className="poll-option"
          >
            <span className="option-text">{option}</span>
            <div className="progress-bar" style={{ width: `${percent}%` }}></div>
            <span className="percent">{percent}%</span>
          </button>
        );
      })}
      <p className="total-votes">Total votes: {totalVotes}</p>
    </div>
  );
};

export default PollWidget;
