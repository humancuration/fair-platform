import { Request, Response } from 'express';
import Group from '../models/Group';
import User from '../models/User';
import GroupType from '../models/GroupType';
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

    // Create Mautic contact for group creator
    const mauticContact = await createMauticContact({
      firstname: user?.firstName,
      lastname: user?.lastName,
      email: user?.email,
      tags: ['Group Creator'],
    });

    // Add contact to a "Group Creators" segment (assuming segment ID 1)
    await addContactToSegment(mauticContact.contact.id, 1);

    // Trigger a welcome campaign for new group creators (assuming campaign ID 1)
    await triggerCampaign(1, mauticContact.contact.id);

    // Notify Discord channel
    const discordChannelId = process.env.DISCORD_CHANNEL_ID!;
    const message = `🎉 New Group Created: **${group.name}** by ${user?.username}! Join us to collaborate and innovate.`;
    await sendMessageToChannel(discordChannelId, message);

    // Send Discord webhook notification
    const webhookURL = process.env.DISCORD_WEBHOOK_URL!;
    await sendDiscordWebhook(webhookURL, message);

    // Send Rocket.Chat message
    const rocketChatRoomId = process.env.ROCKET_CHAT_ROOM_ID!;
    await sendRocketChatMessage(rocketChatRoomId, message);

    // Create Wekan card
    const wekanBoardId = process.env.WEKAN_BOARD_ID!;
    const wekanListId = process.env.WEKAN_LIST_ID!;
    await createWekanCard(wekanBoardId, wekanListId, `New Group: ${group.name}`, `Created by ${user?.username}`);

    // Create Nextcloud folder
    await createNextcloudFolder(`Groups/${group.name}`);

    io.emit('groupCreated', group);
    res.status(201).json(group);
  } catch (error) {
    console.error('Error creating group:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};


// Get all groups
export const getGroups = async (req: Request, res: Response) => {
  try {
    const groups = await Group.findAll({
      include: [
        { model: GroupType, attributes: ['name', 'description'] },
        { model: User, as: 'members', attributes: ['username'] },
        { model: User, as: 'delegates', attributes: ['username'] },
      ],
    });

    res.status(200).json(groups);
  } catch (error) {
    console.error('Error fetching groups:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// Get a single group by ID
export const getGroupById = async (req: Request, res: Response) => {
  try {
    const group = await Group.findByPk(req.params.id, {
      include: [
        { model: GroupType, attributes: ['name', 'description'] },
        { model: User, as: 'members', attributes: ['username'] },
        { model: User, as: 'delegates', attributes: ['username'] },
        'events',
      ],
    });

    if (!group) {
      return res.status(404).json({ message: 'Group not found' });
    }

    res.status(200).json(group);
  } catch (error) {
    console.error('Error fetching group:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// Update a group
export const updateGroup = async (req: Request, res: Response) => {
  try {
    const group = await Group.findByPk(req.params.id);

    if (!group) {
      return res.status(404).json({ message: 'Group not found' });
    }

    // Check if the user is an Admin of the group
    const user = await User.findByPk(req.user.id);
    if (!user || !(await user.hasRole(group.id, 'Admin'))) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    const { name, description, groupTypeId, categoryBadge, profilePicture } = req.body;

    if (groupTypeId) {
      const groupType = await GroupType.findByPk(groupTypeId);
      if (!groupType) {
        return res.status(400).json({ message: 'Invalid group type' });
      }
    }

    await group.update({
      name: name || group.name,
      description: description || group.description,
      groupTypeId: groupTypeId || group.groupTypeId,
      categoryBadge: categoryBadge || group.categoryBadge,
      profilePicture: profilePicture || group.profilePicture,
    });

    io.emit('groupUpdated', group);
    res.status(200).json(group);
  } catch (error) {
    console.error('Error updating group:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// Delete a group
export const deleteGroup = async (req: Request, res: Response) => {
  try {
    const group = await Group.findByPk(req.params.id);

    if (!group) {
      return res.status(404).json({ message: 'Group not found' });
    }

    // Check if the user is an Admin of the group
    const user = await User.findByPk(req.user.id);
    if (!user || !(await user.hasRole(group.id, 'Admin'))) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    await group.destroy();

    // Remove group from all members' group lists and roles
    const members = await group.getMembers();
    for (const member of members) {
      await member.removeGroup(group);
      await member.removeRole(group.id);
    }

    io.emit('groupDeleted', { groupId: req.params.id });
    res.status(200).json({ message: 'Group deleted successfully' });
  } catch (error) {
    console.error('Error deleting group:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// Add a member to a group
export const addMember = async (req: Request, res: Response) => {
  try {
    const { groupId, userId } = req.body;

    const group = await Group.findByPk(groupId);
    if (!group) {
      return res.status(404).json({ message: 'Group not found' });
    }

    // Check if requester is an Admin or Delegate
    const requester = await User.findByPk(req.user.id);
    if (
      !requester ||
      !(await requester.hasRole(groupId, 'Admin')) &&
      !(await requester.hasRole(groupId, 'Delegate'))
    ) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    const userToAdd = await User.findByPk(userId);
    if (!userToAdd) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (await group.hasMember(userToAdd)) {
      return res.status(400).json({ message: 'User is already a member' });
    }

    await group.addMember(userToAdd);
    await userToAdd.setRole(group.id, 'Member');

    res.status(200).json({ message: 'Member added successfully' });
  } catch (error) {
    console.error('Error adding member:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// Remove a member from a group
export const removeMember = async (req: Request, res: Response) => {
  try {
    const { groupId, userId } = req.body;

    const group = await Group.findByPk(groupId);
    if (!group) {
      return res.status(404).json({ message: 'Group not found' });
    }

    // Check if requester is an Admin or Delegate
    const requester = await User.findByPk(req.user.id);
    if (
      !requester ||
      !(await requester.hasRole(groupId, 'Admin')) &&
      !(await requester.hasRole(groupId, 'Delegate'))
    ) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    const userToRemove = await User.findByPk(userId);
    if (!userToRemove) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (!(await group.hasMember(userToRemove))) {
      return res.status(400).json({ message: 'User is not a member' });
    }

    await group.removeMember(userToRemove);
    await group.removeDelegate(userToRemove);
    await userToRemove.removeRole(group.id);

    res.status(200).json({ message: 'Member removed successfully' });
  } catch (error) {
    console.error('Error removing member:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// Assign a delegate in a group
export const assignDelegate = async (req: Request, res: Response) => {
  try {
    const { groupId, userId } = req.body;

    const group = await Group.findByPk(groupId);
    if (!group) {
      return res.status(404).json({ message: 'Group not found' });
    }

    // Check if requester is an Admin
    const requester = await User.findByPk(req.user.id);
    if (!requester || !(await requester.hasRole(groupId, 'Admin'))) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    const userToAssign = await User.findByPk(userId);
    if (!userToAssign) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (!(await group.hasMember(userToAssign))) {
      return res.status(400).json({ message: 'User is not a member of the group' });
    }

    if (await group.hasDelegate(userToAssign)) {
      return res.status(400).json({ message: 'User is already a delegate' });
    }

    await group.addDelegate(userToAssign);
    await userToAssign.setRole(group.id, 'Delegate');

    res.status(200).json({ message: 'Delegate assigned successfully' });
  } catch (error) {
    console.error('Error assigning delegate:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// Revoke a delegate in a group
export const revokeDelegate = async (req: Request, res: Response) => {
  try {
    const { groupId, userId } = req.body;

    const group = await Group.findByPk(groupId);
    if (!group) {
      return res.status(404).json({ message: 'Group not found' });
    }

    // Check if requester is an Admin
    const requester = await User.findByPk(req.user.id);
    if (!requester || !(await requester.hasRole(groupId, 'Admin'))) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    const userToRevoke = await User.findByPk(userId);
    if (!userToRevoke) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (!(await group.hasDelegate(userToRevoke))) {
      return res.status(400).json({ message: 'User is not a delegate' });
    }

    await group.removeDelegate(userToRevoke);
    await userToRevoke.setRole(group.id, 'Member');

    res.status(200).json({ message: 'Delegate revoked successfully' });
  } catch (error) {
    console.error('Error revoking delegate:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};
