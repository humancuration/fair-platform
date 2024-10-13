import { PubSub } from 'graphql-subscriptions';
import { initializeRepo, cloneRepo, addAndCommit, pushChanges } from '../services/versionControlService';
import { v4 as uuidv4 } from 'uuid';

const pubsub = new PubSub();

export const resolvers = {
  Query: {
    user: async (_: unknown, { id }: { id: string }, { dataSources }: { dataSources: { userAPI: any } }) => { // Explicitly define type for _
      return dataSources.userAPI.getUserById(id);
    },
    group: async (_: unknown, { id }: { id: string }, { dataSources }: { dataSources: { groupAPI: any } }) => {
      return dataSources.groupAPI.getGroupById(id);
    },
    allGroups: async (_: unknown, __: unknown, { dataSources }: { dataSources: { groupAPI: any } }) => { // Explicitly define type for _
      return dataSources.groupAPI.getAllGroups();
    },
  },
  Mutation: {
    createGroup: async (_: unknown, { name, description }: { name: string; description: string }, { dataSources }: { dataSources: { groupAPI: any } }) => { // Explicitly define type for dataSources
      const newGroup = await dataSources.groupAPI.createGroup({ name, description });
      pubsub.publish('GROUP_CREATED', { groupCreated: newGroup });
      return newGroup;
    },
    joinGroup: async (_: unknown, { groupId }: { groupId: string }, { dataSources, currentUser }: { dataSources: { groupAPI: any }, currentUser: { id: string } }) => {
      const updatedGroup = await dataSources.groupAPI.addMemberToGroup(groupId, currentUser.id);
      pubsub.publish('NEW_GROUP_MEMBER', { newGroupMember: currentUser, groupId });
      return updatedGroup;
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
