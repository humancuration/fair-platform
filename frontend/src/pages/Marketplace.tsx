// src/pages/Marketplace.tsx
import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  sellerId: number;
}

const Marketplace: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const { token } = useContext(AuthContext);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get('/api/products', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setProducts(res.data);
      } catch (err) {
        console.error(err);
        alert('Failed to fetch products');
      }
    };
    fetchProducts();
  }, [token]);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl mb-4">Marketplace</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {products.map((product) => (
          <div key={product.id} className="border p-4 rounded shadow">
            <h2 className="text-xl font-bold">{product.name}</h2>
            <p className="mt-2">{product.description}</p>
            <p className="mt-2"><strong>Price:</strong> ${product.price.toFixed(2)}</p>
            <p className="mt-2 text-sm text-gray-500">Includes 2.5% platform fee</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Marketplace;
