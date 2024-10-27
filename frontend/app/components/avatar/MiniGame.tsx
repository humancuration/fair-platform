import { useState, useEffect } from "react";
import { useFetcher } from "@remix-run/react";
import { ErrorBoundary } from "react-error-boundary";
import { MiniGameErrorBoundary } from "./MiniGameErrorBoundary";

interface MiniGameProps {
  userId: string;
}

function MiniGameContent({ userId }: MiniGameProps) {
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [isPlaying, setIsPlaying] = useState(false);
  const fetcher = useFetcher();

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
    fetcher.submit(
      { 
        intent: "saveGameScore",
        score: score.toString() 
      },
      { method: "POST" }
    );
  };

  const incrementScore = () => {
    if (isPlaying) {
      setScore(prev => prev + 1);
    }
  };

  return (
    <div className="mt-4 p-4 border rounded-lg">
      <h3 className="text-lg font-bold">Mini-Game: Click Challenge</h3>
      {!isPlaying ? (
        <button 
          onClick={startGame} 
          className="bg-blue-500 text-white px-4 py-2 rounded mt-2 hover:bg-blue-600 transition-colors"
        >
          Start Game
        </button>
      ) : (
        <div className="space-y-2">
          <p className="text-lg">Time left: {timeLeft} seconds</p>
          <p className="text-lg font-bold">Score: {score}</p>
          <button 
            onClick={incrementScore} 
            className="bg-green-500 text-white px-4 py-2 rounded mt-2 w-full hover:bg-green-600 transition-colors transform active:scale-95"
          >
            Click Me!
          </button>
        </div>
      )}
    </div>
  );
}

export function MiniGame(props: MiniGameProps) {
  return (
    <ErrorBoundary
      FallbackComponent={MiniGameErrorBoundary}
      onReset={() => {
        // Reset the game state when recovering from an error
        window.location.reload();
      }}
    >
      <MiniGameContent {...props} />
    </ErrorBoundary>
  );
}
