import { Request, Response } from 'express';
import { Vote } from '../models/vote.model';
import { Group } from '../modules/group/Group';
import { Petition } from '../models/petition.model';

export const castVote = async (req: Request, res: Response) => {
  try {
    const { groupId, petitionId } = req.params;
    const { voteType } = req.body;
    const userId = req.user.id;

    // Validate voteType
    if (!['Upvote', 'Downvote'].includes(voteType)) {
      return res.status(400).json({ error: 'Invalid vote type' });
    }

    // Validate group and petition
    const group = await Group.findByPk(groupId);
    if (!group) {
      return res.status(404).json({ error: 'Group not found' });
    }

    const petition = await Petition.findByPk(petitionId);
    if (!petition) {
      return res.status(404).json({ error: 'Petition not found' });
    }

    // Check if user is a member of the group
    const isMember = await group.hasMember(userId);
    if (!isMember) {
      return res.status(403).json({ error: 'User is not a member of the group' });
    }

    // Check if user has already voted on this petition
    const existingVote = await Vote.findOne({ where: { groupId, userId, petitionId } });
    if (existingVote) {
      return res.status(400).json({ error: 'User has already voted on this petition' });
    }

    // Create vote
    const vote = await Vote.create({ groupId, userId, petitionId, voteType });
    res.status(201).json(vote);
  } catch (error) {
    res.status(500).json({ error: 'Failed to cast vote' });
  }
};

// Additional functions for updating votes, fetching vote counts, etc.
