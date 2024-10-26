import { motion } from 'framer-motion';
import { Form } from '@remix-run/react';

interface CompanyListingProps {
  company: {
    id: string;
    name: string;
    description: string;
    isFollowing?: boolean;
  };
}

export default function CompanyListing({ company }: CompanyListingProps) {
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 mb-4"
    >
      <h3 className="text-xl font-semibold mb-2 text-gray-800 dark:text-white">
        {company.name}
      </h3>
      
      <p className="text-gray-600 dark:text-gray-300 mb-4">
        {company.description}
      </p>

      <Form method="post" className="text-right">
        <input type="hidden" name="companyId" value={company.id} />
        <input 
          type="hidden" 
          name="action" 
          value={company.isFollowing ? 'unfollow' : 'follow'} 
        />
        
        <motion.button
          type="submit"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className={`
            rounded-full w-10 h-10 flex items-center justify-center
            ${company.isFollowing 
              ? 'bg-green-500 hover:bg-green-600' 
              : 'bg-blue-500 hover:bg-blue-600'
            }
            text-white transition-colors
          `}
          aria-label={`${company.isFollowing ? 'Unfollow' : 'Follow'} ${company.name}`}
        >
          <svg 
            className="w-6 h-6" 
            viewBox="0 0 24 24" 
            fill="none" 
            xmlns="http://www.w3.org/2000/svg"
          >
            {company.isFollowing ? (
              <path 
                d="M5 13L9 17L19 7" 
                stroke="currentColor" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round"
              />
            ) : (
              <path 
                d="M12 5V19M5 12H19" 
                stroke="currentColor" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round"
              />
            )}
          </svg>
        </motion.button>
      </Form>
    </motion.div>
  );
}
