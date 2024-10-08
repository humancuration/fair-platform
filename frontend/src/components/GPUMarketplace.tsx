import React, { useState, useEffect } from 'react';
import axios from 'axios';

interface GPUListing {
  id: string;
  name: string;
  specs: string;
  pricePerHour: number;
}

const GPUMarketplace: React.FC = () => {
  const [listings, setListings] = useState<GPUListing[]>([]);

  useEffect(() => {
    fetchListings();
  }, []);

  const fetchListings = async () => {
    try {
      const response = await axios.get('/api/gpu-listings');
      setListings(response.data);
    } catch (error) {
      console.error('Failed to fetch GPU listings', error);
    }
  };

  const rentGPU = async (id: string) => {
    try {
      await axios.post(`/api/rent-gpu/${id}`);
      alert('GPU rented successfully!');
    } catch (error) {
      console.error('Failed to rent GPU', error);
    }
  };

  return (
    <div>
      <h2>GPU Marketplace</h2>
      {listings.map((listing) => (
        <div key={listing.id}>
          <h3>{listing.name}</h3>
          <p>{listing.specs}</p>
          <p>Price: ${listing.pricePerHour}/hour</p>
          <button onClick={() => rentGPU(listing.id)}>Rent</button>
        </div>
      ))}
    </div>
  );
};

export default GPUMarketplace;