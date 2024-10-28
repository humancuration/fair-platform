import React, { useState, useEffect } from 'react';
import api from '@/utils/api';
import { toast } from 'react-toastify';

interface Resource {
  id: string;
  name: string;
  description: string;
  price: number;
  owner: string;
}

const GroupResourceMarketplace: React.FC<{ groupId: string }> = ({ groupId }) => {
  const [resources, setResources] = useState<Resource[]>([]);

  useEffect(() => {
    const fetchResources = async () => {
      try {
        const response = await api.get(`/groups/${groupId}/marketplace`);
        setResources(response.data);
      } catch (error) {
        console.error('Error fetching resources:', error);
        toast.error('Failed to load marketplace resources.');
      }
    };

    fetchResources();
  }, [groupId]);

  const handlePurchase = async (resourceId: string) => {
    try {
      await api.post(`/groups/${groupId}/marketplace/purchase`, { resourceId });
      toast.success('Resource purchased successfully!');
      // Refresh resources after purchase
      const response = await api.get(`/groups/${groupId}/marketplace`);
      setResources(response.data);
    } catch (error) {
      console.error('Error purchasing resource:', error);
      toast.error('Failed to purchase resource.');
    }
  };

  return (
    <div className="bg-white shadow-md rounded-lg p-6">
      <h2 className="text-2xl font-bold mb-4">Resource Marketplace</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {resources.map((resource) => (
          <div key={resource.id} className="border rounded-lg p-4">
            <h3 className="text-xl font-semibold">{resource.name}</h3>
            <p className="text-gray-600">{resource.description}</p>
            <p className="text-lg font-medium mt-2">Price: {resource.price} credits</p>
            <p className="text-sm text-gray-500">Offered by: {resource.owner}</p>
            <button
              onClick={() => handlePurchase(resource.id)}
              className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition duration-300"
            >
              Purchase
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default GroupResourceMarketplace;
