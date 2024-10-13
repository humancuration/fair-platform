import { PubSub } from 'graphql-subscriptions';
import { initializeRepo } from '../services/versionControlService';
import { v4 as uuidv4 } from 'uuid';

const pubsub = new PubSub();

export const resolvers = {
  Query: {
    user: async (_, { id }, { dataSources }) => {
      return dataSources.userAPI.getUserById(id);
    },
    group: async (_, { id }, { dataSources }) => {
      return dataSources.groupAPI.getGroupById(id);
    },
    allGroups: async (_, __, { dataSources }) => {
      return dataSources.groupAPI.getAllGroups();
    },
  },
  Mutation: {
    createGroup: async (_, { name, description }, { dataSources }) => {
      const newGroup = await dataSources.groupAPI.createGroup({ name, description });
      pubsub.publish('GROUP_CREATED', { groupCreated: newGroup });
      return newGroup;
    },
    joinGroup: async (_, { groupId }, { dataSources, currentUser }) => {
      const updatedGroup = await dataSources.groupAPI.addMemberToGroup(groupId, currentUser.id);
      pubsub.publish('NEW_GROUP_MEMBER', { newGroupMember: currentUser, groupId });
      return updatedGroup;
    },
    initializeRepository: async (_, { name }) => {
      await initializeRepo(name);
      return { 
        id: uuidv4(), 
        name, 
        createdAt: new Date().toISOString() 
      };
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
