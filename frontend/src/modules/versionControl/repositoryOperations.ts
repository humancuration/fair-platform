import { gql } from '@apollo/client';

export const GET_REPOSITORIES = gql`
  query GetRepositories {
    repositories {
      id
      name
      description
      owner {
        username
        email
      }
      isPrivate
      defaultBranch
      lfsEnabled
      createdAt
      updatedAt
    }
  }
`;

export const INITIALIZE_REPOSITORY = gql`
  mutation InitializeRepository($name: String!) {
    initializeRepository(name: $name) {
      id
      name
      url
    }
  }
`;

export const CLONE_REPOSITORY = gql`
  mutation CloneRepository($url: String!, $name: String!) {
    cloneRepository(url: $url, name: $name) {
      id
      name
      url
    }
  }
`;

export const PUSH_CHANGES = gql`
  mutation PushChanges($repoName: String!) {
    pushChanges(repoName: $repoName)
  }
`;

export const COMMIT_CHANGES = gql`
  mutation CommitChanges($repoName: String!, $filepath: String!, $message: String!) {
    commitChanges(repoName: $repoName, filepath: $filepath, message: $message)
  }
`;

export const CREATE_BRANCH = gql`
  mutation CreateBranch($dir: String!, $branchName: String!) {
    createBranch(dir: $dir, branchName: $branchName)
  }
`;

export const SWITCH_BRANCH = gql`
  mutation SwitchBranch($dir: String!, $branchName: String!) {
    switchBranch(dir: $dir, branchName: $branchName)
  }
`;

export const GET_STATUS = gql`
  query GetStatus($dir: String!) {
    getStatus(dir: $dir) {
      files
      staged
      unstaged
    }
  }
`;

export const GET_LOG = gql`
  query GetLog($dir: String!, $depth: Int) {
    getLog(dir: $dir, depth: $depth) {
      oid
      message
      author {
        name
        email
        timestamp
      }
    }
  }
`;

export const DELETE_REPOSITORY = gql`
  mutation DeleteRepository($id: ID!) {
    deleteRepository(id: $id)
  }
`;

export const UPDATE_REPOSITORY = gql`
  mutation UpdateRepository(
    $id: ID!
    $name: String
    $description: String
    $isPrivate: Boolean
    $defaultBranch: String
  ) {
    updateRepository(
      id: $id
      name: $name
      description: $description
      isPrivate: $isPrivate
      defaultBranch: $defaultBranch
    ) {
      id
      name
      description
      isPrivate
      defaultBranch
      updatedAt
    }
  }
`;
