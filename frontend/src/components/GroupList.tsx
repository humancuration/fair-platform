import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchGroups, searchGroups } from '../store/slices/groupsSlice';
import { RootState } from '../store/store';

const GroupList = () => {
  const dispatch = useDispatch();
  const { groups, status, error } = useSelector((state: RootState) => state.groups);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchGroups());
    }
  }, [status, dispatch]);

  const handleSearch = () => {
    dispatch(searchGroups({ query: searchTerm }));
  };

  if (status === 'loading') return <div>Loading...</div>;
  if (status === 'failed') return <div>{error}</div>;

  return (
    <div>
      <input
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder="Search groups"
      />
      <button onClick={handleSearch}>Search</button>
      <ul>
        {groups.map((group) => (
          <li key={group.id}>
            <h3>{group.name}</h3>
            <p>{group.type}</p>
            <p>{group.description}</p>
            {group.motto && <p>Motto: {group.motto}</p>}
            {group.location && <p>Location: {group.location}</p>}
            {group.tags && <p>Tags: {group.tags.join(', ')}</p>}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default GroupList;