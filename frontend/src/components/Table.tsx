import React from 'react';

interface Column {
  header: string;
  accessor: string;
  sortable?: boolean;
}

interface TableProps {
  columns: Column[];
  data: any[];
  onSort?: (accessor: string) => void;
  sortConfig?: { key: string; direction: 'ascending' | 'descending' };
}

const Table: React.FC<TableProps> = ({ columns, data, onSort, sortConfig }) => {
  const getClassNamesFor = (accessor: string) => {
    if (!sortConfig) return;
    return sortConfig.key === accessor
      ? sortConfig.direction === 'ascending'
        ? '↑'
        : '↓'
      : undefined;
  };

  return (
    <table className="min-w-full bg-white dark:bg-gray-800">
      <thead>
        <tr>
          {columns.map((column) => (
            <th
              key={column.accessor}
              className="py-2 px-4 border-b dark:border-gray-700 text-left text-sm font-semibold text-gray-700 dark:text-gray-200"
            >
              {column.sortable ? (
                <button
                  onClick={() => onSort && onSort(column.accessor)}
                  className="flex items-center space-x-1 focus:outline-none"
                >
                  <span>{column.header}</span>
                  <span>{getClassNamesFor(column.accessor)}</span>
                </button>
              ) : (
                column.header
              )}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {data.map((row, idx) => (
          <tr
            key={idx}
            className={`hover:bg-gray-100 dark:hover:bg-gray-700 ${
              idx % 2 === 0 ? 'bg-gray-50 dark:bg-gray-900' : 'bg-white dark:bg-gray-800'
            }`}
          >
            {columns.map((column) => (
              <td
                key={column.accessor}
                className="py-2 px-4 border-b dark:border-gray-700 text-sm text-gray-700 dark:text-gray-200"
              >
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