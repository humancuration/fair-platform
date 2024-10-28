import { useQuery } from '@apollo/client';
import { GET_GROUP_MEMBERS } from '../../src/modules/graphql/queries';

interface UseMemberManagementProps {
  groupId: number;
  page: number;
  limit: number;
  searchTerm: string;
  roleFilter: string;
  sortBy: 'username' | 'joinedAt' | 'lastActive' | 'contributionPoints';
  sortOrder: 'asc' | 'desc';
}

export const useMemberManagement = ({
  groupId,
  page,
  limit,
  searchTerm,
  roleFilter,
  sortBy,
  sortOrder,
}: UseMemberManagementProps) => {
  const { loading, error, data, refetch } = useQuery(GET_GROUP_MEMBERS, {
    variables: {
      groupId,
      page,
      limit,
      searchTerm,
      roleFilter,
      sortBy,
      sortOrder
    }
  });

  return {
    loading,
    error,
    members: data?.groupMembers.members || [],
    total: data?.groupMembers.total || 0,
    refetch
  };
};
