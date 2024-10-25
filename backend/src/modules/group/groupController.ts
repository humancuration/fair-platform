import { Request, Response } from 'express';
import { Group } from './Group';
import { User } from '../user/User';
import { GroupType } from './GroupType';
import { Challenge } from '../challenge/Challenge';
import { Resource } from '../resource/Resource';
import { Decision } from '../decision/Decision';
import { Poll } from '../poll/Poll';
import { Achievement } from '../../../../backup/models/Achievement2';
import { io } from '../../server';
import { createDiscourseCategory } from '../../services/discourseService';
import { createMoodleCourse } from '../../services/moodleService';
import { triggerN8nWorkflow } from '../../services/n8nService';
import { createMauticContact, addContactToSegment, triggerCampaign } from '../../services/mauticService';
import { sendMessageToChannel } from '../../services/discordService';
import { notifyGroupMembers } from '../../services/notificationService';
import { triggerGroupWebhooks } from '../../services/webhookService';
import { logger } from '../../utils/logger';
import { CustomError } from '../../utils/errors';

// Types
interface GroupCreateRequest {
  name: string;
  description: string;
  groupTypeId: number;
  categoryBadge?: string;
  profilePicture?: string;
}

interface GroupSettings {
  name?: string;
  description?: string;
  isPublic?: boolean;
  allowNewMembers?: boolean;
  membershipCriteria?: string[];
  // Add other settings as needed
}

// Create a new group
export const createGroup = async (req: Request, res: Response) => {
  try {
    const { name, description, groupTypeId, categoryBadge, profilePicture }: GroupCreateRequest = req.body;
    const creatorId = req.user?.id;

    if (!creatorId) {
      throw new CustomError('Unauthorized', 401);
    }

    // Validate group type
    const groupType = await GroupType.findByPk(groupTypeId);
    if (!groupType) {
      throw new CustomError('Invalid group type', 400);
    }

    // Create the group
    const group = await Group.create({
      name,
      description,
      groupTypeId,
      categoryBadge,
      profilePicture,
      creatorId,
      members: [creatorId],
      delegates: [],
      events: [],
    });

    // Update user's groups and roles
    const user = await User.findByPk(creatorId);
    if (user) {
      await user.addGroup(group);
      await user.setRole(group.id, 'Admin');
    }

    // Create integrations
    const [discourseCategory, moodleCourse] = await Promise.all([
      createDiscourseCategory(group.name, group.description),
      createMoodleCourse(group.name, group.description)
    ]);

    // Update group with integration IDs
    await group.update({
      discourseCategoryId: discourseCategory.id,
      moodleCourseId: moodleCourse.id,
    });

    // Trigger integrations
    await Promise.all([
      triggerN8nWorkflow('newGroupWorkflow', { groupId: group.id, groupName: group.name }),
      sendMessageToChannel('group-announcements', `New group created: ${group.name}`),
      notifyGroupMembers(group.id, 'group_created', { group: group.toJSON() })
    ]);

    logger.info(`Group created: ${group.id}`, { groupId: group.id, creatorId });
    res.status(201).json(group);

  } catch (error) {
    logger.error('Error creating group:', error);
    if (error instanceof CustomError) {
      res.status(error.statusCode).json({ message: error.message });
    } else {
      res.status(500).json({ message: 'Server Error' });
    }
  }
};

// Get group challenges
export const getGroupChallenges = async (req: Request, res: Response) => {
  try {
    const { groupId } = req.params;
    const challenges = await Challenge.findAll({ 
      where: { groupId },
      include: [{
        model: User,
        attributes: ['id', 'username', 'avatar']
      }]
    });
    res.status(200).json(challenges);
  } catch (error) {
    logger.error('Error fetching group challenges:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// Get group marketplace resources
export const getGroupMarketplace = async (req: Request, res: Response) => {
  try {
    const { groupId } = req.params;
    const resources = await Resource.findAll({ 
      where: { groupId, isMarketplace: true },
      include: [{
        model: User,
        attributes: ['id', 'username', 'avatar']
      }]
    });
    res.status(200).json(resources);
  } catch (error) {
    logger.error('Error fetching group marketplace resources:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// Cast vote for a decision
export const castDecisionVote = async (req: Request, res: Response) => {
  try {
    const { groupId, decisionId } = req.params;
    const { optionId } = req.body;
    const userId = req.user?.id;

    if (!userId) {
      throw new CustomError('Unauthorized', 401);
    }

    const decision = await Decision.findByPk(decisionId);
    if (!decision) {
      throw new CustomError('Decision not found', 404);
    }

    await decision.castVote(userId, optionId);
    
    // Notify members about new vote
    await notifyGroupMembers(groupId, 'new_vote', { 
      decisionId,
      userId,
      optionId 
    });

    res.status(200).json({ message: 'Vote cast successfully' });
  } catch (error) {
    logger.error('Error casting vote:', error);
    if (error instanceof CustomError) {
      res.status(error.statusCode).json({ message: error.message });
    } else {
      res.status(500).json({ message: 'Server Error' });
    }
  }
};

// Update group settings
export const updateGroupSettings = async (req: Request, res: Response) => {
  try {
    const { groupId } = req.params;
    const settings: GroupSettings = req.body;
    const userId = req.user?.id;

    if (!userId) {
      throw new CustomError('Unauthorized', 401);
    }

    const group = await Group.findByPk(groupId);
    if (!group) {
      throw new CustomError('Group not found', 404);
    }

    // Check if user has permission to update settings
    const hasPermission = await group.canUserManageSettings(userId);
    if (!hasPermission) {
      throw new CustomError('Insufficient permissions', 403);
    }

    await group.update(settings);
    
    // Trigger webhooks and notifications
    await Promise.all([
      triggerGroupWebhooks(groupId, 'settings_updated', settings),
      notifyGroupMembers(groupId, 'settings_updated', { 
        groupId,
        settings,
        updatedBy: userId 
      })
    ]);

    res.json(group);
  } catch (error) {
    logger.error('Error updating group settings:', error);
    if (error instanceof CustomError) {
      res.status(error.statusCode).json({ message: error.message });
    } else {
      res.status(500).json({ message: 'Server Error' });
    }
  }
};

// Additional controller methods...
export const groupController = {
  createGroup,
  getGroupChallenges,
  getGroupMarketplace,
  castDecisionVote,
  updateGroupSettings,
  // Add other methods as needed
};
