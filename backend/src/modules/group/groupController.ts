import { Request, Response } from 'express';
import { Group } from '../modules/group/Group';
import { User } from '../modules/user/User';
import { GroupType } from '../modules/group/GroupType';
import { io } from '../server';
import { createDiscourseUser } from '../services/discourseService';
import { createMoodleUser } from '../services/moodleService';
import { triggerN8nWorkflow } from '../services/n8nService';
import { createMauticContact, addContactToSegment, triggerCampaign } from '../services/mauticService';
import { sendMessageToChannel } from '../discordBot';

// Create a new group
export const createGroup = async (req: Request, res: Response) => {
  try {
    const { name, description, groupTypeId, categoryBadge, profilePicture } = req.body;
    const creatorId = req.user.id;

    // Validate group type
    const groupType = await GroupType.findByPk(groupTypeId);
    if (!groupType) {
      return res.status(400).json({ message: 'Invalid group type' });
    }

    // Create the group
    const group = await Group.create({
      name,
      description,
      groupTypeId,
      categoryBadge,
      profilePicture,
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

    // Create Discourse category for the group
    const discourseCategory = await createDiscourseCategory(group.name, group.description);

    // Create Moodle course for the group
    const moodleCourse = await createMoodleCourse(group.name, group.description);

    // Update group with Discourse and Moodle IDs
    await group.update({
      discourseCategoryId: discourseCategory.id,
      moodleCourseId: moodleCourse.id,
    });

    // Trigger n8n workflow
    await triggerN8nWorkflow('newGroupWorkflow', { groupId: group.id, groupName: group.name });

    res.status(201).json(group);
  } catch (error) {
    console.error('Error creating group:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// Get group challenges
export const getGroupChallenges = async (req: Request, res: Response) => {
  try {
    const { groupId } = req.params;
    const challenges = await Challenge.findAll({ where: { groupId } });
    res.status(200).json(challenges);
  } catch (error) {
    console.error('Error fetching group challenges:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// Get group marketplace resources
export const getGroupMarketplace = async (req: Request, res: Response) => {
  try {
    const { groupId } = req.params;
    const resources = await Resource.findAll({ where: { groupId, isMarketplace: true } });
    res.status(200).json(resources);
  } catch (error) {
    console.error('Error fetching group marketplace resources:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// Get group decisions
export const getGroupDecisions = async (req: Request, res: Response) => {
  try {
    const { groupId } = req.params;
    const decisions = await Decision.findAll({ where: { groupId } });
    res.status(200).json(decisions);
  } catch (error) {
    console.error('Error fetching group decisions:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// Cast vote for a decision
export const castDecisionVote = async (req: Request, res: Response) => {
  try {
    const { groupId, decisionId } = req.params;
    const { optionId } = req.body;
    const userId = req.user.id;

    // Implement vote casting logic here
    // ...

    res.status(200).json({ message: 'Vote cast successfully' });
  } catch (error) {
    console.error('Error casting vote:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// Additional functions can be added here as needed
