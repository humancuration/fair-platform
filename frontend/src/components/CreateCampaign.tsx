import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

const CreateCampaign: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    goal: '',
    deadline: '',
    category: '',
    image: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await api.post('/campaigns', formData);
      navigate(`/campaigns/${response.data._id}`);
    } catch (error) {
      console.error('Error creating campaign:', error);
      // Handle error (e.g., show error message to user)
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-lg mx-auto">
      <h1 className="text-2xl font-bold mb-4">Create a New Campaign</h1>
      <div className="mb-4">
        <label htmlFor="title" className="block mb-2">Title</label>
        <input
          type="text"
          id="title"
          name="title"
          value={formData.title}
          onChange={handleChange}
          required
          className="w-full px-3 py-2 border rounded"
        />
      </div>
      <div className="mb-4">
        <label htmlFor="description" className="block mb-2">Description</label>
        <textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          required
          className="w-full px-3 py-2 border rounded"
        />
      </div>
      <div className="mb-4">
        <label htmlFor="goal" className="block mb-2">Goal Amount</label>
        <input
          type="number"
          id="goal"
          name="goal"
          value={formData.goal}
          onChange={handleChange}
          required
          className="w-full px-3 py-2 border rounded"
        />
      </div>
      <div className="mb-4">
        <label htmlFor="deadline" className="block mb-2">Deadline</label>
        <input
          type="date"
          id="deadline"
          name="deadline"
          value={formData.deadline}
          onChange={handleChange}
          required
          className="w-full px-3 py-2 border rounded"
        />
      </div>
      <div className="mb-4">
        <label htmlFor="category" className="block mb-2">Category</label>
        <select
          id="category"
          name="category"
          value={formData.category}
          onChange={handleChange}
          required
          className="w-full px-3 py-2 border rounded"
        >
          <option value="">Select a category</option>
          <option value="technology">Technology</option>
          <option value="art">Art</option>
          <option value="music">Music</option>
          <option value="film">Film</option>
          <option value="games">Games</option>
          <option value="other">Other</option>
        </select>
      </div>
      <div className="mb-4">
        <label htmlFor="image" className="block mb-2">Image URL</label>
        <input
          type="url"
          id="image"
          name="image"
          value={formData.image}
          onChange={handleChange}
          className="w-full px-3 py-2 border rounded"
        />
      </div>
      <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
        Create Campaign
      </button>
    </form>
  );
};

export default CreateCampaign;
