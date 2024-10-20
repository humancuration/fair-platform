import { PubSub } from 'graphql-subscriptions';
import { UserService } from '../modulesb/user/userService';
import { GroupService } from '../modulesb/group/groupService';
import { GraphQLError } from 'graphql';
import { initializeRepo, cloneRepo, addAndCommit, pushChanges } from '../services/versionControlService';
import { v4 as uuidv4 } from 'uuid';

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
    initializeRepository: async (_: unknown, { name }: { name: string }) => { // Explicitly define type for _ as unknown
      await initializeRepo(name);
      return { 
        id: uuidv4(), 
        name, 
        createdAt: new Date().toISOString(),
        lfsEnabled: true
      };
    },
    cloneRepository: async (_: unknown, { url, name }: { url: string; name: string }) => { // Explicitly define type for _ as unknown
      await cloneRepo(url, name);
      return {
        id: uuidv4(),
        name,
        createdAt: new Date().toISOString(),
        lfsEnabled: true
      };
    },
    commitChanges: async (_: unknown, { repoName, filepath, message }: { repoName: string; filepath: string; message: string }) => { // Explicitly define the type for _ as unknown
      await addAndCommit(repoName, filepath, message);
      return true;
    },
    pushChanges: async (_: any, { repoName }: { repoName: string }) => { // Explicitly define the type for _ as any
      await pushChanges(repoName);
      return true;
    },
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
