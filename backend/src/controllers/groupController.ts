import { Request, Response } from 'express';
import Group from '../models/Group';
import User from '../models/User';
import GroupType from '../models/GroupType';
import { io } from '../server';
import { createDiscourseCategory } from '../services/discourseService';
import { createMoodleCourse } from '../services/moodleService';
import { triggerN8nWorkflow } from '../services/n8nService';
import { createMauticContact, addContactToSegment, triggerCampaign } from '../services/mauticService';
import { sendMessageToChannel } from '../discordBot';
import { sendDiscordWebhook } from '../services/discordService';
import { sendRocketChatMessage } from '../services/rocketChatService';
import { createWekanCard } from '../services/wekanService';
import { createNextcloudFolder } from '../services/nextcloudService';

interface Group {
  name: string;
  // Add other properties as needed
}

interface User {
  username: string;
  // Add other properties as needed
}

// Create a new group
export const createGroup = async (req: Request, res: Response) => {
  try {
    const { name, description, groupTypeId, categoryBadge, profilePicture } = req.body;
    const creatorId = req.user.id;

    // Validate group type
    const groupType = await GroupType.findById(groupTypeId);
    if (!groupType) {
      return res.status(400).json({ message: 'Invalid group type' });
    }

    // Create the group
    const group = new Group({
      name,
      description,
      groupType: groupTypeId,
      categoryBadge,
      profilePicture,
      members: [creatorId],
      delegates: [],
      events: [],
    });

    await group.save();

    // Update user's groups and roles
    const user = await User.findById(creatorId);
    if (user) {
      user.groups.push(group._id);
      user.roles.set(group._id.toString(), 'Admin');
      await user.save();
    }

    // Create Discourse category for the group
    const discourseCategory = await createDiscourseCategory(group.name, group.description);

    // Create Moodle course for the group
    const moodleCourse = await createMoodleCourse(group.name, group.description);

    // Update group with Discourse and Moodle IDs
    group.discourseCategoryId = discourseCategory.id;
    group.moodleCourseId = moodleCourse.id;
    await group.save();

    // Trigger n8n workflow
    await triggerN8nWorkflow('newGroupWorkflow', { groupId: group._id, groupName: group.name });

    // Create Mautic contact for group creator
    const mauticContact = await createMauticContact({
      firstname: user.firstName,
      lastname: user.lastName,
      email: user.email,
      tags: ['Group Creator'],
    });

    // Add contact to a "Group Creators" segment (assuming segment ID 1)
    await addContactToSegment(mauticContact.contact.id, 1);

    // Trigger a welcome campaign for new group creators (assuming campaign ID 1)
    await triggerCampaign(1, mauticContact.contact.id);

    // Notify Discord channel
    const discordChannelId = process.env.DISCORD_CHANNEL_ID!; // Use non-null assertion
    const message = `🎉 New Group Created: **${group.name}** by ${user.username}! Join us to collaborate and innovate.`;
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
    await createWekanCard(wekanBoardId, wekanListId, `New Group: ${group.name}`, `Created by ${user.username}`);

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
    const groups = await Group.find()
      .populate('groupType', 'name description')
      .populate('members', 'username')
      .populate('delegates', 'username');

    res.status(200).json(groups);
  } catch (error) {
    console.error('Error fetching groups:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// Get a single group by ID
export const getGroupById = async (req: Request, res: Response) => {
  try {
    const group = await Group.findById(req.params.id)
      .populate('groupType', 'name description')
      .populate('members', 'username')
      .populate('delegates', 'username')
      .populate('events');

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
    const group = await Group.findById(req.params.id);

    if (!group) {
      return res.status(404).json({ message: 'Group not found' });
    }

    // Check if the user is an Admin of the group
    const user = await User.findById(req.user.id);
    if (!user || user.roles.get(group._id.toString()) !== 'Admin') {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    const { name, description, groupTypeId, categoryBadge, profilePicture } = req.body;

    if (groupTypeId) {
      const groupType = await GroupType.findById(groupTypeId);
      if (!groupType) {
        return res.status(400).json({ message: 'Invalid group type' });
      }
      group.groupType = groupTypeId;
    }

    if (name) group.name = name;
    if (description) group.description = description;
    if (categoryBadge) group.categoryBadge = categoryBadge;
    if (profilePicture) group.profilePicture = profilePicture;

    await group.save();

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
    const group = await Group.findById(req.params.id);

    if (!group) {
      return res.status(404).json({ message: 'Group not found' });
    }

    // Check if the user is an Admin of the group
    const user = await User.findById(req.user.id);
    if (!user || user.roles.get(group._id.toString()) !== 'Admin') {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    await group.remove();

    // Remove group from all members' group lists
    await User.updateMany(
      { groups: group._id },
      { $pull: { groups: group._id }, $unset: { [`roles.${group._id.toString()}`]: '' } }
    );

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

    const group = await Group.findById(groupId);
    if (!group) {
      return res.status(404).json({ message: 'Group not found' });
    }

    // Check if requester is an Admin or Delegate
    const requester = await User.findById(req.user.id);
    if (
      !requester ||
      (requester.roles.get(groupId) !== 'Admin' && requester.roles.get(groupId) !== 'Delegate')
    ) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    const userToAdd = await User.findById(userId);
    if (!userToAdd) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (group.members.includes(userId)) {
      return res.status(400).json({ message: 'User is already a member' });
    }

    group.members.push(userId);
    await group.save();

    userToAdd.groups.push(group._id);
    userToAdd.roles.set(group._id.toString(), 'Member');
    await userToAdd.save();

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

    const group = await Group.findById(groupId);
    if (!group) {
      return res.status(404).json({ message: 'Group not found' });
    }

    // Check if requester is an Admin or Delegate
    const requester = await User.findById(req.user.id);
    if (
      !requester ||
      (requester.roles.get(groupId) !== 'Admin' && requester.roles.get(groupId) !== 'Delegate')
    ) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    if (!group.members.includes(userId)) {
      return res.status(400).json({ message: 'User is not a member' });
    }

    group.members.pull(userId);
    group.delegates.pull(userId); // Also remove from delegates if applicable
    await group.save();

    const user = await User.findById(userId);
    if (user) {
      user.groups.pull(group._id);
      user.roles.delete(group._id.toString());
      await user.save();
    }

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

    const group = await Group.findById(groupId);
    if (!group) {
      return res.status(404).json({ message: 'Group not found' });
    }

    // Check if requester is an Admin
    const requester = await User.findById(req.user.id);
    if (!requester || requester.roles.get(groupId) !== 'Admin') {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    if (!group.members.includes(userId)) {
      return res.status(400).json({ message: 'User is not a member of the group' });
    }

    if (group.delegates.includes(userId)) {
      return res.status(400).json({ message: 'User is already a delegate' });
    }

    group.delegates.push(userId);
    await group.save();

    const user = await User.findById(userId);
    if (user) {
      user.roles.set(groupId.toString(), 'Delegate');
      await user.save();
    }

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

    const group = await Group.findById(groupId);
    if (!group) {
      return res.status(404).json({ message: 'Group not found' });
    }

    // Check if requester is an Admin
    const requester = await User.findById(req.user.id);
    if (!requester || requester.roles.get(groupId) !== 'Admin') {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    if (!group.delegates.includes(userId)) {
      return res.status(400).json({ message: 'User is not a delegate' });
    }

    group.delegates.pull(userId);
    await group.save();

    const user = await User.findById(userId);
    if (user) {
      user.roles.set(groupId.toString(), 'Member');
      await user.save();
    }

    res.status(200).json({ message: 'Delegate revoked successfully' });
  } catch (error) {
    console.error('Error revoking delegate:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};
