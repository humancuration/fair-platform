import { Request, Response } from 'express';
import { GroupMember } from '../models/groupMember.model';
import { Group } from './Group';
import { User } from '../user/User';

export const addMember = async (req: Request, res: Response) => {
  try {
    const { groupId } = req.params;
    const { userId, role } = req.body;

    const group = await Group.findByPk(groupId);
    if (!group) {
      return res.status(404).json({ error: 'Group not found' });
    }

    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const [member, created] = await GroupMember.findOrCreate({
      where: { groupId, userId },
      defaults: { role: role || 'Observer' },
    });

    if (!created) {
      return res.status(400).json({ error: 'User is already a member of the group' });
    }

    res.status(201).json(member);
  } catch (error) {
    res.status(500).json({ error: 'Failed to add group member' });
  }
};

export const removeMember = async (req: Request, res: Response) => {
  try {
    const { groupId, userId } = req.params;

    const member = await GroupMember.findOne({ where: { groupId, userId } });
    if (!member) {
      return res.status(404).json({ error: 'Group member not found' });
    }

    await member.destroy();
    res.status(200).json({ message: 'Group member removed successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to remove group member' });
  }
};

// Additional functions for updating roles, fetching members, etc.