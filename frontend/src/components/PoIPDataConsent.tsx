import React, { useState, useEffect } from 'react';
import axios from 'axios';

const PoIPDataConsent: React.FC = () => {
  const [consent, setConsent] = useState({
    allowImpactTracking: false,
    shareAnonymizedData: false,
  });

  useEffect(() => {
    fetchConsent();
  }, []);

  const fetchConsent = async () => {
    const response = await axios.get('/api/user/poip-consent');
    setConsent(response.data);
  };

  const handleConsentChange = async (setting: string, value: boolean) => {
    try {
      await axios.patch('/api/user/poip-consent', { [setting]: value });
      setConsent(prev => ({ ...prev, [setting]: value }));
    } catch (error) {
      console.error('Error updating PoIP consent:', error);
    }
  };

  return (
    <div className="poip-data-consent">
      <h2>Proof of Impact Protocol (PoIP) Data Usage</h2>
      <p>
        The PoIP system uses data to measure and verify the impact of your actions on the platform.
        This helps in fair distribution of rewards and recognition.
      </p>
      <div className="consent-item">
        <label>
          <input
            type="checkbox"
            checked={consent.allowImpactTracking}
            onChange={(e) => handleConsentChange('allowImpactTracking', e.target.checked)}
          />
          Allow tracking of my actions for impact measurement
        </label>
      </div>
      <div className="consent-item">
        <label>
          <input
            type="checkbox"
            checked={consent.shareAnonymizedData}
            onChange={(e) => handleConsentChange('shareAnonymizedData', e.target.checked)}
          />
          Allow sharing of my anonymized impact data for research and platform improvement
        </label>
      </div>
    </div>
  );
};

export default PoIPDataConsent;