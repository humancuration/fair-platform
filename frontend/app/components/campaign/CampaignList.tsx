import type { FC } from 'react';
import { Link } from '@remix-run/react';
import { motion } from 'framer-motion';
import { FaUser, FaCalendar, FaTag } from 'react-icons/fa';
import { format } from 'date-fns';

interface Campaign {
  id: string;
  title: string;
  description: string;
  goal: number;
  amountRaised: number;
  deadline: string;
  creator: {
    username: string;
    avatar?: string;
  };
  category: string;
  image?: string;
}

interface CampaignListProps {
  campaigns: Campaign[];
}

export const CampaignList: FC<CampaignListProps> = ({ campaigns }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {campaigns.map((campaign, index) => (
        <motion.div
          key={campaign.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition"
        >
          <Link to={`/campaigns/${campaign.id}`} prefetch="intent">
            {campaign.image && (
              <img
                src={campaign.image}
                alt={campaign.title}
                className="w-full h-48 object-cover"
              />
            )}
            <div className="p-4">
              <h3 className="text-xl font-semibold mb-2">{campaign.title}</h3>
              <p className="text-gray-600 mb-4 line-clamp-2">
                {campaign.description}
              </p>
              
              <div className="space-y-2">
                <div className="flex items-center text-sm text-gray-500">
                  <FaUser className="mr-2" />
                  <span>{campaign.creator.username}</span>
                </div>
                
                <div className="flex items-center text-sm text-gray-500">
                  <FaCalendar className="mr-2" />
                  <span>
                    Ends {format(new Date(campaign.deadline), 'MMM d, yyyy')}
                  </span>
                </div>

                <div className="flex items-center text-sm text-gray-500">
                  <FaTag className="mr-2" />
                  <span>{campaign.category}</span>
                </div>
              </div>

              <div className="mt-4">
                <div className="flex justify-between text-sm mb-1">
                  <span>Progress</span>
                  <span>
                    {Math.round((campaign.amountRaised / campaign.goal) * 100)}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-500 rounded-full h-2"
                    style={{
                      width: `${Math.min(
                        (campaign.amountRaised / campaign.goal) * 100,
                        100
                      )}%`,
                    }}
                  />
                </div>
                <div className="flex justify-between text-sm mt-1">
                  <span>${campaign.amountRaised.toLocaleString()}</span>
                  <span>Goal: ${campaign.goal.toLocaleString()}</span>
                </div>
              </div>
            </div>
          </Link>
        </motion.div>
      ))}
      {campaigns.length === 0 && (
        <div className="col-span-full text-center py-12 text-gray-500">
          No campaigns found
        </div>
      )}
    </div>
  );
};
