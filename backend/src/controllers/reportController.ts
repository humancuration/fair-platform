import { Response } from 'express';
import { prisma } from '../lib/prisma';
import { AuthenticatedRequest } from '../types/auth';
import logger from '../utils/logger';
import { createNotification } from './notificationController';
import { generatePDF } from '../services/pdfService';

interface ReportFilters {
  startDate?: Date;
  endDate?: Date;
  type?: string;
  groupId?: string;
}

export const generateEventReport = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    const { startDate, endDate, groupId } = req.query as unknown as ReportFilters;

    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    // Verify user has permission to generate reports
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        groups: {
          where: groupId ? { groupId: groupId as string } : undefined,
          select: { role: true }
        }
      }
    });

    if (!user || (groupId && !user.groups.some(g => ['ADMIN', 'DELEGATE'].includes(g.role)))) {
      return res.status(403).json({ message: 'Unauthorized to generate reports' });
    }

    const events = await prisma.event.findMany({
      where: {
        ...(groupId && { groupId }),
        ...(startDate && { date: { gte: new Date(startDate) } }),
        ...(endDate && { date: { lte: new Date(endDate) } }),
        group: {
          members: {
            some: { userId }
          }
        }
      },
      include: {
        group: true,
        _count: {
          select: { attendees: true }
        }
      },
      orderBy: {
        date: 'desc'
      }
    });

    const reportData = {
      events: events.map(event => ({
        title: event.title,
        date: event.date,
        group: event.group.name,
        attendees: event._count.attendees,
        location: event.location
      })),
      totalEvents: events.length,
      totalAttendees: events.reduce((sum, event) => sum + event._count.attendees, 0),
      dateRange: {
        from: startDate || events[events.length - 1]?.date,
        to: endDate || events[0]?.date
      }
    };

    const pdfBuffer = await generatePDF('event-report', reportData);

    // Save report record
    const report = await prisma.report.create({
      data: {
        type: 'EVENT',
        generatedById: userId,
        filters: {
          startDate,
          endDate,
          groupId
        },
        status: 'COMPLETED'
      }
    });

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=event-report-${report.id}.pdf`);
    res.send(pdfBuffer);
  } catch (error) {
    logger.error('Error generating event report:', error);
    res.status(500).json({ message: 'Failed to generate report' });
  }
};

export const getReportHistory = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const reports = await prisma.report.findMany({
      where: {
        generatedById: userId
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    res.json(reports);
  } catch (error) {
    logger.error('Error fetching report history:', error);
    res.status(500).json({ message: 'Failed to fetch report history' });
  }
};
