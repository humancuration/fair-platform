import React, { useState } from 'react';
import { useQuery } from 'react-query';
import axios from 'axios';
import { Product } from '../../../types/Product';

interface ProductSelectorProps {
  onSelect: (products: Product[]) => void;
  maxProducts?: number;
}

const ProductSelector: React.FC<ProductSelectorProps> = ({ 
  onSelect, 
  maxProducts = Infinity 
}) => {
  const [selectedProducts, setSelectedProducts] = useState<Product[]>([]);
  const [search, setSearch] = useState('');

  const { data: products, isLoading } = useQuery<Product[]>(
    ['products', search],
    () => axios.get(`/api/products/search?q=${search}`).then(res => res.data)
  );

  const handleProductToggle = (product: Product) => {
    if (selectedProducts.find(p => p.id === product.id)) {
      setSelectedProducts(selectedProducts.filter(p => p.id !== product.id));
    } else if (selectedProducts.length < maxProducts) {
      setSelectedProducts([...selectedProducts, product]);
    }
  };

  const handleConfirm = () => {
    onSelect(selectedProducts);
  };

  return (
    <div className="p-4">
      <input
        type="text"
        placeholder="Search products..."
        className="w-full p-2 border rounded mb-4"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {isLoading ? (
        <div>Loading products...</div>
      ) : (
        <div className="grid grid-cols-2 gap-4 mb-4">
          {products?.map(product => (
            <div
              key={product.id}
              className={`p-2 border rounded cursor-pointer ${
                selectedProducts.find(p => p.id === product.id) 
                  ? 'border-blue-500 bg-blue-50' 
                  : ''
              }`}
              onClick={() => handleProductToggle(product)}
            >
              <img 
                src={product.image} 
                alt={product.name} 
                className="w-full h-24 object-cover mb-2"
              />
              <p className="font-medium">{product.name}</p>
              <p className="text-sm text-gray-600">${product.price}</p>
            </div>
          ))}
        </div>
      )}

      <button
        onClick={handleConfirm}
        className="w-full bg-blue-500 text-white py-2 rounded"
        disabled={selectedProducts.length === 0}
      >
        Add Selected Products
      </button>
    </div>
  );
};

export default ProductSelector;
