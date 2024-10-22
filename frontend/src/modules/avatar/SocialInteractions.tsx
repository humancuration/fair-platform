import React, { useState, useEffect } from 'react';
import api from '../../api/api';

interface Friend {
  id: string;
  username: string;
  avatarImage: string;
}

const SocialInteractions: React.FC<{ userId: string }> = ({ userId }) => {
  const [friends, setFriends] = useState<Friend[]>([]);

  useEffect(() => {
    fetchFriends();
  }, []);

  const fetchFriends = async () => {
    try {
      const response = await api.get(`/friends/${userId}`);
      setFriends(response.data);
    } catch (error) {
      console.error('Error fetching friends:', error);
    }
  };

  const sendGift = async (friendId: string) => {
    try {
      await api.post(`/friends/${userId}/gift`, { friendId });
      // You might want to update the UI or show a success message here
    } catch (error) {
      console.error('Error sending gift:', error);
    }
  };

  return (
    <div className="mt-4">
      <h3 className="text-lg font-bold">Friends</h3>
      <div className="grid grid-cols-2 gap-2">
        {friends.map((friend) => (
          <div key={friend.id} className="border p-2 rounded">
            <img src={friend.avatarImage} alt={friend.username} className="w-16 h-16 mx-auto rounded-full" />
            <p className="text-center mt-1">{friend.username}</p>
            <button
              onClick={() => sendGift(friend.id)}
              className="bg-green-500 text-white px-2 py-1 rounded mt-1 w-full"
            >
              Send Gift
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SocialInteractions;
