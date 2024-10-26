import { json, type LoaderFunction } from '@remix-run/node';
import { useLoaderData, useSearchParams } from '@remix-run/react';
import { motion } from 'framer-motion';
import CompanyListing from '~/components/directory/CompanyListing';
import Pagination from '~/components/common/Pagination';
import { getCompanies } from '~/services/directory.server';
import type { Company } from '~/types';

interface LoaderData {
  companies: Company[];
  totalPages: number;
  currentPage: number;
}

export const loader: LoaderFunction = async ({ request }) => {
  const url = new URL(request.url);
  const page = parseInt(url.searchParams.get('page') || '1');
  const { companies, totalPages } = await getCompanies({ page });
  
  return json<LoaderData>({ 
    companies,
    totalPages,
    currentPage: page
  });
};

export default function Directory() {
  const { companies, totalPages, currentPage } = useLoaderData<typeof loader>();
  const [searchParams, setSearchParams] = useSearchParams();

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-2xl font-bold mb-6">Company Directory</h1>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {companies.map((company) => (
          <motion.div
            key={company.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <CompanyListing company={company} />
          </motion.div>
        ))}
      </div>

      <div className="mt-8">
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={(page) => {
            setSearchParams({ page: page.toString() });
          }}
        />
      </div>
    </div>
  );
}
