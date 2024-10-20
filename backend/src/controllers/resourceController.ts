import { Request, Response } from 'express';
import Resource from '../models/resource.model';
import Group from '../modulesb/group/Group';

export const offerResource = async (req: Request, res: Response) => {
  try {
    const { groupId } = req.params;
    const { type, description } = req.body;
    const userId = req.user.id;

    const group = await Group.findByPk(groupId);
    if (!group) {
      return res.status(404).json({ error: 'Group not found' });
    }

    // Check if user is a member
    const isMember = await group.hasMember(userId);
    if (!isMember) {
      return res.status(403).json({ error: 'User is not a member of the group' });
    }

    const resource = await Resource.create({ groupId, userId, type, description });
    res.status(201).json(resource);
  } catch (error) {
    res.status(500).json({ error: 'Failed to offer resource' });
  }
};

export const fetchResources = async (req: Request, res: Response) => {
  try {
    const { groupId } = req.params;
    const resources = await Resource.findAll({ where: { groupId, available: true } });
    res.status(200).json(resources);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch resources' });
  }
};

export const requestResource = async (req: Request, res: Response) => {
  try {
    const { groupId, resourceId } = req.params;
    const userId = req.user.id;

    const resource = await Resource.findOne({ where: { id: resourceId, groupId, available: true } });
    if (!resource) {
      return res.status(404).json({ error: 'Resource not available' });
    }

    // Implement mutual aid tracking logic here

    // Mark resource as unavailable
    resource.available = false;
    await resource.save();

    res.status(200).json({ message: 'Resource requested successfully', resource });
  } catch (error) {
    res.status(500).json({ error: 'Failed to request resource' });
  }
};

// Add more functions as needed