import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

const DataTransparencyDashboard: React.FC = () => {
  const [userData, setUserData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get('/api/user/data');
      setUserData(response.data);
    } catch (error) {
      console.error('Error fetching user data:', error);
      toast.error('Failed to fetch user data. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDataDeletion = async (dataType: string) => {
    try {
      await axios.delete(`/api/user/data/${dataType}`);
      toast.success(`${dataType} data deleted successfully`);
      fetchUserData(); // Refresh data after deletion
    } catch (error) {
      console.error('Error deleting data:', error);
      toast.error(`Failed to delete ${dataType} data. Please try again.`);
    }
  };

  if (isLoading) return <div>Loading...</div>;
  if (!userData) return <div>No data available</div>;

  return (
    <div className="data-transparency-dashboard">
      <h2>Your Data on Fair Platform</h2>
      {Object.entries(userData).map(([dataType, data]) => (
        <div key={dataType} className="data-section">
          <h3>{dataType}</h3>
          <pre>{JSON.stringify(data, null, 2)}</pre>
          <button onClick={() => handleDataDeletion(dataType)} className="delete-button">
            Delete {dataType} Data
          </button>
        </div>
      ))}
      <button onClick={() => window.open('/api/user/data/download', '_blank')} className="download-button">
        Download All Data
      </button>
    </div>
  );
};

export default DataTransparencyDashboard;