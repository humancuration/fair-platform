import { gql } from '@apollo/client';

export const GET_REPOSITORIES = gql`
  query GetRepositories {
    repositories {
      id
      name
      url
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
