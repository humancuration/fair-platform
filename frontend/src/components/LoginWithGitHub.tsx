import React from 'react';

const LoginWithGitHub: React.FC = () => {
  const handleGitHubLogin = () => {
    window.location.href = `${process.env.REACT_APP_API_BASE_URL}/auth/github`;
  };

  return (
    <button
      onClick={handleGitHubLogin}
      className="bg-gray-800 text-white px-4 py-2 rounded flex items-center"
    >
      <svg
        className="w-5 h-5 mr-2"
        fill="currentColor"
        viewBox="0 0 24 24"
      >
        {/* GitHub Icon SVG Path */}
        <path
          fillRule="evenodd"
          d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577
          0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61-.546-1.387-1.333-1.756-1.333-1.756-1.089-.744.084-.729.084-.729
          1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.42-1.305.762-1.605-2.665-.3-5.466-1.332-5.466-5.93
          0-1.31.468-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23a11.5 11.5 0 013.003-.404c1.02.005
          2.045.138 3.003.404 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.77.84 1.23 1.91 1.23 3.22
          0 4.61-2.805 5.625-5.475 5.92.435.373.81 1.102.81 2.222 0 1.606-.015 2.896-.015 3.286
          0 .32.21.694.825.576C20.565 21.796 24 17.3 24 12c0-6.63-5.37-12-12-12z"
          clipRule="evenodd"
        />
      </svg>
      Login with GitHub
    </button>
  );
};

export default LoginWithGitHub;