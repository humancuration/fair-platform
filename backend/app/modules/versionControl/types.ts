import { User } from '../auth/types';

export interface Repository {
  id: string;
  name: string;
  description?: string;
  owner: User;
  createdAt: Date;
  updatedAt: Date;
  isPrivate: boolean;
  defaultBranch: string;
  lfsEnabled: boolean;
}

export interface CommitAuthor {
  name: string;
  email: string;
  timestamp: Date;
}

export interface Commit {
  oid: string;
  message: string;
  author: CommitAuthor;
  parentOids: string[];
}

export interface BranchInfo {
  name: string;
  commit: string;
  isDefault: boolean;
  protected: boolean;
}

export interface RepositoryStatus {
  files: string[];
  staged: string[];
  unstaged: string[];
  branch: string;
  ahead: number;
  behind: number;
}

export interface VersionControlError extends Error {
  code: string;
  details?: any;
}

export type RepoProvider = 'github' | 'gitea' | 'local';
