import { PubSub } from 'graphql-subscriptions';
import { UserService } from '../modules/user/userService';
import { GroupService } from '../modules/group/groupService';
import { GraphQLError } from 'graphql';
import versionControlResolvers from '../modules/versionControl/versionControlResolvers';

const pubsub = new PubSub();
const userService = new UserService();
const groupService = new GroupService();

export const resolvers = {
  Query: {
    user: async (_: unknown, { id }: { id: string }) => {
      try {
        const user = await userService.getUserById(id);
        if (!user) {
          throw new GraphQLError('User not found', {
            extensions: { code: 'USER_NOT_FOUND' },
          });
        }
        return user;
      } catch (error) {
        console.error('Error fetching user:', error);
        throw new GraphQLError('Failed to fetch user');
      }
    },
    group: async (_: unknown, { id }: { id: string }) => {
      try {
        const group = await groupService.getGroupById(id);
        if (!group) {
          throw new GraphQLError('Group not found', {
            extensions: { code: 'GROUP_NOT_FOUND' },
          });
        }
        return group;
      } catch (error) {
        console.error('Error fetching group:', error);
        throw new GraphQLError('Failed to fetch group');
      }
    },
    allGroups: async () => {
      try {
        return await groupService.getAllGroups();
      } catch (error) {
        console.error('Error fetching groups:', error);
        throw new Error('Failed to fetch groups');
      }
    },
    ...versionControlResolvers.Query,
  },
  Mutation: {
    createUser: async (_: unknown, { input }: { input: any }) => {
      try {
        const user = await userService.createUser(input);
        return user;
      } catch (error) {
        console.error('Error creating user:', error);
        throw new Error('Failed to create user');
      }
    },
    createGroup: async (_: unknown, { name, description }: { name: string; description: string }) => {
      try {
        const newGroup = await groupService.createGroup({ name, description });
        pubsub.publish('GROUP_CREATED', { groupCreated: newGroup });
        return newGroup;
      } catch (error) {
        console.error('Error creating group:', error);
        throw new Error('Failed to create group');
      }
    },
    joinGroup: async (_: unknown, { groupId }: { groupId: string }, { currentUser }: { currentUser: { id: string } }) => {
      if (!currentUser) {
        throw new GraphQLError('You must be logged in to join a group', {
          extensions: { code: 'UNAUTHENTICATED' },
        });
      }
      try {
        const updatedGroup = await groupService.addMemberToGroup(groupId, currentUser.id);
        pubsub.publish('NEW_GROUP_MEMBER', { newGroupMember: currentUser, groupId });
        return updatedGroup;
      } catch (error) {
        console.error('Error joining group:', error);
        throw new GraphQLError('Failed to join group');
      }
    },
    ...versionControlResolvers.Mutation,
  },
  Subscription: {
    groupCreated: {
      subscribe: () => pubsub.asyncIterator(['GROUP_CREATED']),
    },
    newGroupMember: {
      subscribe: () => pubsub.asyncIterator(['NEW_GROUP_MEMBER']),
    },
  },
};
