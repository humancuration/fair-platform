import * as git from 'isomorphic-git';
import http from 'isomorphic-git/http/node';
import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import logger from '../../utils/logger';

const repoDir = path.resolve(__dirname, '../../../repositories');

export const initializeRepo = async (repoName: string): Promise<void> => {
  const fullPath = path.join(repoDir, repoName);
  try {
    await git.init({ fs, dir: fullPath });
    
    // Initialize Git LFS
    execSync('git lfs install', { cwd: fullPath });
    
    // Set up Git LFS for common large file types
    const lfsTrackPatterns = ['*.psd', '*.png', '*.jpg', '*.mp4', '*.zip'];
    lfsTrackPatterns.forEach(pattern => {
      execSync(`git lfs track "${pattern}"`, { cwd: fullPath });
    });

    // Initial commit
    await git.add({ fs, dir: fullPath, filepath: '.gitattributes' });
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

export const cloneRepo = async (url: string, dir: string): Promise<void> => {
  const fullPath = path.join(repoDir, dir);
  try {
    await git.clone({
      fs,
      http,
      dir: fullPath,
      url,
      depth: 1
    });
    // Pull LFS files
    execSync('git lfs pull', { cwd: fullPath });
    logger.info(`Cloned repository from ${url} to ${dir}`);
  } catch (error) {
    logger.error(`Error cloning repository from ${url}:`, error);
    throw new Error(`Failed to clone repository: ${error.message}`);
  }
};

export const addAndCommit = async (dir: string, filepath: string, message: string): Promise<void> => {
  const fullPath = path.join(repoDir, dir);
  try {
    await git.add({ fs, dir: fullPath, filepath });
    await git.commit({
      fs,
      dir: fullPath,
      message,
      author: {
        name: 'User',
        email: 'user@example.com'
      }
    });
    logger.info(`Committed changes to ${filepath} in ${dir}`);
  } catch (error) {
    logger.error(`Error committing changes to ${filepath} in ${dir}:`, error);
    throw new Error(`Failed to commit changes: ${error.message}`);
  }
};

export const pushChanges = async (dir: string): Promise<void> => {
  const fullPath = path.join(repoDir, dir);
  try {
    await git.push({
      fs,
      http,
      dir: fullPath,
      remote: 'origin',
      ref: 'main'
    });
    // Push LFS objects
    execSync('git lfs push --all origin main', { cwd: fullPath });
    logger.info(`Pushed changes for ${dir}`);
  } catch (error) {
    logger.error(`Error pushing changes for ${dir}:`, error);
    throw new Error(`Failed to push changes: ${error.message}`);
  }
};
