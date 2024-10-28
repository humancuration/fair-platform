import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import MoreOptionsMenu from './MoreOptionsMenu';

interface Group {
  _id: string;
  name: string;
  description: string;
  groupType: {
    name: string;
    description: string;
    levelOfFormality: 'Informal' | 'Formal';
    scope: 'Local' | 'Regional' | 'Global';
  };
  categoryBadge: string;
  profilePicture: string;
  members: { username: string }[];
  delegates: { username: string }[];
}

const GroupCard: React.FC<{ group: Group }> = ({ group }) => {
  const [showMoreOptions, setShowMoreOptions] = useState(false);

  const handleInitiate = () => {
    // Implement initiate action
    console.log('Initiate action for group:', group.name);
  };

  const handlePressGesture = () => {
    setShowMoreOptions(true);
  };

  return (
    <div className="bg-white shadow-md rounded p-4" onClick={handlePressGesture}>
      <Link to={`/groups/${group._id}`}>
        <img
          src={group.profilePicture || '/default-group.png'}
          alt={group.name}
          className="w-full h-40 object-cover rounded"
        />
        <h2 className="text-xl font-semibold mt-2">{group.name}</h2>
      </Link>
      <p className="text-gray-600">{group.description.substring(0, 100)}...</p>
      <p className="mt-2">
        <span className="bg-blue-200 text-blue-800 px-2 py-1 rounded">{group.categoryBadge}</span>
      </p>
      <div className="mt-2">
        <p className="text-sm text-gray-600">
          Members: {group.members.length} | Delegates: {group.delegates.length}
        </p>
        <p className="text-sm text-gray-600">
          Type: {group.groupType.basicType} - {group.groupType.subType}
        </p>
        {group.parentGroup && (
          <p className="text-sm text-gray-600">
            Parent: <Link to={`/groups/${group.parentGroup._id}`}>{group.parentGroup.name}</Link>
          </p>
        )}
      </div>
      <button 
        onClick={handleInitiate}
        className="bg-green-500 text-white px-4 py-2 rounded mt-2"
      >
        Initiate
      </button>
      <MoreOptionsMenu 
        isOpen={showMoreOptions} 
        onClose={() => setShowMoreOptions(false)}
        groupId={group._id}
      />
    </div>
  );
};

export default GroupCard;