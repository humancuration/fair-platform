import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { createGroup } from '../store/slices/groupsSlice';

const CreateGroup = () => {
  const dispatch = useDispatch();
  const [name, setName] = useState('');
  const [type, setType] = useState('');
  const [description, setDescription] = useState('');
  const [motto, setMotto] = useState('');
  const [vision, setVision] = useState('');
  const [location, setLocation] = useState('');
  const [tags, setTags] = useState<string[]>([]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(createGroup({ name, type, description, motto, vision, location, tags }));
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* Existing fields */}
      <input
        value={motto}
        onChange={(e) => setMotto(e.target.value)}
        placeholder="Group Motto"
      />
      <textarea
        value={vision}
        onChange={(e) => setVision(e.target.value)}
        placeholder="Group Vision"
      ></textarea>
      <input
        value={location}
        onChange={(e) => setLocation(e.target.value)}
        placeholder="Group Location"
      />
      {/* Add a component for handling tags input */}
      <button type="submit">Create Group</button>
    </form>
  );
};

export default CreateGroup;