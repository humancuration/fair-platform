import React, { useState, useEffect } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import {
  GET_REPOSITORIES,
  INITIALIZE_REPOSITORY,
  CLONE_REPOSITORY,
  PUSH_CHANGES,
  CREATE_BRANCH,
  SWITCH_BRANCH,
  GET_STATUS,
  GET_LOG
} from './repositoryOperations';
import FileUploader from './FileUploader';
import VersionHistory from './VersionHistory';

const RepositoryBrowser: React.FC = () => {
  const [repositories, setRepositories] = useState<any[]>([]);
  const [selectedRepo, setSelectedRepo] = useState<string | null>(null);
  const { data, loading, error } = useQuery(GET_REPOSITORIES);
  const [initializeRepository] = useMutation(INITIALIZE_REPOSITORY);
  const [cloneRepository] = useMutation(CLONE_REPOSITORY);
  const [pushChanges] = useMutation(PUSH_CHANGES);
  const [createBranch] = useMutation(CREATE_BRANCH);
  const [switchBranch] = useMutation(SWITCH_BRANCH);

  const { data: statusData, refetch: refetchStatus } = useQuery(GET_STATUS, {
    variables: { dir: selectedRepo },
    skip: !selectedRepo,
  });

  const { data: logData, refetch: refetchLog } = useQuery(GET_LOG, {
    variables: { dir: selectedRepo, depth: 10 },
    skip: !selectedRepo,
  });

  useEffect(() => {
    if (data) {
      setRepositories(data.repositories);
    }
  }, [data]);

  const handleInitialize = async (name: string) => {
    try {
      const result = await initializeRepository({ variables: { name } });
      if (result.data.initializeRepository) {
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
        refetchStatus();
        refetchLog();
      }
    } catch (error) {
      console.error('Error pushing changes:', error);
    }
  };

  const handleCreateBranch = async (branchName: string) => {
    if (!selectedRepo) return;
    try {
      const result = await createBranch({ variables: { dir: selectedRepo, branchName } });
      if (result.data.createBranch) {
        console.log('Branch created successfully');
        refetchStatus();
        refetchLog();
      }
    } catch (error) {
      console.error('Error creating branch:', error);
    }
  };

  const handleSwitchBranch = async (branchName: string) => {
    if (!selectedRepo) return;
    try {
      const result = await switchBranch({ variables: { dir: selectedRepo, branchName } });
      if (result.data.switchBranch) {
        console.log('Switched branch successfully');
        refetchStatus();
        refetchLog();
      }
    } catch (error) {
      console.error('Error switching branch:', error);
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
            <button onClick={() => setSelectedRepo(repo.name)}>Select</button>
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
      {selectedRepo && (
        <div>
          <h3>Selected Repository: {selectedRepo}</h3>
          <div>
            <h4>Create Branch</h4>
            <input type="text" placeholder="Branch Name" id="newBranchName" />
            <button onClick={() => handleCreateBranch((document.getElementById('newBranchName') as HTMLInputElement).value)}>
              Create Branch
            </button>
          </div>
          <div>
            <h4>Switch Branch</h4>
            <input type="text" placeholder="Branch Name" id="switchBranchName" />
            <button onClick={() => handleSwitchBranch((document.getElementById('switchBranchName') as HTMLInputElement).value)}>
              Switch Branch
            </button>
          </div>
          <FileUploader repoName={selectedRepo} />
          {statusData && (
            <div>
              <h4>Repository Status</h4>
              <pre>{JSON.stringify(statusData.getStatus, null, 2)}</pre>
            </div>
          )}
          {logData && (
            <VersionHistory
              versions={logData.getLog.map((commit: any) => ({
                id: commit.oid,
                content: commit.message,
                title: `Commit ${commit.oid.slice(0, 7)}`,
                timestamp: new Date(commit.author.timestamp).toLocaleString(),
              }))}
              onRevert={() => {}} // Implement revert functionality if needed
            />
          )}
        </div>
      )}
    </div>
  );
};

export default RepositoryBrowser;
