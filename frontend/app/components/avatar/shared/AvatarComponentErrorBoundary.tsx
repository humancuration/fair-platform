import type { FallbackProps } from "react-error-boundary";

interface AvatarComponentErrorProps extends FallbackProps {
  componentName: string;
}

export function AvatarComponentErrorBoundary({ 
  error, 
  resetErrorBoundary, 
  componentName 
}: AvatarComponentErrorProps) {
  return (
    <div className="p-4 border rounded-lg bg-red-50">
      <h3 className="text-lg font-bold text-red-700">{componentName} Error</h3>
      <p className="text-red-600 mt-2">
        {error instanceof Error ? error.message : "An unexpected error occurred"}
      </p>
      <button
        onClick={resetErrorBoundary}
        className="mt-2 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
      >
        Try Again
      </button>
    </div>
  );
}
