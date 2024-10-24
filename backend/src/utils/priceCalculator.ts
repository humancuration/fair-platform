import { Product } from '../modules/marketplace/Product';

interface BundleProductInput {
  productId: string;
  quantity: number;
}

interface PriceCalculation {
  totalPrice: number;
  discountedPrice: number;
}

/**
 * Calculates the total and discounted prices for a bundle of products
 * @param products - Array of Product entities
 * @param bundleProducts - Array of bundle product inputs with quantities
 * @returns Object containing totalPrice and discountedPrice
 */
export const calculateBundlePrice = (
  products: Product[],
  bundleProducts: BundleProductInput[]
): PriceCalculation => {
  // Calculate total price without any discounts
  const totalPrice = products.reduce((sum, product) => {
    const bundleProduct = bundleProducts.find(
      bp => bp.productId === product.id
    );
    const quantity = bundleProduct?.quantity || 0;
    return sum + (product.price * quantity);
  }, 0);

  // For now, apply a simple 10% discount
  // This can be modified later to handle more complex discount logic
  const discountedPrice = totalPrice * 0.9;

  return {
    totalPrice,
    discountedPrice: Math.round(discountedPrice * 100) / 100 // Round to 2 decimal places
  };
};
