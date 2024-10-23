import { Router } from 'express';
import { Bundle, BundleProduct } from '../modules/marketplace/Bundle';
import { authenticateToken } from '../middleware/auth';
import { Product } from '../modules/marketplace/Product';

const router = Router();

// Get all bundles
router.get('/', async (req, res) => {
  try {
    const bundles = await Bundle.findAll({
      include: [{
        model: BundleProduct,
        include: [Product],
      }],
    });
    res.json(bundles);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch bundles' });
  }
});

// Create new bundle
router.post('/', authenticateToken, async (req, res) => {
  try {
    const {
      name,
      description,
      totalPrice,
      discountedPrice,
      validFrom,
      validUntil,
      limitedQuantity,
      imageUrl,
      products,
    } = req.body;

    const bundle = await Bundle.create({
      name,
      description,
      totalPrice,
      discountedPrice,
      validFrom,
      validUntil,
      limitedQuantity,
      imageUrl,
      createdById: req.user.id,
    });

    if (products && products.length > 0) {
      await Promise.all(products.map(async (product: any) => {
        await BundleProduct.create({
          bundleId: bundle.id,
          productId: product.productId,
          quantity: product.quantity,
          discountPercentage: product.discountPercentage,
        });
      }));
    }

    const bundleWithProducts = await Bundle.findByPk(bundle.id, {
      include: [{
        model: BundleProduct,
        include: [Product],
      }],
    });

    res.status(201).json(bundleWithProducts);
  } catch (error) {
    res.status(500).json({ message: 'Failed to create bundle' });
  }
});

// Update bundle stock
router.patch('/:id/stock', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { soldCount } = req.body;

    await Bundle.update({ soldCount }, {
      where: { id },
    });

    res.json({ message: 'Stock updated successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to update stock' });
  }
});

// Toggle bundle featured status
router.patch('/:id/featured', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const bundle = await Bundle.findByPk(id);
    
    if (!bundle) {
      return res.status(404).json({ message: 'Bundle not found' });
    }

    await bundle.update({ featured: !bundle.featured });
    res.json({ featured: bundle.featured });
  } catch (error) {
    res.status(500).json({ message: 'Failed to toggle featured status' });
  }
});

export default router;
