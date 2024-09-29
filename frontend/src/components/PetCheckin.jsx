// Example for checking biweekly login
useEffect(() => {
  const lastCheckIn = localStorage.getItem('lastCheckIn');
  const now = Date.now();

  if (!lastCheckIn || now - parseInt(lastCheckIn, 10) > 1209600000) { // 14 days in ms
    // Unlock new features
    // e.g., add new shape to unlockedShapes or new accessory
    unlockedShapes.push('triangle');
    accessories.push('hat');
    localStorage.setItem('lastCheckIn', now);
  }
}, []);
