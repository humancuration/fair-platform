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

// Additional functions can be added here as needed