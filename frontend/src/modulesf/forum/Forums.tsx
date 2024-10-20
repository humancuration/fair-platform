import React, { useEffect, useState, useContext } from 'react';
import api from '../../api/api';
import { AuthContext } from '../../contexts/AuthContext';
import { Link } from 'react-router-dom';

interface Forum {
  id: number;
  title: string;
  description: string;
}

const Forums: React.FC = () => {
  const [forums, setForums] = useState<Forum[]>([]);
  const { token } = useContext(AuthContext);

  useEffect(() => {
    const fetchForums = async () => {
      try {
        const res = await api.get('/forums', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setForums(res.data);
      } catch (err) {
        console.error(err);
        alert('Failed to fetch forums');
      }
    };
    fetchForums();
  }, [token]);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl mb-4">Community Forums</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {forums.map((forum) => (
          <div key={forum.id} className="border p-4 rounded shadow">
            <h2 className="text-xl font-bold">{forum.title}</h2>
            <p className="mt-2">{forum.description}</p>
            <Link to={`/forums/${forum.id}`} className="text-blue-500 mt-2 inline-block">
              View Posts
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Forums;
