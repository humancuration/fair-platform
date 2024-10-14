import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import GroupList from '../components/GroupList';
import GroupSearch from '../components/GroupSearch';
import GroupTestimonials from '../components/GroupTestimonials';
import GroupSupportChannels from '../components/GroupSupportChannels';
import LoadingSpinner from '../components/LoadingSpinner';
import api from '@api/api';
import { toast } from 'react-toastify';

interface Group {
  id: string;
  name: string;
  description: string;
  memberCount: number;
}

const GroupListPage: React.FC = () => {
  const [groups, setGroups] = useState<Group[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchGroups();
  }, []);

  const fetchGroups = async () => {
    try {
      setLoading(true);
      const response = await api.get('/groups');
      setGroups(response.data);
    } catch (error) {
      console.error('Error fetching groups:', error);
      toast.error('Failed to load groups. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (term: string) => {
    setSearchTerm(term);
    // You could implement debounce here for better performance
  };

  const filteredGroups = groups.filter(group => 
    group.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    group.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-semibold mb-6">Discover Groups</h1>
        
        <div className="mb-8">
          <GroupSearch onSearch={handleSearch} />
        </div>

        {loading ? (
          <LoadingSpinner />
        ) : (
          <>
            <div className="bg-white rounded-lg shadow p-6 mb-8">
              <h2 className="text-2xl font-semibold mb-4">All Groups</h2>
              {filteredGroups.length > 0 ? (
                <GroupList groups={filteredGroups} />
              ) : (
                <p>No groups found matching your search.</p>
              )}
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-2xl font-semibold mb-4">Group Testimonials</h2>
                <GroupTestimonials />
              </div>
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-2xl font-semibold mb-4">Support Channels</h2>
                <GroupSupportChannels />
              </div>
            </div>
          </>
        )}

        <div className="mt-8 text-center">
          <Link 
            to="/groups/create" 
            className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
          >
            Create New Group
          </Link>
        </div>
      </div>
    </div>
  );
};

export default GroupListPage;
