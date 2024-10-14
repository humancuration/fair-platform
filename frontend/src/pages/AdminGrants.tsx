import React, { useEffect, useState, useCallback } from 'react';
import Table from '../components/Table';
import LoadingSpinner from '../components/LoadingSpinner';
import Pagination from '../components/Pagination';
import api from '../utils/api';
import { AxiosResponse } from 'axios';
import { useErrorHandler } from '../hooks/useErrorHandler';

interface Grant {
  id: number;
  name: string;
  amount: number;
  status: string;
  // Add more fields as needed
}

const AdminGrants: React.FC = () => {
  const [grants, setGrants] = useState<Grant[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [sortConfig, setSortConfig] = useState<{ key: keyof Grant; direction: 'ascending' | 'descending' } | null>(null);
  const { handleError } = useErrorHandler();

  const itemsPerPage = 10;

  const fetchGrants = useCallback(async () => {
    try {
      setLoading(true);
      const response: AxiosResponse<{ grants: Grant[]; totalPages: number }> = await api.get('/grants', {
        params: { page: currentPage, limit: itemsPerPage },
      });
      setGrants(response.data.grants);
      setTotalPages(response.data.totalPages);
    } catch (err) {
      handleError(err, 'Failed to load grants');
    } finally {
      setLoading(false);
    }
  }, [currentPage, handleError]);

  useEffect(() => {
    fetchGrants();
  }, [fetchGrants]);

  const handleSort = useCallback((accessor: keyof Grant) => {
    setSortConfig(prevConfig => {
      if (prevConfig?.key === accessor) {
        return { key: accessor, direction: prevConfig.direction === 'ascending' ? 'descending' : 'ascending' };
      }
      return { key: accessor, direction: 'ascending' };
    });
  }, []);

  const sortedGrants = React.useMemo(() => {
    if (!sortConfig) return grants;
    return [...grants].sort((a, b) => {
      if (a[sortConfig.key] < b[sortConfig.key]) return sortConfig.direction === 'ascending' ? -1 : 1;
      if (a[sortConfig.key] > b[sortConfig.key]) return sortConfig.direction === 'ascending' ? 1 : -1;
      return 0;
    });
  }, [grants, sortConfig]);

  const columns = [
    { header: 'ID', accessor: 'id' as keyof Grant, sortable: true },
    { header: 'Name', accessor: 'name' as keyof Grant, sortable: true },
    { header: 'Amount', accessor: 'amount' as keyof Grant, sortable: true },
    { header: 'Status', accessor: 'status' as keyof Grant, sortable: true },
    // Add more columns as needed
  ];

  if (loading) return <LoadingSpinner />;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Admin Grants</h1>
      <Table
        columns={columns}
        data={sortedGrants}
        onSort={handleSort}
        sortConfig={sortConfig}
      />
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />
    </div>
  );
};

export default AdminGrants;
