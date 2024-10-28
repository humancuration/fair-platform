import React, { useState, useEffect } from 'react';
import { useQuery } from '@apollo/client';
import { motion, AnimatePresence } from 'framer-motion';
import { FaSearch, FaFilter, FaCrown, FaShieldAlt, FaUser } from 'react-icons/fa';
import { GET_GROUP_MEMBERS } from '../../src/modules/graphql/queries';
import LoadingSpinner from './common/LoadingSpinner';
import Pagination from './common/Pagination';
import { toast } from 'react-toastify';

interface Member {
  id: string;
  username: string;
  avatar: string;
  role: 'OWNER' | 'ADMIN' | 'MODERATOR' | 'MEMBER';
  joinedAt: string;
  lastActive: string;
  contributionPoints: number;
}

interface MemberListProps {
  groupId: number;
  isAdmin?: boolean;
}

const MEMBERS_PER_PAGE = 10;

const MemberList: React.FC<MemberListProps> = ({ groupId, isAdmin }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [roleFilter, setRoleFilter] = useState<string>('ALL');
  const [sortBy, setSortBy] = useState<'username' | 'joinedAt' | 'lastActive' | 'contributionPoints'>('joinedAt');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  const { loading, error, data, refetch } = useQuery(GET_GROUP_MEMBERS, {
    variables: {
      groupId,
      page: currentPage,
      limit: MEMBERS_PER_PAGE,
      searchTerm,
      roleFilter,
      sortBy,
      sortOrder
    }
  });

  useEffect(() => {
    refetch();
  }, [currentPage, searchTerm, roleFilter, sortBy, sortOrder]);

  if (error) {
    toast.error('Error loading members');
    return <div>Error loading members</div>;
  }

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'OWNER':
        return <FaCrown className="text-yellow-500" title="Owner" />;
      case 'ADMIN':
        return <FaShieldAlt className="text-red-500" title="Admin" />;
      case 'MODERATOR':
        return <FaShieldAlt className="text-blue-500" title="Moderator" />;
      default:
        return <FaUser className="text-gray-500" title="Member" />;
    }
  };

  const handleSort = (field: typeof sortBy) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('desc');
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold mb-4 sm:mb-0">Members</h2>
        
        {/* Search and Filter Controls */}
        <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
          <div className="relative">
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search members..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="ALL">All Roles</option>
            <option value="OWNER">Owner</option>
            <option value="ADMIN">Admin</option>
            <option value="MODERATOR">Moderator</option>
            <option value="MEMBER">Member</option>
          </select>
        </div>
      </div>

      {loading ? (
        <LoadingSpinner />
      ) : (
        <AnimatePresence>
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="bg-gray-50">
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Member
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort('joinedAt')}>
                    Joined
                    {sortBy === 'joinedAt' && (
                      <span className="ml-1">{sortOrder === 'asc' ? '↑' : '↓'}</span>
                    )}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort('lastActive')}>
                    Last Active
                    {sortBy === 'lastActive' && (
                      <span className="ml-1">{sortOrder === 'asc' ? '↑' : '↓'}</span>
                    )}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort('contributionPoints')}>
                    Contribution Points
                    {sortBy === 'contributionPoints' && (
                      <span className="ml-1">{sortOrder === 'asc' ? '↑' : '↓'}</span>
                    )}
                  </th>
                  {isAdmin && (
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  )}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {data?.groupMembers.members.map((member: Member) => (
                  <motion.tr
                    key={member.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="hover:bg-gray-50"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          <img
                            className="h-10 w-10 rounded-full object-cover"
                            src={member.avatar || '/default-avatar.jpg'}
                            alt={member.username}
                          />
                        </div>
                        <div className="ml-4 flex items-center">
                          <div className="font-medium text-gray-900">{member.username}</div>
                          <div className="ml-2">{getRoleIcon(member.role)}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(member.joinedAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(member.lastActive).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {member.contributionPoints}
                    </td>
                    {isAdmin && (
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <button
                          className="text-blue-600 hover:text-blue-900 mr-2"
                          onClick={() => {/* Handle promote */}}
                        >
                          Promote
                        </button>
                        <button
                          className="text-red-600 hover:text-red-900"
                          onClick={() => {/* Handle remove */}}
                        >
                          Remove
                        </button>
                      </td>
                    )}
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-6">
            <Pagination
              currentPage={currentPage}
              totalPages={Math.ceil((data?.groupMembers.total || 0) / MEMBERS_PER_PAGE)}
              onPageChange={setCurrentPage}
            />
          </div>
        </AnimatePresence>
      )}
    </div>
  );
};

export default MemberList;
