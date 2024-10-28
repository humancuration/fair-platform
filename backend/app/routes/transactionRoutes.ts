import { Router } from 'express';
import { Transaction } from '../modules/marketplace/Transaction';
import { authenticateToken } from '../middleware/auth';
import { calculateCommissions } from '../utils/commissionCalculator';
import { Product } from '../modules/marketplace/Product';
import { Op } from 'sequelize';

const router = Router();

// Get all transactions for a user
router.get('/', authenticateToken, async (req, res) => {
  try {
    const transactions = await Transaction.findAll({
      where: {
        [Op.or]: [
          { buyerId: req.user.id },
          { sellerId: req.user.id },
          { affiliateId: req.user.id },
        ],
      },
      include: ['buyer', 'seller', 'product', 'affiliate'],
    });
    res.json(transactions);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch transactions' });
  }
});

// Create a new transaction
router.post('/', authenticateToken, async (req, res) => {
  try {
    const { productId, affiliateId } = req.body;
    const product = await Product.findByPk(productId);
    
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    const { platformCommission, affiliateCommission } = calculateCommissions(product.price);

    const transaction = await Transaction.create({
      buyerId: req.user.id,
      sellerId: product.userId,
      productId,
      amount: product.price,
      commission: platformCommission,
      affiliateId,
      affiliateCommission,
      status: 'pending',
    });

    res.status(201).json(transaction);
  } catch (error) {
    res.status(500).json({ message: 'Failed to create transaction' });
  }
});

export default router;
