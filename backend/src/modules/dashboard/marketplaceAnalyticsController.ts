import { Request, Response } from 'express';
import { Transaction, Product, User } from '../models';
import { Op } from 'sequelize';
import { redisClient } from '../../config/redis';

export const getMarketplaceAnalytics = async (req: Request, res: Response) => {
  try {
    const now = new Date();
    const startOfDay = new Date(now.setHours(0, 0, 0, 0));
    const startOfWeek = new Date(now.setDate(now.getDate() - now.getDay()));
    const startOfMonth = new Date(now.setDate(1));

    // Get real-time viewers from Redis
    const realtimeViewers = await redisClient.get('marketplace:activeUsers') || '0';

    // Get sales metrics
    const [dailySales, weeklySales, monthlySales, totalSales] = await Promise.all([
      Transaction.sum('amount', { where: { createdAt: { [Op.gte]: startOfDay } } }),
      Transaction.sum('amount', { where: { createdAt: { [Op.gte]: startOfWeek } } }),
      Transaction.sum('amount', { where: { createdAt: { [Op.gte]: startOfMonth } } }),
      Transaction.sum('amount')
    ]);

    // Get top selling products
    const topSellingProducts = await Product.findAll({
      attributes: [
        'id',
        'name',
        [sequelize.fn('COUNT', sequelize.col('Transactions.id')), 'sales'],
        [sequelize.fn('SUM', sequelize.col('Transactions.amount')), 'revenue']
      ],
      include: [{
        model: Transaction,
        attributes: []
      }],
      group: ['Product.id'],
      order: [[sequelize.fn('COUNT', sequelize.col('Transactions.id')), 'DESC']],
      limit: 5
    });

    // Calculate conversion rate
    const totalVisitors = parseInt(await redisClient.get('marketplace:totalVisitors') || '0');
    const totalPurchases = await Transaction.count();
    const conversionRate = totalVisitors ? (totalPurchases / totalVisitors) * 100 : 0;

    // Get affiliate performance
    const affiliatePerformance = await User.findAll({
      attributes: [
        'id',
        'username',
        [sequelize.fn('COUNT', sequelize.col('Transactions.id')), 'sales'],
        [sequelize.fn('SUM', sequelize.col('Transactions.commission')), 'commission']
      ],
      include: [{
        model: Transaction,
        attributes: [],
        where: { affiliateId: { [Op.not]: null } }
      }],
      group: ['User.id'],
      order: [[sequelize.fn('SUM', sequelize.col('Transactions.commission')), 'DESC']],
      limit: 10
    });

    // Get popular categories
    const popularCategories = await Product.findAll({
      attributes: [
        'category',
        [sequelize.fn('COUNT', sequelize.col('Transactions.id')), 'count']
      ],
      include: [{
        model: Transaction,
        attributes: []
      }],
      group: ['Product.category'],
      order: [[sequelize.fn('COUNT', sequelize.col('Transactions.id')), 'DESC']]
    });

    res.json({
      metrics: {
        daily: dailySales || 0,
        weekly: weeklySales || 0,
        monthly: monthlySales || 0,
        total: totalSales || 0,
        averageOrderValue: totalPurchases ? (totalSales / totalPurchases) : 0,
        topSellingProducts,
        conversionRate,
        affiliatePerformance
      },
      realtimeViewers: parseInt(realtimeViewers),
      popularCategories
    });
  } catch (error) {
    console.error('Error fetching marketplace analytics:', error);
    res.status(500).json({ message: 'Failed to fetch analytics data' });
  }
};

// Track real-time viewers
export const trackRealtimeViewer = async (req: Request, res: Response) => {
  try {
    const { action } = req.body; // 'join' or 'leave'
    const key = 'marketplace:activeUsers';
    
    if (action === 'join') {
      await redisClient.incr(key);
    } else if (action === 'leave') {
      await redisClient.decr(key);
    }

    const viewers = await redisClient.get(key);
    res.json({ viewers: parseInt(viewers || '0') });
  } catch (error) {
    console.error('Error tracking realtime viewer:', error);
    res.status(500).json({ message: 'Failed to track viewer' });
  }
};

// Track page view for conversion rate calculation
export const trackPageView = async (req: Request, res: Response) => {
  try {
    await redisClient.incr('marketplace:totalVisitors');
    res.status(204).send();
  } catch (error) {
    console.error('Error tracking page view:', error);
    res.status(500).json({ message: 'Failed to track page view' });
  }
};
