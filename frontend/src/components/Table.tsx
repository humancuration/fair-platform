import React from 'react';

interface Column {
  header: string;
  accessor: string;
  sortable: boolean;
}

interface TableProps {
  columns: Column[];
  data: any[];
  onSort?: (accessor: string) => void;
  sortConfig?: { key: string; direction: 'ascending' | 'descending' };
}

const Table: React.FC<TableProps> = ({ columns, data, onSort, sortConfig }) => {
  const getSortIndicator = (accessor: string) => {
    if (!sortConfig || sortConfig.key !== accessor) return null;
    return sortConfig.direction === 'ascending' ? ' ↑' : ' ↓';
  };

  return (
    <table className="min-w-full bg-white dark:bg-gray-800 rounded overflow-hidden shadow">
      <thead>
        <tr>
          {columns.map((column) => (
            <th
              key={column.accessor}
              onClick={column.sortable && onSort ? () => onSort(column.accessor) : undefined}
              className={`px-4 py-2 border-b dark:border-gray-700 cursor-pointer ${
                column.sortable ? 'hover:bg-gray-200 dark:hover:bg-gray-700' : ''
              }`}
            >
              {column.header}
              {column.sortable && getSortIndicator(column.accessor)}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {data.map((row, idx) => (
          <tr key={idx} className="hover:bg-gray-100 dark:hover:bg-gray-700">
            {columns.map((column) => (
              <td key={column.accessor} className="px-4 py-2 border-b dark:border-gray-700">
                {row[column.accessor]}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default Table;