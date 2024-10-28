import { gql } from '@apollo/client';

export const GET_GROUP_MEMBERS = gql`
  query GetGroupMembers(
    $groupId: ID!
    $page: Int!
    $limit: Int!
    $searchTerm: String
    $roleFilter: String
    $sortBy: String
    $sortOrder: String
  ) {
    groupMembers(
      groupId: $groupId
      page: $page
      limit: $limit
      searchTerm: $searchTerm
      roleFilter: $roleFilter
      sortBy: $sortBy
      sortOrder: $sortOrder
    ) {
      members {
        id
        username
        avatar
        role
        joinedAt
        lastActive
        contributionPoints
      }
      total
      currentPage
      totalPages
    }
  }
`;
