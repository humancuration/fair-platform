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

  // Add these types to the existing schema
  type SurveyResult {
    id: ID!
    surveyId: ID!
    respondentId: ID
    answers: JSON!
    createdAt: String!
    metadata: JSON
  }

  type SurveyAnalysis {
    questionId: String!
    questionType: String!
    responses: [ResponseAnalysis!]!
    aggregates: AnalyticsAggregate
  }

  type ResponseAnalysis {
    answer: JSON!
    count: Int!
    percentage: Float!
  }

  type AnalyticsAggregate {
    mean: Float
    median: Float
    mode: [String!]
    standardDeviation: Float
    correlations: [Correlation!]
  }

  type Correlation {
    questionId: String!
    coefficient: Float!
    strength: String!
  }

  extend type Query {
    surveyResults(surveyId: ID!): [SurveyResult!]!
    combinedAnalysis(surveyIds: [ID!]!): [SurveyAnalysis!]!
    crossSurveyCorrelations(surveyIds: [ID!]!, questionIds: [String!]!): [Correlation!]!
  }

  type Emoji {
    id: ID!
    name: String!
    url: String!
    createdBy: User!
    groupId: String
    price: Float!
    isPublic: Boolean!
    createdAt: DateTime!
    updatedAt: DateTime!
  }

  extend type Query {
    groupEmojis(groupId: ID!): [Emoji!]!
    publicEmojis: [Emoji!]!
    purchasedEmojis: [Emoji!]!
  }

  extend type Mutation {
    uploadEmoji(
      groupId: ID
      file: Upload!
      name: String!
      price: Float!
      isPublic: Boolean!
    ): Emoji!
    
    updateEmoji(
      emojiId: ID!
      name: String
      price: Float
      isPublic: Boolean
    ): Emoji!
    
    deleteEmoji(emojiId: ID!): Boolean!
    
    purchaseEmoji(emojiId: ID!): Boolean!
  }
`;
