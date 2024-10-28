import React from 'react';

const LinkDiscord: React.FC = () => {
  const handleDiscordLink = () => {
    window.location.href = `${process.env.REACT_APP_API_BASE_URL}/auth/discord`;
  };

  return (
    <button
      onClick={handleDiscordLink}
      className="bg-blue-600 text-white px-4 py-2 rounded flex items-center"
    >
      <svg
        className="w-5 h-5 mr-2"
        viewBox="0 0 71 55"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M60.104 4.557A58.976 58.976 0 0 0 35.5 0C16.076 0 .153 15.252.153 33.836a59.66 59.66 0 0 0 4.067 20.657L35.5 55l31.28-0.507a59.662 59.662 0 0 0 4.67-20.34C70.846 15.245 54.925 0 35.5 0c-0.39 0-0.78 0.002-1.17 0.006A58.964 58.964 0 0 0 60.104 4.557zM23.476 41.143c-3.04 0-5.46-2.42-5.46-5.4s2.42-5.4 5.46-5.4c3.04 0 5.46 2.42 5.46 5.4s-2.42 5.4-5.46 5.4zm24.048 0c-3.04 0-5.46-2.42-5.46-5.4s2.42-5.4 5.46-5.4c3.04 0 5.46 2.42 5.46 5.4s-2.42 5.4-5.46 5.4z"
          fill="currentColor"
        />
      </svg>
      Link Discord Account
    </button>
  );
};

export default LinkDiscord;