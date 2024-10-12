import React from 'react';

interface ProductCardProps {
  productId: string;
  productName: string;
  productImage: string;
  price: string;
  handleFollowProduct: (id: string) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ productId, productName, productImage, price, handleFollowProduct }) => {
  return (
    <div className="product-card">
      <img src={productImage} alt={productName} />
      <h4>{productName}</h4>
      <p>{price}</p>
      <svg className="icon follow-product" viewBox="0 0 64 64" onClick={() => handleFollowProduct(productId)}>
        <circle cx="32" cy="32" r="30" stroke="#FF6F61" strokeWidth="4" fill="none" />
      </svg>
    </div>
  );
};

export default ProductCard;
