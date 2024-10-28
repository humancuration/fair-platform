import { Request, Response } from 'express';
import { Product } from './Product';
import { Op } from 'sequelize';

export const getProducts = async (req: Request, res: Response) => {
  try {
    const products = await Product.findAll();
    res.json(products);
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const searchProducts = async (req: Request, res: Response) => {
  const { query, category, minPrice, maxPrice } = req.query;

  try {
    const whereClause: any = {};

    if (query) {
      whereClause.name = { [Op.iLike]: `%${query}%` };
    }

    if (category) {
      whereClause.category = category;
    }

    if (minPrice || maxPrice) {
      whereClause.price = {};
      if (minPrice) whereClause.price[Op.gte] = minPrice;
      if (maxPrice) whereClause.price[Op.lte] = maxPrice;
    }

    const products = await Product.findAll({ where: whereClause });
    res.json(products);
  } catch (error) {
    console.error('Error searching products:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const getRecommendations = async (req: Request, res: Response) => {
  try {
    // For now, we'll just return random products as recommendations
    const recommendations = await Product.findAll({ order: [['id', 'DESC']], limit: 5 });
    res.json(recommendations);
  } catch (error) {
    console.error('Error fetching recommendations:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Error handling middleware
export const errorHandler = (err: any, req: Request, res: Response, next: Function) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Internal server error' });
};