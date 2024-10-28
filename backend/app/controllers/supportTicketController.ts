import { Response } from 'express';
import { prisma } from '../lib/prisma';
import { AuthenticatedRequest } from '../types/auth';
import logger from '../utils/logger';
import { createNotification } from './notificationController';

export const createTicket = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    const { title, description, category, priority } = req.body;

    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const ticket = await prisma.supportTicket.create({
      data: {
        title,
        description,
        category,
        priority,
        status: 'OPEN',
        userId
      },
      include: {
        user: {
          select: {
            username: true,
            email: true
          }
        }
      }
    });

    // Notify support staff
    const supportStaff = await prisma.user.findMany({
      where: {
        role: 'ADMIN'
      }
    });

    await Promise.all(
      supportStaff.map(staff => 
        createNotification(
          staff.id,
          'NEW_SUPPORT_TICKET',
          `New support ticket: ${title}`
        )
      )
    );

    res.status(201).json(ticket);
  } catch (error) {
    logger.error('Error creating support ticket:', error);
    res.status(500).json({ message: 'Failed to create support ticket' });
  }
};

export const updateTicketStatus = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { ticketId } = req.params;
    const { status, response } = req.body;
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (user?.role !== 'ADMIN') {
      return res.status(403).json({ message: 'Only support staff can update tickets' });
    }

    const ticket = await prisma.supportTicket.update({
      where: { id: ticketId },
      data: {
        status,
        responses: {
          create: {
            content: response,
            responderId: userId
          }
        }
      },
      include: {
        user: true,
        responses: {
          include: {
            responder: {
              select: {
                username: true
              }
            }
          }
        }
      }
    });

    // Notify ticket creator
    await createNotification(
      ticket.userId,
      'TICKET_UPDATE',
      `Your support ticket "${ticket.title}" has been updated to ${status}`
    );

    res.json(ticket);
  } catch (error) {
    logger.error('Error updating support ticket:', error);
    res.status(500).json({ message: 'Failed to update ticket' });
  }
};

export const getTickets = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    const { status } = req.query;

    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const user = await prisma.user.findUnique({ where: { id: userId } });
    const isAdmin = user?.role === 'ADMIN';

    const tickets = await prisma.supportTicket.findMany({
      where: {
        ...(isAdmin ? {} : { userId }),
        ...(status ? { status: status as string } : {})
      },
      include: {
        user: {
          select: {
            username: true,
            email: true
          }
        },
        responses: {
          include: {
            responder: {
              select: {
                username: true
              }
            }
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    res.json(tickets);
  } catch (error) {
    logger.error('Error fetching support tickets:', error);
    res.status(500).json({ message: 'Failed to fetch tickets' });
  }
};
