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

  input CreateUserInput {
    username: String!
    email: String!
    password: String!
  }

  type Query {
    user(id: ID!): User
    group(id: ID!): Group
    allGroups: [Group!]!
  }

  type Mutation {
    createUser(input: CreateUserInput!): User!
    createGroup(name: String!, description: String): Group!
    joinGroup(groupId: ID!): Group!
    initializeRepository(name: String!): Repository!
    cloneRepository(url: String!, name: String!): Repository!
    commitChanges(repoName: String!, filepath: String!, message: String!): Boolean!
    pushChanges(repoName: String!): Boolean!
  }

  type Subscription {
    groupCreated: Group!
    newGroupMember(groupId: ID!): User!
  }
`;
