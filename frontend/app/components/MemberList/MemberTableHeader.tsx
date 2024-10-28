interface MemberTableHeaderProps {
  sortBy: string;
  sortOrder: 'asc' | 'desc';
  onSort: (field: string) => void;
  isAdmin?: boolean;
}

const MemberTableHeader: React.FC<MemberTableHeaderProps> = ({ sortBy, sortOrder, onSort, isAdmin }) => {
  const SortIndicator = () => <span className="ml-1">{sortOrder === 'asc' ? '↑' : '↓'}</span>;
  
  return (
    <thead>
      <tr className="bg-gray-50">
        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
          Member
        </th>
        {['joinedAt', 'lastActive', 'contributionPoints'].map((field) => (
          <th
            key={field}
            onClick={() => onSort(field)}
            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
          >
            {field.replace(/([A-Z])/g, ' $1').trim()}
            {sortBy === field && <SortIndicator />}
          </th>
        ))}
        {isAdmin && (
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            Actions
          </th>
        )}
      </tr>
    </thead>
  );
};
