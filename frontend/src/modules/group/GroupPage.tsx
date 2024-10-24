import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchGroupById, fetchResources, castVote } from '../../store/slices/groupsSlice';
import { RootState } from '../../store/store';
import Layout from '../../components/Layout';
import GroupProfile from '../../components/groups/GroupProfile';
import CampaignList from '../campaign/CampaignList';
import ResourceExchange from '../components/ResourceExchange';
import PetitionList from '../components/PetitionList';
import MemberList from '../components/MemberList';
import ShareWithGroupModal from './ShareWithGroupModal';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { toast } from 'react-toastify';
import api from '@/utils/api';
import GroupChallenges from './GroupChallenges';
import GroupResourceMarketplace from './GroupResourceMarketplace';
import GroupDecisionMaking from './GroupDecisionMaking';
import GroupAchievements from './GroupAchievements';
import ActivePolls from './ActivePolls';
import GroupGuidelines from './GroupGuidelines';
import CustomEmojis from './CustomEmojis';
import GroupAnalytics from './GroupAnalytics';

const GroupPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const dispatch = useDispatch();
  const group = useSelector((state: RootState) => state.groups.groups.find(g => g.id === Number(id)));
  const status = useSelector((state: RootState) => state.groups.status);
  const error = useSelector((state: RootState) => state.groups.error);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [isMember, setIsMember] = useState(false);

  useEffect(() => {
    if (id) {
      dispatch(fetchGroupById(Number(id)));
      dispatch(fetchResources(Number(id)));
      checkMembershipStatus();
    }
  }, [id, dispatch]);

  const checkMembershipStatus = async () => {
    try {
      const response = await api.get(`/groups/${id}/membership-status`);
      setIsMember(response.data.isMember);
    } catch (error) {
      console.error('Error checking membership status:', error);
    }
  };

  const handleJoinGroup = async () => {
    try {
      await api.post(`/groups/${id}/join`);
      setIsMember(true);
      toast.success('Successfully joined the group!');
    } catch (error) {
      console.error('Error joining group:', error);
      toast.error('Failed to join group. Please try again.');
    }
  };

  const handleLeaveGroup = async () => {
    try {
      await api.post(`/groups/${id}/leave`);
      setIsMember(false);
      toast.success('Successfully left the group.');
    } catch (error) {
      console.error('Error leaving group:', error);
      toast.error('Failed to leave group. Please try again.');
    }
  };

  if (status === 'loading') return <LoadingSpinner />;
  if (error) return <div className="text-center text-red-500">{error}</div>;
  if (!group) return <div className="text-center">Group not found</div>;

  return (
    <Layout>
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="bg-white shadow-lg rounded-lg overflow-hidden">
          <div className="relative h-64">
            <img 
              src={group.coverPhoto || '/default-cover.jpg'} 
              alt={`${group.name} cover`} 
              className="w-full h-full object-cover"
            />
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-6">
              <h1 className="text-4xl font-bold text-white">{group.name}</h1>
            </div>
          </div>
          
          <div className="p-6">
            <GroupProfile group={group} />
            
            <div className="mt-6 flex justify-between items-center">
              {isMember ? (
                <button 
                  onClick={handleLeaveGroup}
                  className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded"
                >
                  Leave Group
                </button>
              ) : (
                <button 
                  onClick={handleJoinGroup}
                  className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded"
                >
                  Join Group
                </button>
              )}
              <button 
                onClick={() => setIsShareModalOpen(true)}
                className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
              >
                Share Group
              </button>
            </div>
          </div>
        </div>

        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-8">
          <GroupChallenges groupId={group.id} />
          <GroupResourceMarketplace groupId={group.id} />
        </div>

        <div className="mt-8">
          <GroupDecisionMaking groupId={group.id} />
        </div>

        <div className="mt-8 bg-white shadow-lg rounded-lg p-6">
          <h2 className="text-2xl font-semibold mb-4">Petitions</h2>
          <PetitionList groupId={group.id} onVote={(petitionId, voteType) => dispatch(castVote({ groupId: group.id, petitionId, voteType }))} />
        </div>

        <div className="mt-8 bg-white shadow-lg rounded-lg p-6">
          <h2 className="text-2xl font-semibold mb-4">Members</h2>
          <MemberList groupId={group.id} />
        </div>

        {/* New Features */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-2xl font-semibold mb-4">Group Achievements</h2>
            <div className="grid grid-cols-2 gap-4">
              {group.achievements?.map((achievement) => (
                <div key={achievement.id} className="border rounded p-4">
                  <h3 className="font-semibold">{achievement.name}</h3>
                  <p className="text-sm text-gray-600">{achievement.description}</p>
                  <p className="text-xs text-gray-500 mt-2">
                    Earned: {new Date(achievement.dateEarned).toLocaleDateString()}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-2xl font-semibold mb-4">Active Polls</h2>
            <PollList groupId={group.id} />
          </div>
        </div>

        <div className="mt-8 bg-white rounded-lg shadow p-6">
          <h2 className="text-2xl font-semibold mb-4">Group Guidelines</h2>
          <div className="space-y-2">
            {group.guidelines?.map((guideline, index) => (
              <p key={index} className="flex items-start">
                <span className="mr-2">•</span>
                {guideline}
              </p>
            ))}
          </div>
        </div>

        <div className="mt-8 bg-white rounded-lg shadow p-6">
          <h2 className="text-2xl font-semibold mb-4">Custom Emojis</h2>
          <div className="grid grid-cols-6 gap-4">
            {Object.entries(group.customEmojis || {}).map(([name, url]) => (
              <div key={name} className="text-center">
                <img src={url} alt={name} className="w-8 h-8 mx-auto" />
                <p className="text-xs mt-1">:{name}:</p>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-8 bg-white rounded-lg shadow p-6">
          <h2 className="text-2xl font-semibold mb-4">Group Analytics</h2>
          <GroupAnalytics groupId={group.id} />
        </div>
      </div>

      <ShareWithGroupModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        groupId={group.id}
      />
    </Layout>
  );
};

export default GroupPage;
