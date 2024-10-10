import { gql } from 'apollo-server-express';

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

  type Query {
    user(id: ID!): User
    group(id: ID!): Group
    allGroups: [Group!]!
  }

  type Mutation {
    createGroup(name: String!, description: String): Group!
    joinGroup(groupId: ID!): Group!
  }

  type Subscription {
    groupCreated: Group!
    newGroupMember(groupId: ID!): User!
  }
`;