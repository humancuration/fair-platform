import { AIDJExperience } from '~/components/radio/AIDJExperience';
import { useAcousticSimulation } from '../hooks/useAcousticSimulation';
import { useQuantumState } from '../hooks/useQuantumState';

interface AIDJVenueProps {
  zoneId: string;
  crowdEnergy: number;
  musicIntensity: number;
}

export function AIDJVenueIntegration({ zoneId, crowdEnergy, musicIntensity }: AIDJVenueProps) {
  const acousticSim = useAcousticSimulation();
  const quantumState = useQuantumState();

  // Create a specialized DJ personality for venue zones
  const venueDJPersonality = {
    name: "Quantum DJ",
    style: "energetic",
    genre: ["electronic", "ambient", "quantum"],
    voiceId: "quantum-voice-1",
    commentary: {
      transitions: [
        "Shifting realities through sound...",
        "Feel the quantum resonance...",
        "Let's synchronize our consciousness..."
      ],
      songIntros: [
        "This frequency will elevate our collective vibration...",
        "A sonic journey through dimensions...",
        "Harmonizing with the universal rhythm..."
      ],
      crowdHype: [
        "The energy field is intensifying!",
        "Reality is becoming fluid!",
        "We're reaching quantum coherence!"
      ]
    }
  };

  return (
    <div className="venue-dj-integration">
      <AIDJExperience 
        personality={venueDJPersonality}
        acousticSimulation={acousticSim}
        quantumState={quantumState}
        crowdEnergy={crowdEnergy}
        musicIntensity={musicIntensity}
      />
    </div>
  );
}
