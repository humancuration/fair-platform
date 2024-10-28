import React, { useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import { FaSearch } from 'react-icons/fa';
import { toast } from 'react-toastify';
import { useMemberManagement } from '../../hooks/useMemberManagement';
import MemberTableHeader from './MemberTableHeader';
import MemberRow from './MemberRow';
import LoadingSpinner from '../common/LoadingSpinner';
import Pagination from '../common/Pagination';

const MEMBERS_PER_PAGE = 10;

const MemberList: React.FC<MemberListProps> = ({ groupId, isAdmin }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [roleFilter, setRoleFilter] = useState<string>('ALL');
  const [sortBy, setSortBy] = useState<'username' | 'joinedAt' | 'lastActive' | 'contributionPoints'>('joinedAt');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  const { loading, error, members, total, refetch } = useMemberManagement({
    groupId,
    page: currentPage,
    limit: MEMBERS_PER_PAGE,
    searchTerm,
    roleFilter,
    sortBy,
    sortOrder
  });

  const handleSort = (field: typeof sortBy) => {
    setSortOrder(sortBy === field ? (sortOrder === 'asc' ? 'desc' : 'asc') : 'desc');
    setSortBy(field);
  };

  const handlePromote = async (memberId: string) => {
    // Implement promotion logic
    toast.success('Member promoted successfully');
  };

  const handleRemove = async (memberId: string) => {
    // Implement removal logic
    toast.success('Member removed successfully');
  };

  if (error) {
    toast.error('Error loading members');
    return <div>Error loading members</div>;
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold mb-4 sm:mb-0">Members</h2>
        
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
            <table className="min-w-full divide-y divide-gray-200">
              <MemberTableHeader
                sortBy={sortBy}
                sortOrder={sortOrder}
                onSort={handleSort}
                isAdmin={isAdmin}
              />
              <tbody className="bg-white divide-y divide-gray-200">
                {members.map((member) => (
                  <MemberRow
                    key={member.id}
                    member={member}
                    isAdmin={isAdmin}
                    onPromote={handlePromote}
                    onRemove={handleRemove}
                  />
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-6">
            <Pagination
              currentPage={currentPage}
              totalPages={Math.ceil(total / MEMBERS_PER_PAGE)}
              onPageChange={setCurrentPage}
            />
          </div>
        </AnimatePresence>
      )}
    </div>
  );
};

export default MemberList;
