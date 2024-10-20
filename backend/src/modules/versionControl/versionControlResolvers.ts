import { 
  initializeRepo, 
  cloneRepo, 
  addAndCommit, 
  pushChanges, 
  createBranch, 
  switchBranch, 
  getStatus, 
  getLog 
} from './versionControlService';
import { GraphQLError } from 'graphql';
import { v4 as uuidv4 } from 'uuid';

const versionControlResolvers = {
  Query: {
    repositories: async (_: unknown, __: unknown, { user }: { user: any }) => {
      // Implement logic to fetch repositories for the user
      // This will depend on how you're storing repository information
      throw new Error('Not implemented');
    },
    getStatus: async (_: unknown, { dir }: { dir: string }) => {
      try {
        return await getStatus(dir);
      } catch (error) {
        throw new GraphQLError('Failed to get repository status', {
          extensions: { code: 'OPERATION_FAILED' },
        });
      }
    },
    getLog: async (_: unknown, { dir, depth }: { dir: string; depth?: number }) => {
      try {
        return await getLog(dir, depth);
      } catch (error) {
        throw new GraphQLError('Failed to get repository log', {
          extensions: { code: 'OPERATION_FAILED' },
        });
      }
    },
  },
  Mutation: {
    initializeRepository: async (_: unknown, { name }: { name: string }) => {
      try {
        await initializeRepo(name);
        return {
          id: uuidv4(),
          name,
          createdAt: new Date().toISOString(),
          lfsEnabled: true,
        };
      } catch (error) {
        throw new GraphQLError('Failed to initialize repository', {
          extensions: { code: 'OPERATION_FAILED' },
        });
      }
    },
    cloneRepository: async (_: unknown, { url, name }: { url: string; name: string }) => {
      try {
        await cloneRepo(url, name);
        return {
          id: uuidv4(),
          name,
          createdAt: new Date().toISOString(),
          lfsEnabled: true,
        };
      } catch (error) {
        throw new GraphQLError('Failed to clone repository', {
          extensions: { code: 'OPERATION_FAILED' },
        });
      }
    },
    commitChanges: async (_: unknown, { repoName, filepath, message }: { repoName: string; filepath: string; message: string }, { user }: { user: any }) => {
      try {
        await addAndCommit(repoName, filepath, message, { name: user.username, email: user.email });
        return true;
      } catch (error) {
        throw new GraphQLError('Failed to commit changes', {
          extensions: { code: 'OPERATION_FAILED' },
        });
      }
    },
    pushChanges: async (_: unknown, { repoName }: { repoName: string }) => {
      try {
        await pushChanges(repoName);
        return true;
      } catch (error) {
        throw new GraphQLError('Failed to push changes', {
          extensions: { code: 'OPERATION_FAILED' },
        });
      }
    },
    createBranch: async (_: unknown, { dir, branchName }: { dir: string; branchName: string }) => {
      try {
        await createBranch(dir, branchName);
        return true;
      } catch (error) {
        throw new GraphQLError('Failed to create branch', {
          extensions: { code: 'OPERATION_FAILED' },
        });
      }
    },
    switchBranch: async (_: unknown, { dir, branchName }: { dir: string; branchName: string }) => {
      try {
        await switchBranch(dir, branchName);
        return true;
      } catch (error) {
        throw new GraphQLError('Failed to switch branch', {
          extensions: { code: 'OPERATION_FAILED' },
        });
      }
    },
  },
};

export default versionControlResolvers;
