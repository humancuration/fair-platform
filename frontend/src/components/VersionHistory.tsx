import React from 'react';

interface Version {
  id: number;
  content: string;
  title: string;
  timestamp: string;
}

interface VersionHistoryProps {
  versions: Version[];
  onRevert: (version: Version) => void;
}

const VersionHistory: React.FC<VersionHistoryProps> = ({ versions, onRevert }) => {
  return (
    <div className="mt-4">
      <h3 className="text-lg font-semibold mb-2">Version History</h3>
      {versions.length === 0 ? (
        <p className="text-gray-500">No versions saved yet.</p>
      ) : (
        <ul className="space-y-2">
          {versions.map((version, index) => (
            <li key={version.id} className="flex justify-between items-center border rounded px-3 py-2">
              <div>
                <span className="font-medium">Version {versions.length - index}</span>
                <span className="text-sm text-gray-500 ml-2">{version.timestamp}</span>
              </div>
              <button
                onClick={() => onRevert(version)}
                className="text-blue-500 hover:text-blue-700 transition-colors"
              >
                Revert
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default VersionHistory;