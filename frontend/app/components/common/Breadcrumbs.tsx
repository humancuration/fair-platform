import { Link, useMatches } from '@remix-run/react';
import { motion } from 'framer-motion';

interface BreadcrumbMatch {
  id: string;
  pathname: string;
  params: any;
  data: any;
  handle?: {
    breadcrumb?: string | ((data: any) => string);
  };
}

export default function Breadcrumbs() {
  const matches = useMatches() as BreadcrumbMatch[];
  const breadcrumbs = matches
    .filter(match => match.handle?.breadcrumb)
    .map(match => ({
      text: typeof match.handle?.breadcrumb === 'function' 
        ? match.handle.breadcrumb(match.data)
        : match.handle?.breadcrumb,
      href: match.pathname
    }));

  return (
    <nav className="text-sm mb-4">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center space-x-2"
      >
        <Link 
          to="/" 
          className="text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-300"
        >
          Home
        </Link>

        {breadcrumbs.map((crumb, index) => (
          <div key={crumb.href} className="flex items-center space-x-2">
            <span className="text-gray-500 dark:text-gray-400">/</span>
            <Link
              to={crumb.href}
              className={`
                ${index === breadcrumbs.length - 1
                  ? 'text-gray-700 dark:text-gray-300 cursor-default pointer-events-none'
                  : 'text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-300'
                }
              `}
            >
              {crumb.text}
            </Link>
          </div>
        ))}
      </motion.div>
    </nav>
  );
}
