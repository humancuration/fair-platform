<div className="product-card">
  <img src={productImage} alt={productName} />
  <h4>{productName}</h4>
  <p>{price}</p>
  <svg className="icon follow-product" viewBox="0 0 64 64" onClick={() => handleFollowProduct(productId)}>
    <circle cx="32" cy="32" r="30" stroke="#FF6F61" stroke-width="4" fill="none" />
  </svg>
</div>
