import React, { useEffect, useState } from 'react';
import CompanyListing from '../components/CompanyListing';
import Pagination from '../components/Pagination';
import LoadingSpinner from '../components/common/LoadingSpinner';
import api from '../api/api';
import { json, LoaderFunction } from '@remix-run/node';
import { useLoaderData, useSearchParams } from '@remix-run/react';
import { useInfiniteQuery } from '@apollo/client';
import { GET_COMPANIES } from '../graphql/queries';
import type { Company } from '../types';

interface LoaderData {
  initialCompanies: Company[];
  totalPages: number;
}

export const loader: LoaderFunction = async ({ request }) => {
  const url = new URL(request.url);
  const page = parseInt(url.searchParams.get('page') || '1');
  
  // Server-side data fetching
  const { companies, totalPages } = await getInitialCompanies(page);
  
  return json<LoaderData>({ 
    initialCompanies: companies,
    totalPages 
  });
};

const Directory: React.FC = () => {
  const { initialCompanies, totalPages } = useLoaderData<LoaderData>();
  const [searchParams, setSearchParams] = useSearchParams();
  
  const { data, fetchMore } = useInfiniteQuery(GET_COMPANIES, {
    variables: { page: 1, limit: 10 },
    getNextPageParam: (lastPage) => lastPage.nextPage,
  });

  if (!data) return <LoadingSpinner />;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Company Directory</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {data.companies.map((company) => (
          <CompanyListing key={company.id} company={company} />
        ))}
      </div>
      <Pagination
        currentPage={1}
        totalPages={totalPages}
        onPageChange={(page) => setSearchParams({ page })}
      />
    </div>
  );
};

export default Directory;
