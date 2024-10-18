import React from 'react';

interface MoodSelectorProps {
  currentMood: string;
  onMoodChange: (mood: string) => void;
}

const moods = ['happy', 'sad', 'excited', 'angry', 'neutral'];

const MoodSelector: React.FC<MoodSelectorProps> = ({ currentMood, onMoodChange }) => {
  return (
    <div className="mt-4">
      <h3 className="text-lg font-bold">Avatar Mood</h3>
      <div className="flex space-x-2 mt-2">
        {moods.map((mood) => (
          <button
            key={mood}
            className={`px-3 py-1 rounded ${
              currentMood === mood ? 'bg-blue-500 text-white' : 'bg-gray-200'
            }`}
            onClick={() => onMoodChange(mood)}
          >
            {mood}
          </button>
        ))}
      </div>
    </div>
  );
};

export default MoodSelector;
