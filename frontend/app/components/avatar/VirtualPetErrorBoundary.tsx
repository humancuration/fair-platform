import type { FallbackProps } from "react-error-boundary";

export function VirtualPetErrorBoundary({ error, resetErrorBoundary }: FallbackProps) {
  return (
    <div className="fixed bottom-5 right-5 text-center p-4 bg-red-50 rounded-lg border border-red-200">
      <p className="text-red-600">
        Your pet is taking a nap (Error occurred)
      </p>
      <button
        onClick={resetErrorBoundary}
        className="mt-2 px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
      >
        Wake Up Pet
      </button>
    </div>
  );
}
