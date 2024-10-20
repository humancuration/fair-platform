import React, { useState, useEffect } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { GET_REPOSITORIES, INITIALIZE_REPOSITORY, CLONE_REPOSITORY, PUSH_CHANGES } from '../../graphql/repositoryOperations';
import FileUploader from './FileUploader';
import VersionHistory from './VersionHistory';

const RepositoryBrowser: React.FC = () => {
  const [repositories, setRepositories] = useState<any[]>([]);
  const { data, loading, error } = useQuery(GET_REPOSITORIES);
  const [initializeRepository] = useMutation(INITIALIZE_REPOSITORY);
  const [cloneRepository] = useMutation(CLONE_REPOSITORY);
  const [pushChanges] = useMutation(PUSH_CHANGES);

  useEffect(() => {
    if (data) {
      setRepositories(data.repositories);
    }
  }, [data]);

  const handleInitialize = async (name: string) => {
    try {
      const result = await initializeRepository({ variables: { name } });
      if (result.data.initializeRepository) {
        // Update repositories list
        setRepositories([...repositories, result.data.initializeRepository]);
      }
    } catch (error) {
      console.error('Error initializing repository:', error);
    }
  };

  const handleClone = async (url: string, name: string) => {
    try {
      const result = await cloneRepository({ variables: { url, name } });
      if (result.data.cloneRepository) {
        // Update repositories list
        setRepositories([...repositories, result.data.cloneRepository]);
      }
    } catch (error) {
      console.error('Error cloning repository:', error);
    }
  };

  const handlePush = async (repoName: string) => {
    try {
      const result = await pushChanges({ variables: { repoName } });
      if (result.data.pushChanges) {
        console.log('Changes pushed successfully');
      }
    } catch (error) {
      console.error('Error pushing changes:', error);
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <div>
      <h2>Repositories</h2>
      <ul>
        {repositories.map(repo => (
          <li key={repo.id}>
            {repo.name} 
            <button onClick={() => handlePush(repo.name)}>Push Changes</button>
          </li>
        ))}
      </ul>
      <div>
        <h3>Initialize New Repository</h3>
        <input type="text" placeholder="Repository Name" id="newRepoName" />
        <button onClick={() => handleInitialize((document.getElementById('newRepoName') as HTMLInputElement).value)}>
          Initialize
        </button>
      </div>
      <div>
        <h3>Clone Repository</h3>
        <input type="text" placeholder="Repository URL" id="cloneUrl" />
        <input type="text" placeholder="Repository Name" id="cloneName" />
        <button onClick={() => handleClone(
          (document.getElementById('cloneUrl') as HTMLInputElement).value,
          (document.getElementById('cloneName') as HTMLInputElement).value
        )}>
          Clone
        </button>
      </div>
      <FileUploader repoName={selectedRepo} />
      <VersionHistory versions={versions} onRevert={handleRevert} />
    </div>
  );
};

export default RepositoryBrowser;
