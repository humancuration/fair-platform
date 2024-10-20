import { initializeRepo, cloneRepo, addAndCommit, pushChanges } from '../modules/versionControl/versionControlService';

const versionControlResolvers = {
  Query: {
    repositories: async (_, __, { user }) => {
      // Implement logic to fetch repositories for the user
    },
  },
  Mutation: {
    initializeRepository: async (_, { name }, { user }) => {
      await initializeRepo(name);
      // Return the created repository object
    },
    cloneRepository: async (_, { url, name }, { user }) => {
      await cloneRepo(url, name);
      // Return the cloned repository object
    },
    pushChanges: async (_, { repoName }, { user }) => {
      await pushChanges(repoName);
      return true;
    },
    commitChanges: async (_, { repoName, filepath, message }, { user }) => {
      await addAndCommit(repoName, filepath, message);
      return true;
    },
  },
};

export default versionControlResolvers;
