import React, { useEffect, useState } from 'react';
import api from '../services/api';

interface Repo {
  id: number;
  name: string;
  html_url: string;
  description: string;
  stargazers_count: number;
  forks_count: number;
}

const UserRepositories: React.FC = () => {
  const [repos, setRepos] = useState<Repo[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchRepos = async () => {
      try {
        const response = await api.get('/github/repos'); // Ensure this route is protected
        setRepos(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching repositories:', error);
        setLoading(false);
      }
    };

    fetchRepos();
  }, []);

  if (loading) return <p>Loading repositories...</p>;

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">Your GitHub Repositories</h2>
      <ul>
        {repos.map((repo) => (
          <li key={repo.id} className="mb-2">
            <a href={repo.html_url} target="_blank" rel="noopener noreferrer" className="text-blue-500">
              {repo.name}
            </a>
            <p className="text-gray-600">{repo.description}</p>
            <p className="text-sm text-gray-500">
              ⭐ {repo.stargazers_count} | 🍴 {repo.forks_count}
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default UserRepositories;