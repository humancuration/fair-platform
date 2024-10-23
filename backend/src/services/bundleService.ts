import { Bundle, BundleProduct } from '../modules/marketplace/Bundle';
import { Product } from '../modules/marketplace/Product';
import { Transaction } from 'sequelize';
import { calculateBundlePrice } from '../utils/priceCalculator';
import { NotFoundError, ValidationError } from '../utils/errors';

export class BundleService {
  async createBundle(bundleData: any, transaction?: Transaction) {
    const products = await Product.findAll({
      where: { id: bundleData.products.map((p: any) => p.productId) },
    });

    if (products.length !== bundleData.products.length) {
      throw new NotFoundError('Some products were not found');
    }

    // Calculate total and discounted prices
    const { totalPrice, discountedPrice } = calculateBundlePrice(
      products,
      bundleData.products
    );

    const bundle = await Bundle.create(
      {
        ...bundleData,
        totalPrice,
        discountedPrice,
      },
      { transaction }
    );

    // Create bundle products
    await Promise.all(
      bundleData.products.map((product: any) =>
        BundleProduct.create(
          {
            bundleId: bundle.id,
            ...product,
          },
          { transaction }
        )
      )
    );

    return bundle;
  }

  async validateBundleAvailability(bundleId: string) {
    const bundle = await Bundle.findByPk(bundleId, {
      include: [{ model: BundleProduct, include: [Product] }],
    });

    if (!bundle) {
      throw new NotFoundError('Bundle not found');
    }

    const now = new Date();
    if (now < bundle.validFrom || now > bundle.validUntil) {
      throw new ValidationError('Bundle is not currently valid');
    }

    if (
      bundle.limitedQuantity !== null &&
      bundle.soldCount >= bundle.limitedQuantity
    ) {
      throw new ValidationError('Bundle is sold out');
    }

    return bundle;
  }
}

export default new BundleService();
