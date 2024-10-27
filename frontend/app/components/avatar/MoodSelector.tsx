interface MoodSelectorProps {
  currentMood: string;
  onMoodChange: (mood: string) => void;
}

const moods = ['happy', 'sad', 'excited', 'angry', 'neutral'] as const;
type Mood = typeof moods[number];

export function MoodSelector({ currentMood, onMoodChange }: MoodSelectorProps) {
  return (
    <div className="mt-4">
      <h3 className="text-lg font-bold">Avatar Mood</h3>
      <div className="flex flex-wrap gap-2 mt-2">
        {moods.map((mood) => (
          <button
            key={mood}
            className={`px-3 py-1 rounded transition-colors ${
              currentMood === mood 
                ? 'bg-blue-500 text-white' 
                : 'bg-gray-200 hover:bg-gray-300'
            }`}
            onClick={() => onMoodChange(mood)}
          >
            {mood}
          </button>
        ))}
      </div>
    </div>
  );
}
