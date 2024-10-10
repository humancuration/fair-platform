import React from 'react';
import { Link } from 'react-router-dom';

interface Group {
  _id: string;
  name: string;
  description: string;
  groupType: {
    name: string;
    description: string;
  };
  categoryBadge: string;
  profilePicture: string;
  members: { username: string }[];
  delegates: { username: string }[];
}

const GroupCard: React.FC<{ group: Group }> = ({ group }) => {
  return (
    <div className="bg-white shadow-md rounded p-4">
      <img
        src={group.profilePicture || '/default-group.png'}
        alt={group.name}
        className="w-full h-40 object-cover rounded"
      />
      <h2 className="text-xl font-semibold mt-2">{group.name}</h2>
      <p className="text-gray-600">{group.description.substring(0, 100)}...</p>
      <p className="mt-2">
        <span className="bg-blue-200 text-blue-800 px-2 py-1 rounded">{group.categoryBadge}</span>
      </p>
      <div className="mt-2">
        <p className="text-sm text-gray-600">
          Members: {group.members.length} | Delegates: {group.delegates.length}
        </p>
      </div>
      <Link to={`/groups/${group._id}`} className="text-blue-500 mt-2 inline-block">
        View Group
      </Link>
    </div>
  );
};

export default GroupCard;