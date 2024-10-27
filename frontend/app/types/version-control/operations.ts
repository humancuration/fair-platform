export type RepoOperation = 'commit' | 'push' | 'branch' | 'merge';

export interface OperationStatus {
  type: RepoOperation;
  status: 'pending' | 'success' | 'error';
  message: string;
  timestamp: Date;
}

export interface CommitInfo {
  oid: string;
  message: string;
  author: {
    name: string;
    email: string;
    timestamp: Date;
  };
  parentOids: string[];
}

export interface BranchInfo {
  name: string;
  commit: string;
  isDefault: boolean;
  protected: boolean;
}

export interface FileChange {
  path: string;
  status: 'added' | 'modified' | 'deleted' | 'renamed';
  oldPath?: string;
}
