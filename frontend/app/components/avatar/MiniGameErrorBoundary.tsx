import { useEffect } from "react";
import type { FallbackProps } from "react-error-boundary";

export function MiniGameErrorBoundary({ error, resetErrorBoundary }: FallbackProps) {
  useEffect(() => {
    // Log error to your error reporting service
    console.error("MiniGame Error:", error);
  }, [error]);

  return (
    <div className="mt-4 p-4 border rounded-lg bg-red-50">
      <h3 className="text-lg font-bold text-red-700">Mini-Game Error</h3>
      <p className="text-red-600 mt-2">
        Oops! The game encountered an error. Please try again.
      </p>
      <button
        onClick={resetErrorBoundary}
        className="mt-2 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
      >
        Restart Game
      </button>
    </div>
  );
}
