import * as git from 'isomorphic-git';
import http from 'isomorphic-git/http/node';
import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import logger from '../../utils/logger';

const repoDir = path.resolve(__dirname, '../../../repositories');

export const initializeRepo = async (repoName: string, description?: string): Promise<void> => {
  const fullPath = path.join(repoDir, repoName);
  try {
    await git.init({ fs, dir: fullPath });
    
    // Initialize Git LFS
    execSync('git lfs install', { cwd: fullPath });
    
    // Set up Git LFS for common large file types
    const lfsTrackPatterns = ['*.psd', '*.png', '*.jpg', '*.mp4', '*.zip', '*.pdf', '*.ai', '*.sketch'];
    lfsTrackPatterns.forEach(pattern => {
      execSync(`git lfs track "${pattern}"`, { cwd: fullPath });
    });

    // Create README.md with description
    if (description) {
      fs.writeFileSync(path.join(fullPath, 'README.md'), `# ${repoName}\n\n${description}`);
    }

    // Initial commit
    await git.add({ fs, dir: fullPath, filepath: '.' });
    await git.commit({
      fs,
      dir: fullPath,
      message: 'Initial commit with Git LFS setup',
      author: { name: 'System', email: 'system@example.com' }
    });
    logger.info(`Initialized repository: ${repoName}`);
  } catch (error) {
    logger.error(`Error initializing repository ${repoName}:`, error);
    throw new Error(`Failed to initialize repository: ${error.message}`);
  }
};

export const cloneRepo = async (url: string, dir: string, branch: string = 'main'): Promise<void> => {
  const fullPath = path.join(repoDir, dir);
  try {
    await git.clone({
      fs,
      http,
      dir: fullPath,
      url,
      ref: branch,
      singleBranch: true,
      depth: 1
    });
    // Pull LFS files
    execSync('git lfs pull', { cwd: fullPath });
    logger.info(`Cloned repository from ${url} to ${dir} (branch: ${branch})`);
  } catch (error) {
    logger.error(`Error cloning repository from ${url}:`, error);
    throw new Error(`Failed to clone repository: ${error.message}`);
  }
};

export const addAndCommit = async (dir: string, filepath: string, message: string, author: { name: string, email: string }): Promise<string> => {
  const fullPath = path.join(repoDir, dir);
  try {
    await git.add({ fs, dir: fullPath, filepath });
    const commitResult = await git.commit({
      fs,
      dir: fullPath,
      message,
      author
    });
    logger.info(`Committed changes to ${filepath} in ${dir}`);
    return commitResult;
  } catch (error) {
    logger.error(`Error committing changes to ${filepath} in ${dir}:`, error);
    throw new Error(`Failed to commit changes: ${error.message}`);
  }
};

export const pushChanges = async (dir: string, branch: string = 'main'): Promise<void> => {
  const fullPath = path.join(repoDir, dir);
  try {
    await git.push({
      fs,
      http,
      dir: fullPath,
      remote: 'origin',
      ref: branch
    });
    // Push LFS objects
    execSync(`git lfs push --all origin ${branch}`, { cwd: fullPath });
    logger.info(`Pushed changes for ${dir} to branch ${branch}`);
  } catch (error) {
    logger.error(`Error pushing changes for ${dir}:`, error);
    throw new Error(`Failed to push changes: ${error.message}`);
  }
};

export const createBranch = async (dir: string, branchName: string): Promise<void> => {
  const fullPath = path.join(repoDir, dir);
  try {
    await git.branch({ fs, dir: fullPath, ref: branchName });
    logger.info(`Created new branch ${branchName} in ${dir}`);
  } catch (error) {
    logger.error(`Error creating branch ${branchName} in ${dir}:`, error);
    throw new Error(`Failed to create branch: ${error.message}`);
  }
};

export const switchBranch = async (dir: string, branchName: string): Promise<void> => {
  const fullPath = path.join(repoDir, dir);
  try {
    await git.checkout({ fs, dir: fullPath, ref: branchName });
    logger.info(`Switched to branch ${branchName} in ${dir}`);
  } catch (error) {
    logger.error(`Error switching to branch ${branchName} in ${dir}:`, error);
    throw new Error(`Failed to switch branch: ${error.message}`);
  }
};

export const getStatus = async (dir: string): Promise<git.StatusResult> => {
  const fullPath = path.join(repoDir, dir);
  try {
    const status = await git.status({ fs, dir: fullPath });
    logger.info(`Retrieved status for ${dir}`);
    return status;
  } catch (error) {
    logger.error(`Error getting status for ${dir}:`, error);
    throw new Error(`Failed to get status: ${error.message}`);
  }
};

export const getLog = async (dir: string, depth: number = 10): Promise<Array<git.CommitDescription>> => {
  const fullPath = path.join(repoDir, dir);
  try {
    const log = await git.log({ fs, dir: fullPath, depth });
    logger.info(`Retrieved log for ${dir}`);
    return log;
  } catch (error) {
    logger.error(`Error getting log for ${dir}:`, error);
    throw new Error(`Failed to get log: ${error.message}`);
  }
};
