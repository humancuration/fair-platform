// backend/src/routes/products.ts
import { Router, Request, Response } from 'express';
import Product from './Product';
import auth from '../../middleware/auth';

const router = Router();

// Get all products
router.get('/', async (req: Request, res: Response) => {
  try {
    const products = await Product.findAll();
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Create a new product (protected route) with fee calculation
router.post('/', auth, async (req: Request, res: Response) => {
  const { name, description, price } = req.body;
  const sellerId = req.user.id;
  const feePercentage = 0.025; // 2.5%
  const fee = price * feePercentage;
  const finalPrice = price - fee;

  try {
    const product = await Product.create({ name, description, price: finalPrice, sellerId });
    // Here you can log the fee or add it to a separate table for dividends/grants
    res.status(201).json(product);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get a single product by ID
router.get('/:id', async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const product = await Product.findByPk(id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json(product);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
