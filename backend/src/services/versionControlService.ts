import * as git from 'isomorphic-git';
import http from 'isomorphic-git/http/node';
import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

const repoDir = path.resolve(__dirname, '../../../repositories');

export const initializeRepo = async (repoName: string) => {
  const fullPath = path.join(repoDir, repoName);
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
};

export const cloneRepo = async (url: string, dir: string) => {
  const fullPath = path.join(repoDir, dir);
  await git.clone({
    fs,
    http,
    dir: fullPath,
    url,
    depth: 1
  });
  // Pull LFS files
  execSync('git lfs pull', { cwd: fullPath });
};

export const addAndCommit = async (dir: string, filepath: string, message: string) => {
  const fullPath = path.join(repoDir, dir);
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
};

export const pushChanges = async (dir: string) => {
  const fullPath = path.join(repoDir, dir);
  await git.push({
    fs,
    http,
    dir: fullPath,
    remote: 'origin',
    ref: 'main'
  });
  // Push LFS objects
  execSync('git lfs push --all origin main', { cwd: fullPath });
};