import { motion } from 'framer-motion';

interface ErrorFallbackProps {
  error: Error;
  resetErrorBoundary: () => void;
}

export default function ErrorFallback({ 
  error, 
  resetErrorBoundary 
}: ErrorFallbackProps) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-lg w-full bg-white dark:bg-gray-800 rounded-lg shadow-xl p-8"
      >
        <div className="text-center">
          <h2 className="text-3xl font-bold text-red-600 dark:text-red-400 mb-4">
            Oops! Something went wrong
          </h2>
          
          <div className="bg-red-50 dark:bg-red-900/30 rounded-lg p-4 mb-6">
            <pre className="text-sm text-red-600 dark:text-red-400 whitespace-pre-wrap font-mono">
              {error.message}
            </pre>
          </div>

          <motion.button
            onClick={resetErrorBoundary}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="
              bg-blue-500 text-white px-6 py-3 rounded-lg
              hover:bg-blue-600 transition-colors
              font-medium
            "
          >
            Try again
          </motion.button>

          <p className="mt-4 text-sm text-gray-500 dark:text-gray-400">
            If this error persists, please contact support
          </p>
        </div>
      </motion.div>
    </div>
  );
}
