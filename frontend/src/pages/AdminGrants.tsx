import React, { useEffect, useState } from 'react';
import Table from '../components/Table';
import LoadingSpinner from '../components/LoadingSpinner';
import Pagination from '../components/Pagination';
import api from '../utils/api';
import { AxiosResponse } from 'axios';

interface Grant {
  id: number;
  name: string;
  amount: number;
  status: string;
  // Add more fields as needed
}

const AdminGrants: React.FC = () => {
  const [grants, setGrants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const itemsPerPage = 10;
  const [sortConfig, setSortConfig] = useState<{ key: string; direction: 'ascending' | 'descending' } | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchGrants = async () => {
      try {
        const response: AxiosResponse<{ grants: Grant[]; totalPages: number }> = await api.get('/grants', {
          params: { page: currentPage, limit: itemsPerPage },
        });
        setGrants(response.data.grants);
        setTotalPages(response.data.totalPages);
      } catch (err) {
        console.error('Error fetching grants:', err);
        setError('Failed to load grants. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchGrants();
  }, [currentPage]);

  const handleSort = (accessor: string) => {
    let direction: 'ascending' | 'descending' = 'ascending';
    if (sortConfig && sortConfig.key === accessor && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key: accessor, direction });

    const sortedData = [...grants].sort((a, b) => {
      if (a[accessor] < b[accessor]) return direction === 'ascending' ? -1 : 1;
      if (a[accessor] > b[accessor]) return direction === 'ascending' ? 1 : -1;
      return 0;
    });
    setGrants(sortedData);
  };

  const columns = [
    { header: 'ID', accessor: 'id', sortable: true },
    { header: 'Name', accessor: 'name', sortable: true },
    { header: 'Amount', accessor: 'amount', sortable: true },
    { header: 'Status', accessor: 'status', sortable: true },
    // Add more columns as needed
  ];

  if (loading) return <LoadingSpinner />;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Admin Grants</h1>
      <Table
        columns={columns}
        data={grants}
        onSort={handleSort}
        sortConfig={sortConfig || undefined}
      />
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={(page) => setCurrentPage(page)}
      />
    </div>
  );
};

export default AdminGrants;