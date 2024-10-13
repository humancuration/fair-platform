import { gql } from '@apollo/server'; // Updated import to @apollo/server

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

  type Query {
    user(id: ID!): User
    group(id: ID!): Group
    allGroups: [Group!]!
  }

  type Mutation {
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
