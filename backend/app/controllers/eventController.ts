import { Request, Response } from 'express';
import { prisma } from '../lib/prisma';
import { io } from '../socket/server'; // Update this path to match your socket.io server location

interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
  };
}

export const createEvent = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { groupId, title, description, date, location } = req.body;
    const creatorId = req.user?.id;

    if (!creatorId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const group = await prisma.group.findUnique({
      where: { id: groupId },
      include: {
        members: {
          where: { userId: creatorId }
        }
      }
    });

    if (!group) {
      return res.status(404).json({ message: 'Group not found' });
    }

    if (group.members.length === 0) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    const event = await prisma.event.create({
      data: {
        title,
        description,
        date: new Date(date),
        location,
        group: { connect: { id: groupId } },
        createdBy: { connect: { id: creatorId } }
      },
      include: {
        group: true,
        createdBy: true
      }
    });

    io.to(groupId).emit('eventCreated', event);

    return res.status(201).json(event);
  } catch (error) {
    console.error('Error creating event:', error);
    return res.status(500).json({ message: 'Server Error' });
  }
};

export const getEventsByGroup = async (req: Request, res: Response) => {
  try {
    const { groupId } = req.params;

    const events = await prisma.event.findMany({
      where: { groupId },
      include: {
        createdBy: {
          select: { username: true }
        }
      }
    });

    res.status(200).json(events);
  } catch (error) {
    console.error('Error fetching events:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};

export const getEventById = async (req: Request, res: Response) => {
  try {
    const { eventId } = req.params;

    const event = await prisma.event.findUnique({
      where: { id: eventId },
      include: {
        group: true,
        createdBy: true,
        attendees: true
      }
    });

    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    res.status(200).json(event);
  } catch (error) {
    console.error('Error fetching event:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};

export const updateEvent = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { eventId } = req.params;
    const { title, description, date, location } = req.body;
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const event = await prisma.event.findUnique({
      where: { id: eventId },
      include: {
        group: true,
        createdBy: true
      }
    });
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const group = event.group;
    if (!group) {
      return res.status(404).json({ message: 'Group not found' });
    }

    const userRole = await prisma.groupMember.findFirst({
      where: { groupId: group.id, userId: userId }
    });
    if (event.createdById !== userId && !['Admin', 'Delegate'].includes(userRole?.role)) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    await prisma.event.update({
      where: { id: eventId },
      data: {
        title,
        description,
        date: new Date(date),
        location
      }
    });

    io.to(group.id).emit('eventUpdated', event);

    res.status(200).json(event);
  } catch (error) {
    console.error('Error updating event:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};

export const deleteEvent = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { eventId } = req.params;
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const event = await prisma.event.findUnique({
      where: { id: eventId },
      include: {
        group: true,
        createdBy: true
      }
    });
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const group = event.group;
    if (!group) {
      return res.status(404).json({ message: 'Group not found' });
    }

    const userRole = await prisma.groupMember.findFirst({
      where: { groupId: group.id, userId: userId }
    });
    if (event.createdById !== userId && !['Admin', 'Delegate'].includes(userRole?.role)) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    await prisma.event.delete({ where: { id: eventId } });

    io.to(group.id).emit('eventDeleted', { eventId });

    res.status(200).json({ message: 'Event deleted successfully' });
  } catch (error) {
    console.error('Error deleting event:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};

export const rsvpEvent = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { eventId } = req.params;
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const event = await prisma.event.findUnique({
      where: { id: eventId },
      include: {
        group: true,
        createdBy: true
      }
    });
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    const group = event.group;
    if (!group) {
      return res.status(404).json({ message: 'Group not found' });
    }

    const isMember = await prisma.groupMember.count({
      where: { groupId: group.id, userId: userId }
    });
    if (isMember === 0) {
      return res.status(403).json({ message: 'Only group members can RSVP to events' });
    }

    const isAttending = await prisma.eventAttendee.count({
      where: { eventId: eventId, userId: userId }
    });
    if (isAttending > 0) {
      return res.status(400).json({ message: 'User has already RSVPed to this event' });
    }

    await prisma.eventAttendee.create({
      data: {
        eventId: eventId,
        userId: userId
      }
    });

    io.to(group.id).emit('eventUpdated', event);

    res.status(200).json({ message: 'RSVP successful' });
  } catch (error) {
    console.error('Error RSVPing to event:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};
