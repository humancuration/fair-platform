import { Link } from '@remix-run/react';
import { motion } from 'framer-motion';
import { Users, Shield } from 'react-feather';
import type { Group } from '~/types/dashboard';

interface GroupDashboardCardProps {
  group: Group;
  showMetrics?: boolean;
}

export default function GroupDashboardCard({ 
  group, 
  showMetrics = true 
}: GroupDashboardCardProps) {
  return (
    <motion.div
      whileHover={{ y: -5 }}
      className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden"
    >
      <div className="relative h-32">
        <img 
          src={group.coverPhoto || '/images/default-cover.jpg'} 
          alt={group.name} 
          className="w-full h-full object-cover"
        />
        {group.isVerified && (
          <div className="absolute top-2 right-2 bg-blue-500 text-white px-2 py-1 rounded-full text-xs flex items-center">
            <Shield className="h-3 w-3 mr-1" />
            Verified
          </div>
        )}
      </div>
      
      <div className="p-4">
        <Link 
          to={`/groups/${group.id}`} 
          className="hover:text-blue-500"
        >
          <h3 className="text-lg font-semibold mb-2">{group.name}</h3>
        </Link>
        
        {showMetrics && (
          <div className="grid grid-cols-2 gap-2 mt-4 text-sm">
            <div className="text-center p-2 bg-gray-50 dark:bg-gray-700 rounded">
              <div className="flex items-center justify-center">
                <Users className="h-4 w-4 mr-1" />
                <span className="font-semibold">{group.memberCount}</span>
              </div>
              <div className="text-gray-500 dark:text-gray-400">Members</div>
            </div>
            <div className="text-center p-2 bg-gray-50 dark:bg-gray-700 rounded">
              <div className="font-semibold">{group.resourceCredits}</div>
              <div className="text-gray-500 dark:text-gray-400">Credits</div>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
}
