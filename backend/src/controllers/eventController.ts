import { Request, Response } from 'express';
import { Event } from '@models/Event';
import { Group } from '@models/Group';
import { User } from '@models/User';
import { io } from '@/server';

export const createEvent = async (req: Request, res: Response) => {
  try {
    const { groupId, title, description, date, location } = req.body;
    const creatorId = req.user.id;

    const group = await Group.findByPk(groupId, { include: ['members'] });
    if (!group) {
      return res.status(404).json({ message: 'Group not found' });
    }

    if (!group.members?.some(member => member.id === creatorId)) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    const event = await Event.create({
      groupId,
      title,
      description,
      date,
      location,
      createdById: creatorId,
    });

    await group.$add('events', event);

    io.to(groupId.toString()).emit('eventCreated', event);

    return res.status(201).json(event);
  } catch (error) {
    console.error('Error creating event:', error);
    return res.status(500).json({ message: 'Server Error' });
  }
};

export const getEventsByGroup = async (req: Request, res: Response) => {
  try {
    const { groupId } = req.params;

    const group = await Group.findByPk(groupId, {
      include: [{
        model: Event,
        include: [{ model: User, as: 'createdBy', attributes: ['username'] }]
      }]
    });

    if (!group) {
      return res.status(404).json({ message: 'Group not found' });
    }

    res.status(200).json(group.events);
  } catch (error) {
    console.error('Error fetching events:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};

export const getEventById = async (req: Request, res: Response) => {
  try {
    const { eventId } = req.params;

    const event = await Event.findByPk(eventId, {
      include: [
        { model: Group, attributes: ['name'] },
        { model: User, as: 'createdBy', attributes: ['username'] },
        { model: User, as: 'attendees', attributes: ['username'] }
      ]
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

export const updateEvent = async (req: Request, res: Response) => {
  try {
    const { eventId } = req.params;
    const { title, description, date, location } = req.body;
    const userId = req.user.id;

    const event = await Event.findByPk(eventId, { include: [Group] });
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const group = event.group;
    if (!group) {
      return res.status(404).json({ message: 'Group not found' });
    }

    const userRole = await group.$get('members', { where: { id: userId } }).then(members => members[0]?.GroupMember.role);
    if (event.createdById !== userId && !['Admin', 'Delegate'].includes(userRole)) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    await event.update({ title, description, date, location });

    io.to(group.id.toString()).emit('eventUpdated', event);

    res.status(200).json(event);
  } catch (error) {
    console.error('Error updating event:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};

export const deleteEvent = async (req: Request, res: Response) => {
  try {
    const { eventId } = req.params;
    const userId = req.user.id;

    const event = await Event.findByPk(eventId, { include: [Group] });
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const group = event.group;
    if (!group) {
      return res.status(404).json({ message: 'Group not found' });
    }

    const userRole = await group.$get('members', { where: { id: userId } }).then(members => members[0]?.GroupMember.role);
    if (event.createdById !== userId && !['Admin', 'Delegate'].includes(userRole)) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    await event.destroy();

    io.to(group.id.toString()).emit('eventDeleted', { eventId });

    res.status(200).json({ message: 'Event deleted successfully' });
  } catch (error) {
    console.error('Error deleting event:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};

export const rsvpEvent = async (req: Request, res: Response) => {
  try {
    const { eventId } = req.params;
    const userId = req.user.id;

    const event = await Event.findByPk(eventId, { include: [Group] });
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    const group = event.group;
    if (!group) {
      return res.status(404).json({ message: 'Group not found' });
    }

    const isMember = await group.$has('members', userId);
    if (!isMember) {
      return res.status(403).json({ message: 'Only group members can RSVP to events' });
    }

    const isAttending = await event.$has('attendees', userId);
    if (isAttending) {
      return res.status(400).json({ message: 'User has already RSVPed to this event' });
    }

    await event.$add('attendees', userId);

    io.to(group.id.toString()).emit('eventUpdated', event);

    res.status(200).json({ message: 'RSVP successful' });
  } catch (error) {
    console.error('Error RSVPing to event:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};
