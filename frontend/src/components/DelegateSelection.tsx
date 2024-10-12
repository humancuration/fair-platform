import React, { useState, useEffect } from 'react';
import api from '@api/api';

interface DelegateSelectionProps {
  groupId: string;
}

const DelegateSelection: React.FC<DelegateSelectionProps> = ({ groupId }) => {
  const [members, setMembers] = useState<any[]>([]);
  const [selectedDelegate, setSelectedDelegate] = useState<string>('');

  useEffect(() => {
    const fetchMembers = async () => {
      try {
        const response = await api.get(`/groups/${groupId}/members`);
        setMembers(response.data);
      } catch (error) {
        console.error('Error fetching group members:', error);
      }
    };

    fetchMembers();
  }, [groupId]);

  const handleDelegateSelection = async () => {
    try {
      await api.post(`/groups/${groupId}/delegate`, { delegateId: selectedDelegate });
      // Handle successful delegate selection
    } catch (error) {
      console.error('Error selecting delegate:', error);
    }
  };

  return (
    <div>
      <h3>Select Delegate</h3>
      <select value={selectedDelegate} onChange={(e) => setSelectedDelegate(e.target.value)}>
        <option value="">Select a member</option>
        {members.map(member => (
          <option key={member._id} value={member._id}>{member.username}</option>
        ))}
      </select>
      <button onClick={handleDelegateSelection}>Confirm Delegate</button>
    </div>
  );
};

export default DelegateSelection;