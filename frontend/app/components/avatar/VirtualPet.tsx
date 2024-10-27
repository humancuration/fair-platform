import { useState, useEffect } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { VirtualPetErrorBoundary } from "./VirtualPetErrorBoundary";

interface VirtualPetProps {
  userActivity: number;
}

type PetMood = 'happy' | 'excited' | 'bored' | 'content' | 'playful';
type PetStage = 'baby' | 'teen' | 'adult';

function VirtualPetContent({ userActivity }: VirtualPetProps) {
  const [mood, setMood] = useState<PetMood>('happy');
  const [age, setAge] = useState(0);
  const [lastInteraction, setLastInteraction] = useState(Date.now());

  // Load saved state from localStorage
  useEffect(() => {
    const savedAge = localStorage.getItem('petAge');
    const savedLastInteraction = localStorage.getItem('petLastInteraction');

    if (savedAge) setAge(parseInt(savedAge, 10));
    if (savedLastInteraction) setLastInteraction(parseInt(savedLastInteraction, 10));
  }, []);

  // Save state to localStorage whenever age or lastInteraction changes
  useEffect(() => {
    localStorage.setItem('petAge', age.toString());
    localStorage.setItem('petLastInteraction', lastInteraction.toString());
  }, [age, lastInteraction]);

  // Increase age every day
  useEffect(() => {
    const ageInterval = setInterval(() => {
      setAge((prevAge) => prevAge + 1);
    }, 86400000); // 24 hours in milliseconds

    return () => clearInterval(ageInterval);
  }, []);

  // Update mood based on user activity
  useEffect(() => {
    if (userActivity > 10) {
      setMood('excited');
    } else if (userActivity < 3) {
      setMood('bored');
    } else {
      setMood('happy');
    }
  }, [userActivity]);

  const handleFeed = () => {
    setMood('content');
    setLastInteraction(Date.now());
    setTimeout(() => setMood('happy'), 5000);
  };

  const handlePlay = () => {
    setMood('playful');
    setLastInteraction(Date.now());
    setTimeout(() => setMood('happy'), 5000);
  };

  const getPetStage = (): PetStage => {
    if (age < 7) return 'baby';
    if (age < 14) return 'teen';
    return 'adult';
  };

  const getSeasonalSuffix = (): string => {
    const month = new Date().getMonth();
    if (month === 11 || month === 0) return '_winter'; // December or January
    if (month === 5 || month === 6) return '_summer'; // June or July
    return '';
  };

  const petImage = `/images/pet_${getPetStage()}_${mood}${getSeasonalSuffix()}.png`;

  return (
    <div
      onClick={handlePlay}
      className="fixed bottom-5 right-5 text-center cursor-pointer"
    >
      <img 
        src={petImage} 
        alt="Virtual Pet" 
        className="w-24 h-24 object-contain transition-transform hover:scale-110"
      />
      <div className="flex gap-2 mt-2">
        <button 
          onClick={(e) => {
            e.stopPropagation();
            handleFeed();
          }}
          className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
        >
          Feed
        </button>
        <button 
          onClick={(e) => {
            e.stopPropagation();
            handlePlay();
          }}
          className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600 transition-colors"
        >
          Play
        </button>
      </div>
    </div>
  );
}

export function VirtualPet(props: VirtualPetProps) {
  return (
    <ErrorBoundary
      FallbackComponent={VirtualPetErrorBoundary}
      onReset={() => {
        // Reset the pet's state when recovering from an error
        localStorage.removeItem('petAge');
        localStorage.removeItem('petLastInteraction');
        window.location.reload();
      }}
    >
      <VirtualPetContent {...props} />
    </ErrorBoundary>
  );
}
