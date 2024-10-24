import { Request, Response } from 'express';
import { prisma } from '../lib/prisma';
import logger from '../utils/logger';

interface SearchQuery {
  q?: string;
  type?: 'events' | 'groups' | 'users' | 'all';
  page?: string;
  limit?: string;
}

export const search = async (req: Request<{}, {}, {}, SearchQuery>, res: Response) => {
  try {
    const { q = '', type = 'all', page = '1', limit = '10' } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const take = parseInt(limit);

    const searchTerm = `%${q}%`;

    let results: any = {};

    if (type === 'all' || type === 'events') {
      results.events = await prisma.event.findMany({
        where: {
          OR: [
            { title: { contains: q, mode: 'insensitive' } },
            { description: { contains: q, mode: 'insensitive' } }
          ]
        },
        include: {
          group: true,
          createdBy: {
            select: {
              username: true
            }
          }
        },
        skip,
        take
      });
    }

    if (type === 'all' || type === 'groups') {
      results.groups = await prisma.group.findMany({
        where: {
          OR: [
            { name: { contains: q, mode: 'insensitive' } },
            { description: { contains: q, mode: 'insensitive' } }
          ]
        },
        include: {
          _count: {
            select: {
              members: true,
              events: true
            }
          }
        },
        skip,
        take
      });
    }

    if (type === 'all' || type === 'users') {
      results.users = await prisma.user.findMany({
        where: {
          OR: [
            { username: { contains: q, mode: 'insensitive' } },
            { firstName: { contains: q, mode: 'insensitive' } },
            { lastName: { contains: q, mode: 'insensitive' } }
          ]
        },
        select: {
          id: true,
          username: true,
          firstName: true,
          lastName: true,
          _count: {
            select: {
              groups: true,
              events: true
            }
          }
        },
        skip,
        take
      });
    }

    // Get total counts for pagination
    const counts = {
      events: type === 'all' || type === 'events' ? 
        await prisma.event.count({
          where: {
            OR: [
              { title: { contains: q, mode: 'insensitive' } },
              { description: { contains: q, mode: 'insensitive' } }
            ]
          }
        }) : 0,
      groups: type === 'all' || type === 'groups' ? 
        await prisma.group.count({
          where: {
            OR: [
              { name: { contains: q, mode: 'insensitive' } },
              { description: { contains: q, mode: 'insensitive' } }
            ]
          }
        }) : 0,
      users: type === 'all' || type === 'users' ? 
        await prisma.user.count({
          where: {
            OR: [
              { username: { contains: q, mode: 'insensitive' } },
              { firstName: { contains: q, mode: 'insensitive' } },
              { lastName: { contains: q, mode: 'insensitive' } }
            ]
          }
        }) : 0
    };

    res.json({
      results,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: Object.values(counts).reduce((a, b) => a + b, 0),
        counts
      }
    });
  } catch (error) {
    logger.error('Search error:', error);
    res.status(500).json({ message: 'Search failed' });
  }
};
