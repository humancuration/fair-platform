import { User } from '../user/User';
import { z } from 'zod';
import { gql } from '@apollo/server';

// GraphQL Schema
export const GroupTypeDefs = gql`
  type Group {
    id: ID!
    name: String!
    description: String!
    groupTypeId: Int!
    categoryBadge: String
    profilePicture: String
    createdAt: DateTime!
    updatedAt: DateTime!
    members: [GroupMember!]!
    settings: GroupSettings!
    integrations: GroupIntegrations
  }

  type GroupMember {
    id: ID!
    userId: ID!
    role: GroupRole!
    joinedAt: DateTime!
    user: User!
  }

  enum GroupRole {
    ADMIN
    MODERATOR
    MEMBER
    OBSERVER
  }

  type GroupSettings {
    isPublic: Boolean!
    allowNewMembers: Boolean!
    membershipCriteria: [String!]
  }

  type GroupIntegrations {
    discourseCategoryId: String
    moodleCourseId: String
    pleromaGroupId: String
    discordChannelId: String
  }

  input GroupCreateInput {
    name: String!
    description: String!
    groupTypeId: Int!
    categoryBadge: String
    profilePicture: String
    settings: GroupSettingsInput!
  }

  input GroupSettingsInput {
    isPublic: Boolean!
    allowNewMembers: Boolean!
    membershipCriteria: [String!]
  }
`;

export interface GroupCreateDTO {
  name: string;
  description: string;
  groupTypeId: number;
  categoryBadge?: string;
  profilePicture?: string;
  settings: GroupSettings;
}

export interface GroupSettings {
  isPublic: boolean;
  allowNewMembers: boolean;
  membershipCriteria?: string[];
  integrations?: GroupIntegrations;
}

export interface GroupIntegrations {
  discourseCategoryId?: string;
  moodleCourseId?: string;
  pleromaGroupId?: string;
  discordChannelId?: string;
}

export type GroupRole = 'ADMIN' | 'MODERATOR' | 'MEMBER' | 'OBSERVER';

export interface GroupMember {
  id: string;
  userId: string;
  groupId: string;
  role: GroupRole;
  joinedAt: Date;
  user: User;
}

export interface GroupServiceResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  code?: string;
}
