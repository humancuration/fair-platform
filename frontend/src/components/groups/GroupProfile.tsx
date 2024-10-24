import React from 'react';
import { Group } from '../../types/group';

interface GroupProfileProps {
  group: Group;
}

const GroupProfile: React.FC<GroupProfileProps> = ({ group }) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-4">
        <img
          src={group.avatar || '/default-avatar.jpg'}
          alt={`${group.name} avatar`}
          className="w-20 h-20 rounded-full"
        />
        <div>
          <p className="text-gray-600">{group.description}</p>
          <div className="mt-2 text-sm text-gray-500">
            <span>Members: {group.memberCount}</span>
            <span className="mx-2">•</span>
            <span>Created: {new Date(group.createdAt).toLocaleDateString()}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GroupProfile;
