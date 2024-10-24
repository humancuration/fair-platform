import { User } from '../../types/auth';

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
  url?: string;
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

export type RepoProvider = 'github' | 'gitea' | 'local';

export interface RepositoryOperation {
  type: 'commit' | 'push' | 'branch' | 'merge';
  status: 'pending' | 'success' | 'error';
  message: string;
  timestamp: Date;
}
