import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import CreateGroup from './CreateGroup';
import GroupTestimonials from '../../components/groups/GroupTestimonials';
import GroupSupportChannels from '../../components/groups/GroupSupportChannels';

const GroupCreationPage: React.FC = () => {
  const [isCreating, setIsCreating] = useState(false);
  const navigate = useNavigate();

  const handleGroupCreation = async (groupData: any) => {
    setIsCreating(true);
    try {
      // Assume we have an API call to create the group
      // const response = await api.post('/groups', groupData);
      // Simulating API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast.success('Group created successfully!');
      navigate('/groups'); // Redirect to groups list
    } catch (error) {
      console.error('Error creating group:', error);
      toast.error('Failed to create group. Please try again.');
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-xl overflow-hidden">
        <div className="md:flex">
          <div className="md:flex-shrink-0 bg-indigo-600 md:w-48 flex items-center justify-center">
            <svg className="h-16 w-16 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </div>
          <div className="p-8 w-full">
            <h1 className="text-3xl font-bold text-gray-800 mb-4">Create a New Group</h1>
            <p className="text-gray-600 mb-8">Start your journey by creating a group and connecting with like-minded individuals.</p>
            <CreateGroup onSubmit={handleGroupCreation} isLoading={isCreating} />
          </div>
        </div>
      </div>

      <div className="mt-12 grid md:grid-cols-2 gap-8">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Group Testimonials</h2>
          <GroupTestimonials />
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Support Channels</h2>
          <GroupSupportChannels />
        </div>
      </div>
    </div>
  );
};

export default GroupCreationPage;
