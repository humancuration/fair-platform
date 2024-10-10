import { Request, Response } from 'express';
import Event from '../models/Event';
import Group from '../models/Group';
import User from '../models/User';
import { io } from '../server';

export const createEvent = async (req: Request, res: Response) => {
  try {
    const { groupId, title, description, date, location } = req.body;
    const creatorId = req.user.id;

    const group = await Group.findById(groupId);
    if (!group) {
      return res.status(404).json({ message: 'Group not found' });
    }

    if (!group.members.includes(creatorId)) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    const event = new Event({
      group: groupId,
      title,
      description,
      date,
      location,
      createdBy: creatorId,
      attendees: [],
    });

    await event.save();

    group.events.push(event._id);
    await group.save();

    io.to(groupId).emit('eventCreated', event);

    res.status(201).json(event);
  } catch (error) {
    console.error('Error creating event:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};

export const getEventsByGroup = async (req: Request, res: Response) => {
  try {
    const { groupId } = req.params;

    const group = await Group.findById(groupId).populate({
      path: 'events',
      populate: { path: 'createdBy', select: 'username' },
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

    const event = await Event.findById(eventId)
      .populate('group', 'name')
      .populate('createdBy', 'username')
      .populate('attendees', 'username');

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

    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    const group = await Group.findById(event.group);
    if (!group) {
      return res.status(404).json({ message: 'Group not found' });
    }

    const user = await User.findById(userId);
    if (
      event.createdBy.toString() !== userId &&
      (user?.roles.get(group._id.toString()) !== 'Admin' &&
        user?.roles.get(group._id.toString()) !== 'Delegate')
    ) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    if (title) event.title = title;
    if (description) event.description = description;
    if (date) event.date = date;
    if (location) event.location = location;

    await event.save();

    io.to(event.group.toString()).emit('eventUpdated', event);

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

    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    const group = await Group.findById(event.group);
    if (!group) {
      return res.status(404).json({ message: 'Group not found' });
    }

    const user = await User.findById(userId);
    if (
      event.createdBy.toString() !== userId &&
      (user?.roles.get(group._id.toString()) !== 'Admin' &&
        user?.roles.get(group._id.toString()) !== 'Delegate')
    ) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    await event.remove();

    group.events.pull(eventId);
    await group.save();

    io.to(group._id.toString()).emit('eventDeleted', { eventId });

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

    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    const group = await Group.findById(event.group);
    if (!group) {
      return res.status(404).json({ message: 'Group not found' });
    }

    if (!group.members.includes(userId)) {
      return res.status(403).json({ message: 'Only group members can RSVP to events' });
    }

    if (event.attendees.includes(userId)) {
      return res.status(400).json({ message: 'User has already RSVPed to this event' });
    }

    event.attendees.push(userId);
    await event.save();

    io.to(event.group.toString()).emit('eventUpdated', event);

    res.status(200).json({ message: 'RSVP successful' });
  } catch (error) {
    console.error('Error RSVPing to event:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};