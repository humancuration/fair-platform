import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import Button from './common/Button';
import LoadingSpinner from './common/LoadingSpinner';

const DataTransparencyDashboard: React.FC = () => {
  const [userData, setUserData] = useState<Record<string, any> | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchUserData = useCallback(async () => {
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
  }, []);

  useEffect(() => {
    fetchUserData();
  }, [fetchUserData]);

  const handleDataDeletion = useCallback(async (dataType: string) => {
    try {
      await axios.delete(`/api/user/data/${dataType}`);
      toast.success(`${dataType} data deleted successfully`);
      fetchUserData();
    } catch (error) {
      console.error('Error deleting data:', error);
      toast.error(`Failed to delete ${dataType} data. Please try again.`);
    }
  }, [fetchUserData]);

  if (isLoading) return <LoadingSpinner />;
  if (!userData) return <div>No data available</div>;

  return (
    <div className="data-transparency-dashboard">
      <h2 className="text-2xl font-bold mb-4">Your Data on Fair Platform</h2>
      {Object.entries(userData).map(([dataType, data]) => (
        <div key={dataType} className="data-section mb-4 p-4 border rounded">
          <h3 className="text-xl font-semibold mb-2">{dataType}</h3>
          <pre className="bg-gray-100 p-2 rounded overflow-x-auto">{JSON.stringify(data, null, 2)}</pre>
          <Button 
            onClick={() => handleDataDeletion(dataType)} 
            className="mt-2 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition-colors duration-200"
          >
            Delete {dataType} Data
          </Button>
        </div>
      ))}
      <Button 
        onClick={() => window.open('/api/user/data/download', '_blank')} 
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors duration-200"
      >
        Download All Data
      </Button>
    </div>
  );
};

export default React.memo(DataTransparencyDashboard);