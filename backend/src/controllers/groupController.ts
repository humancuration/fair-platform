import { Request, Response } from 'express';
import Group from '../models/group.model';

export const createGroup = async (req: Request, res: Response) => {
  try {
    const { name, type, description } = req.body;
    const group = await Group.create({
      name,
      type,
      description,
      createdBy: req.user.id,
    });
    res.status(201).json(group);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create group' });
  }
};

export const getGroups = async (req: Request, res: Response) => {
  try {
    const groups = await Group.findAll();
    res.status(200).json(groups);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch groups' });
  }
};

export const getGroupById = async (req: Request, res: Response) => {
  try {
    const group = await Group.findByPk(req.params.id);
    if (group) {
      res.status(200).json(group);
    } else {
      res.status(404).json({ error: 'Group not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch group' });
  }
};

export const updateGroup = async (req: Request, res: Response) => {
  try {
    const group = await Group.findByPk(req.params.id);
    if (group) {
      await group.update(req.body);
      res.status(200).json(group);
    } else {
      res.status(404).json({ error: 'Group not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to update group' });
  }
};

export const deleteGroup = async (req: Request, res: Response) => {
  try {
    const group = await Group.findByPk(req.params.id);
    if (group) {
      await group.destroy();
      res.status(200).json({ message: 'Group deleted' });
    } else {
      res.status(404).json({ error: 'Group not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete group' });
  }
};

export const updateGroupProfile = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { motto, vision, profilePicture, coverPhoto, pinnedAnnouncement } = req.body;
    const group = await Group.findByPk(id);
    if (group) {
      await group.update({ motto, vision, profilePicture, coverPhoto, pinnedAnnouncement });
      res.status(200).json(group);
    } else {
      res.status(404).json({ error: 'Group not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to update group profile' });
  }
};

export const searchGroups = async (req: Request, res: Response) => {
  try {
    const { query, tags, type, location } = req.query;
    // Implement search logic here
    const groups = await Group.findAll({
      where: {
        // Add conditions based on query parameters
      }
    });
    res.status(200).json(groups);
  } catch (error) {
    res.status(500).json({ error: 'Failed to search groups' });
  }
};

export const addResourceCredits = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { credits } = req.body;
    const group = await Group.findByPk(id);
    if (group) {
      await group.increment('resourceCredits', { by: credits });
      res.status(200).json({ message: 'Resource credits added successfully' });
    } else {
      res.status(404).json({ error: 'Group not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to add resource credits' });
  }
};

// Add more functions for other features like:
// - joinGroup
// - leaveGroup
// - createGroupEvent
// - createGroupPetition
// - createGroupProject
// - voteInGroup
// - etc.