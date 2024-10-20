import { gql } from 'graphql-tag';

export const typeDefs = gql`
  type User {
    id: ID!
    username: String!
    email: String!
    groups: [Group!]!
  }

  type Group {
    id: ID!
    name: String!
    description: String
    members: [User!]!
    events: [Event!]!
  }

  type Event {
    id: ID!
    title: String!
    description: String
    date: String!
    group: Group!
  }

  type Repository {
    id: ID!
    name: String!
    createdAt: String!
    lfsEnabled: Boolean!
  }

  type CommitAuthor {
    name: String!
    email: String!
    timestamp: String!
  }

  type Commit {
    oid: String!
    message: String!
    author: CommitAuthor!
  }

  type StatusResult {
    files: [String!]!
    staged: [String!]!
    unstaged: [String!]!
  }

  input CreateUserInput {
    username: String!
    email: String!
    password: String!
  }

  type Query {
    user(id: ID!): User
    group(id: ID!): Group
    allGroups: [Group!]!
    repositories: [Repository!]!
    getStatus(dir: String!): StatusResult!
    getLog(dir: String!, depth: Int): [Commit!]!
  }

  type Mutation {
    createUser(input: CreateUserInput!): User!
    createGroup(name: String!, description: String): Group!
    joinGroup(groupId: ID!): Group!
    initializeRepository(name: String!): Repository!
    cloneRepository(url: String!, name: String!): Repository!
    commitChanges(repoName: String!, filepath: String!, message: String!): Boolean!
    pushChanges(repoName: String!): Boolean!
    createBranch(dir: String!, branchName: String!): Boolean!
    switchBranch(dir: String!, branchName: String!): Boolean!
  }

  type Subscription {
    groupCreated: Group!
    newGroupMember(groupId: ID!): User!
  }
`;
