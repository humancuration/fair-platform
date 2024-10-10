import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { useNavigate } from 'react-router-dom';

interface GroupType {
  _id: string;
  name: string;
  description: string;
  levelOfFormality: 'Informal' | 'Formal';
  scope: 'Local' | 'Regional' | 'Global';
}

const CreateGroup: React.FC = () => {
  const navigate = useNavigate();
  const [groupTypes, setGroupTypes] = useState<GroupType[]>([]);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    groupTypeId: '',
    categoryBadge: '',
    profilePicture: '',
  });

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
        {/* Form fields */}
        {/* ... (rest of the form code) ... */}
      </form>
    </div>
  );
};

export default CreateGroup;