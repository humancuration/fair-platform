import React, { useState, useEffect } from 'react';

const VirtualPet = ({ userActivity }) => {
  const [mood, setMood] = useState('happy');
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
    localStorage.setItem('petAge', age);
    localStorage.setItem('petLastInteraction', lastInteraction);
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

  // Interactions
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

  // Determine pet's appearance based on age
  const getPetStage = () => {
    if (age < 7) return 'baby';
    if (age < 14) return 'teen';
    return 'adult';
  };

  // Seasonal appearance (e.g., special looks during holidays)
  const getSeasonalSuffix = () => {
    const month = new Date().getMonth();
    if (month === 11 || month === 0) return '_winter'; // December or January
    if (month === 5 || month === 6) return '_summer'; // June or July
    return '';
  };

  const petImage = `/images/pet_${getPetStage()}_${mood}${getSeasonalSuffix()}.png`;

  return (
    <div
      onClick={handlePlay}
      style={{
        cursor: 'pointer',
        position: 'fixed',
        bottom: '20px',
        right: '20px',
        textAlign: 'center',
      }}
    >
      <img src={petImage} alt="Virtual Pet" />
      <div>
        <button onClick={handleFeed}>Feed</button>
        <button onClick={handlePlay}>Play</button>
      </div>
    </div>
  );
};

export default VirtualPet;
