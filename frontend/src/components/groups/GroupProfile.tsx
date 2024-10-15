import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchGroupById, fetchResources, castVote } from '../../store/slices/groupsSlice';
import { RootState } from '../../store/store';

const GroupProfile = () => {
  const { id } = useParams<{ id: string }>();
  const dispatch = useDispatch();
  const group = useSelector((state: RootState) => state.groups.groups.find(g => g.id === Number(id)));
  const status = useSelector((state: RootState) => state.groups.status);
  const error = useSelector((state: RootState) => state.groups.error);

  useEffect(() => {
    if (id) {
      dispatch(fetchGroupById(Number(id)));
      dispatch(fetchResources(Number(id)));
    }
  }, [id, dispatch]);

  if (status === 'loading') return <div>Loading...</div>;
  if (error) return <div>{error}</div>;
  if (!group) return <div>Group not found</div>;

  const handleVote = (petitionId: number, voteType: 'Upvote' | 'Downvote') => {
    dispatch(castVote({ groupId: group.id, petitionId, voteType }));
  };

  return (
    <div>
      <h2>{group.name}</h2>
      <img src={group.profilePicture} alt={`${group.name} Profile`} />
      <img src={group.coverPhoto} alt={`${group.name} Cover`} />
      <p>Motto: {group.motto}</p>
      <p>Vision: {group.vision}</p>
      <p>Location: {group.location}</p>
      <p>Pinned Announcement: {group.pinnedAnnouncement}</p>
      <p>Tags: {group.tags.join(', ')}</p>
      <p>Resource Credits: {group.resourceCredits}</p>

      <h3>Resources Exchange</h3>
      {/* Render resources and allow requesting */}
      <ul>
        {group.resources?.map(resource => (
          <li key={resource.id}>
            <strong>{resource.type}:</strong> {resource.description}
            {resource.available && <button onClick={() => /* Implement request logic */ null}>Request</button>}
          </li>
        ))}
      </ul>

      <h3>Petitions</h3>
      {/* Render petitions with voting options */}
      {/* Implement Petition listing and voting */}
    </div>
  );
};

export default GroupProfile;