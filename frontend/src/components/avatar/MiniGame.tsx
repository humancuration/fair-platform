import React, { useState, useEffect } from 'react';
import api from '../../api/api';

const MiniGame: React.FC<{ userId: string }> = ({ userId }) => {
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isPlaying && timeLeft > 0) {
      timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
    } else if (timeLeft === 0) {
      endGame();
    }
    return () => clearTimeout(timer);
  }, [isPlaying, timeLeft]);

  const startGame = () => {
    setIsPlaying(true);
    setScore(0);
    setTimeLeft(30);
  };

  const endGame = async () => {
    setIsPlaying(false);
    try {
      await api.post(`/mini-game/${userId}/score`, { score });
      // You might want to update the UI or show a success message here
    } catch (error) {
      console.error('Error saving score:', error);
    }
  };

  const incrementScore = () => {
    if (isPlaying) {
      setScore(score + 1);
    }
  };

  return (
    <div className="mt-4">
      <h3 className="text-lg font-bold">Mini-Game: Click Challenge</h3>
      {!isPlaying ? (
        <button onClick={startGame} className="bg-blue-500 text-white px-4 py-2 rounded mt-2">
          Start Game
        </button>
      ) : (
        <div>
          <p>Time left: {timeLeft} seconds</p>
          <p>Score: {score}</p>
          <button onClick={incrementScore} className="bg-green-500 text-white px-4 py-2 rounded mt-2">
            Click Me!
          </button>
        </div>
      )}
    </div>
  );
};

export default MiniGame;
