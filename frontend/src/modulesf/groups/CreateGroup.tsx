import React, { useState, useEffect } from 'react';
import api from '@/utils/api';
import { useNavigate } from 'react-router-dom';

interface GroupType {
  _id: string;
  name: string;
  description: string;
  basicType: 'Club' | 'Project' | 'Community';
  subType: 'Team' | 'Committee' | 'Council' | 'League' | 'Cooperative' | 'Union' | 'Guild' | 'Society' | 'Network' | 'Syndicate' | 'Federation';
  levelOfFormality: 'Informal' | 'Formal';
  scope: 'Local' | 'Regional' | 'Global';
}

interface Group {
  id: string;
  name: string;
  parentGroupId?: string;
  // Add other properties as needed
}

const CreateGroup: React.FC = () => {
  const navigate = useNavigate();
  const [groupTypes, setGroupTypes] = useState<GroupType[]>([]);
  const [formData, setFormData] = useState({
    name: '',
    parentGroupId: '', // Add this line
    description: '',
    groupTypeId: '',
    categoryBadge: '',
    profilePicture: '',
    vision: '',
    mission: '',
    values: '',
    goals: '',
    principles: '',
    size: '',
    inclusivity: '',
    joiningPrice: '',
  });
  const [parentGroups, setParentGroups] = useState<Group[]>([]);

  useEffect(() => {
    const fetchGroupTypes = async () => {
      try {
        const response = await api.get('/group-types');
        setGroupTypes(response.data);
      } catch (error) {
        console.error('Error fetching group types:', error);
      }
    };

    fetchGroupTypes();

    const fetchParentGroups = async () => {
      try {
        const response = await api.get('/groups/potential-parents');
        setParentGroups(response.data);
      } catch (error) {
        console.error('Error fetching potential parent groups:', error);
      }
    };

    fetchParentGroups();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await api.post('/groups', formData);
      navigate(`/groups/${response.data._id}`);
    } catch (error) {
      console.error('Error creating group:', error);
    }
  };

  return (
    <div className="max-w-2xl mx-auto bg-white p-6 rounded shadow-md">
      <h1 className="text-2xl font-semibold mb-4">Create New Group</h1>
      <form onSubmit={handleSubmit}>
        {/* Basic Information */}
        <input name="name" value={formData.name} onChange={handleChange} placeholder="Group Name" />
        <textarea name="description" value={formData.description} onChange={handleChange} placeholder="Description" />
        
        {/* Strategic Planning Fields */}
        <textarea name="vision" value={formData.vision} onChange={handleChange} placeholder="Vision" />
        <textarea name="mission" value={formData.mission} onChange={handleChange} placeholder="Mission" />
        <textarea name="values" value={formData.values} onChange={handleChange} placeholder="Values" />
        <textarea name="goals" value={formData.goals} onChange={handleChange} placeholder="Goals" />
        <textarea name="principles" value={formData.principles} onChange={handleChange} placeholder="Principles" />
        
        {/* Group Type and Characteristics */}
        <select name="groupTypeId" value={formData.groupTypeId} onChange={handleChange}>
          {groupTypes.map(type => (
            <option key={type._id} value={type._id}>{type.name}</option>
          ))}
        </select>
        <input name="size" value={formData.size} onChange={handleChange} placeholder="Group Size" />
        <input name="inclusivity" value={formData.inclusivity} onChange={handleChange} placeholder="Inclusivity" />
        <input name="joiningPrice" value={formData.joiningPrice} onChange={handleChange} placeholder="Joining Price" />
        
        {/* Other fields */}
        <input name="categoryBadge" value={formData.categoryBadge} onChange={handleChange} placeholder="Category Badge" />
        <input name="profilePicture" value={formData.profilePicture} onChange={handleChange} placeholder="Profile Picture URL" />
        
        <select name="parentGroupId" value={formData.parentGroupId} onChange={handleChange}>
          <option value="">No Parent Group</option>
          {parentGroups.map(group => (
            <option key={group._id} value={group._id}>{group.name}</option>
          ))}
        </select>
        
        <button type="submit">Create Group</button>
      </form>
    </div>
  );
};

export default CreateGroup;