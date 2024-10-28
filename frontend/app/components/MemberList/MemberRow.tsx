import { motion } from 'framer-motion';
import { Member } from '../types';
import { getRoleIcon } from '../utils/memberUtils';

interface MemberRowProps {
  member: Member;
  isAdmin?: boolean;
  onPromote: (memberId: string) => void;
  onRemove: (memberId: string) => void;
}

const MemberRow: React.FC<MemberRowProps> = ({ member, isAdmin, onPromote, onRemove }) => {
  return (
    <motion.tr
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
            onClick={() => onPromote(member.id)}
          >
            Promote
          </button>
          <button
            className="text-red-600 hover:text-red-900"
            onClick={() => onRemove(member.id)}
          >
            Remove
          </button>
        </td>
      )}
    </motion.tr>
  );
};
