import { Router, Request, Response } from 'express';
import auth from '../middleware/auth';
import Company from '../models/Company';
import Product from '../models/Product';

const router = Router();

// Get analytics for a specific company
router.get('/company/:id', auth, async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const company = await Company.findByPk(id, {
      include: [{ model: Product }],
    });
    if (!company) {
      return res.status(404).json({ message: 'Company not found' });
    }

    // Example metrics
    const totalProducts = company.Products.length;
    const totalRevenue = company.Products.reduce((acc, product) => acc + product.price, 0);
    const averageGenerosity = company.generosityScore;

    res.json({
      totalProducts,
      totalRevenue,
      averageGenerosity,
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
