import { Router } from 'express';
import { FlashSale, FlashSaleProduct } from '../modules/marketplace/FlashSale';
import { authenticateToken } from '../middleware/auth';
import { Product } from '../modules/marketplace/Product';

const router = Router();

// Get all flash sales
router.get('/', async (req, res) => {
  try {
    const sales = await FlashSale.findAll({
      include: [{
        model: FlashSaleProduct,
        include: [Product],
      }],
    });
    res.json(sales);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch flash sales' });
  }
});

// Create new flash sale
router.post('/', authenticateToken, async (req, res) => {
  try {
    const { name, description, startTime, endTime, products } = req.body;
    
    const sale = await FlashSale.create({
      name,
      description,
      startTime,
      endTime,
      createdById: req.user.id,
    });

    if (products && products.length > 0) {
      await Promise.all(products.map(async (product: any) => {
        await FlashSaleProduct.create({
          flashSaleId: sale.id,
          productId: product.productId,
          salePrice: product.salePrice,
          quantity: product.quantity,
        });
      }));
    }

    const saleWithProducts = await FlashSale.findByPk(sale.id, {
      include: [{
        model: FlashSaleProduct,
        include: [Product],
      }],
    });

    res.status(201).json(saleWithProducts);
  } catch (error) {
    res.status(500).json({ message: 'Failed to create flash sale' });
  }
});

// Update flash sale status
router.patch('/:id/status', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    await FlashSale.update({ status }, {
      where: { id },
    });

    res.json({ message: 'Status updated successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to update status' });
  }
});

// Update product stock in flash sale
router.patch('/:saleId/products/:productId/stock', authenticateToken, async (req, res) => {
  try {
    const { saleId, productId } = req.params;
    const { soldCount } = req.body;

    await FlashSaleProduct.update({ soldCount }, {
      where: { flashSaleId: saleId, productId },
    });

    res.json({ message: 'Stock updated successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to update stock' });
  }
});

export default router;
