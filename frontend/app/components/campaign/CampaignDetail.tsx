import type { FC } from 'react';
import { Form, useNavigation } from '@remix-run/react';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import { 
  FaUser, 
  FaCalendar, 
  FaTag, 
  FaDollarSign,
  FaEdit,
  FaTrash,
  FaHeart 
} from 'react-icons/fa';

interface Donation {
  id: string;
  amount: number;
  createdAt: string;
  donor: {
    username: string;
  };
}

interface Campaign {
  id: string;
  title: string;
  description: string;
  goal: number;
  amountRaised: number;
  deadline: string;
  creator: {
    id: string;
    username: string;
    avatar?: string;
  };
  category: string;
  image?: string;
  donations: Donation[];
}

interface CampaignDetailProps {
  campaign: Campaign;
  isCreator?: boolean;
}

export const CampaignDetail: FC<CampaignDetailProps> = ({ 
  campaign,
  isCreator = false,
}) => {
  const navigation = useNavigation();
  const isSubmitting = navigation.state === "submitting";

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg overflow-hidden"
    >
      {campaign.image && (
        <img
          src={campaign.image}
          alt={campaign.title}
          className="w-full h-64 object-cover"
        />
      )}

      <div className="p-6">
        <div className="flex justify-between items-start">
          <h1 className="text-3xl font-bold mb-4">{campaign.title}</h1>
          {isCreator && (
            <div className="flex gap-2">
              <Form method="post">
                <input type="hidden" name="intent" value="delete" />
                <button
                  type="submit"
                  className="text-red-500 hover:text-red-600 p-2"
                  onClick={(e) => {
                    if (!confirm('Are you sure you want to delete this campaign?')) {
                      e.preventDefault();
                    }
                  }}
                >
                  <FaTrash />
                </button>
              </Form>
              <Link
                to="edit"
                className="text-blue-500 hover:text-blue-600 p-2"
              >
                <FaEdit />
              </Link>
            </div>
          )}
        </div>

        <div className="flex flex-wrap gap-4 mb-6 text-gray-600">
          <div className="flex items-center">
            <FaUser className="mr-2" />
            <span>{campaign.creator.username}</span>
          </div>
          <div className="flex items-center">
            <FaCalendar className="mr-2" />
            <span>
              Ends {format(new Date(campaign.deadline), 'MMMM d, yyyy')}
            </span>
          </div>
          <div className="flex items-center">
            <FaTag className="mr-2" />
            <span>{campaign.category}</span>
          </div>
        </div>

        <div className="mb-8">
          <div className="flex justify-between text-sm mb-1">
            <span>Progress</span>
            <span>
              {Math.round((campaign.amountRaised / campaign.goal) * 100)}%
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-4">
            <div
              className="bg-blue-500 rounded-full h-4 transition-all duration-500"
              style={{
                width: `${Math.min(
                  (campaign.amountRaised / campaign.goal) * 100,
                  100
                )}%`,
              }}
            />
          </div>
          <div className="flex justify-between text-sm mt-1">
            <span>${campaign.amountRaised.toLocaleString()} raised</span>
            <span>Goal: ${campaign.goal.toLocaleString()}</span>
          </div>
        </div>

        <div className="prose max-w-none mb-8">
          <p>{campaign.description}</p>
        </div>

        <Form method="post" className="mb-8">
          <input type="hidden" name="intent" value="donate" />
          <div className="flex gap-4">
            <div className="flex-1">
              <input
                type="number"
                name="amount"
                min="1"
                step="1"
                required
                placeholder="Enter amount"
                className="w-full p-2 border rounded"
              />
            </div>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-blue-300 flex items-center gap-2"
            >
              <FaHeart />
              <span>{isSubmitting ? 'Processing...' : 'Donate'}</span>
            </button>
          </div>
        </Form>

        <div>
          <h2 className="text-xl font-semibold mb-4">Recent Donations</h2>
          <div className="space-y-4">
            {campaign.donations.map((donation) => (
              <div
                key={donation.id}
                className="flex items-center justify-between p-4 bg-gray-50 rounded"
              >
                <div className="flex items-center gap-2">
                  <FaDollarSign className="text-green-500" />
                  <span className="font-medium">
                    ${donation.amount.toLocaleString()}
                  </span>
                  <span className="text-gray-600">
                    from {donation.donor.username}
                  </span>
                </div>
                <span className="text-sm text-gray-500">
                  {format(new Date(donation.createdAt), 'MMM d, yyyy')}
                </span>
              </div>
            ))}
            {campaign.donations.length === 0 && (
              <p className="text-center text-gray-500 py-4">
                No donations yet. Be the first to donate!
              </p>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};
