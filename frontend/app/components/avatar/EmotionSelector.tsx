interface EmotionSelectorProps {
  currentEmotion: string;
  currentIntensity: number;
  onEmotionChange: (emotion: string, intensity: number) => void;
}

const emotions = ['happy', 'sad', 'angry', 'surprised', 'neutral'] as const;
type Emotion = typeof emotions[number];

export function EmotionSelector({ 
  currentEmotion, 
  currentIntensity, 
  onEmotionChange 
}: EmotionSelectorProps) {
  return (
    <div className="mt-4">
      <h3 className="text-lg font-bold">Avatar Emotion</h3>
      <div className="flex flex-wrap gap-2 mt-2">
        {emotions.map((emotion) => (
          <button
            key={emotion}
            className={`px-3 py-1 rounded transition-colors ${
              currentEmotion === emotion 
                ? 'bg-blue-500 text-white' 
                : 'bg-gray-200 hover:bg-gray-300'
            }`}
            onClick={() => onEmotionChange(emotion, currentIntensity)}
          >
            {emotion}
          </button>
        ))}
      </div>
      <div className="mt-2">
        <label htmlFor="intensity" className="block text-sm font-medium text-gray-700">
          Intensity: {currentIntensity}
        </label>
        <input
          type="range"
          id="intensity"
          min="1"
          max="10"
          value={currentIntensity}
          onChange={(e) => onEmotionChange(currentEmotion, parseInt(e.target.value, 10))}
          className="mt-1 block w-full"
        />
      </div>
    </div>
  );
}
