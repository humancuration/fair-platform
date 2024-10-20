import React, { useEffect, useState } from 'react';
import CompanyListing from '../components/CompanyListing';
import Pagination from '../components/Pagination';
import LoadingSpinner from '../components/common/LoadingSpinner';
import api from '../api/api';

const Directory: React.FC = () => {
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const response = await api.get('/companies', {
          params: { page: currentPage, limit: itemsPerPage },
        });
        setCompanies(response.data.companies);
        setTotalPages(response.data.totalPages);
        setLoading(false);
      } catch (err) {
        // Handle error
        setLoading(false);
      }
    };

    fetchCompanies();
  }, [currentPage]);

  if (loading) return <LoadingSpinner />;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Company Directory</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {companies.map((company) => (
          <CompanyListing key={company.id} company={company} />
        ))}
      </div>
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={(page) => setCurrentPage(page)}
      />
    </div>
  );
};

export default Directory;
