import React from 'react';
import { useQuery } from '@apollo/client';
import { 
  Card, 
  CardContent, 
  Typography, 
  Chip, 
  Box,
  Divider,
  LinearProgress
} from '@mui/material';
import { GET_STATUS, GET_LOG } from '../repositoryOperations';
import { useRepoWebSocket } from '../hooks/useRepoWebSocket';
import { Repository, RepositoryStatus, Commit } from '../types';
import { formatDistance } from 'date-fns';

interface RepositoryDetailsProps {
  repository: Repository;
}

export const RepositoryDetails: React.FC<RepositoryDetailsProps> = ({ repository }) => {
  const { data: statusData, loading: statusLoading } = useQuery(GET_STATUS, {
    variables: { dir: repository.name },
    pollInterval: 30000 // Poll every 30 seconds
  });

  const { data: logData, loading: logLoading } = useQuery(GET_LOG, {
    variables: { dir: repository.name, depth: 10 }
  });

  useRepoWebSocket({
    repoId: repository.id,
    onUpdate: (data) => {
      // Refetch queries when updates occur
      if (data.type === 'commit' || data.type === 'push') {
        refetch();
      }
    }
  });

  const status: RepositoryStatus = statusData?.getStatus;
  const commits: Commit[] = logData?.getLog || [];

  return (
    <Card>
      <CardContent>
        <Typography variant="h5" gutterBottom>
          {repository.name}
        </Typography>
        
        {repository.description && (
          <Typography color="textSecondary" paragraph>
            {repository.description}
          </Typography>
        )}

        <Box display="flex" gap={1} mb={2}>
          <Chip 
            label={`Branch: ${status?.branch || 'main'}`}
            color="primary"
            size="small"
          />
          <Chip 
            label={`LFS: ${repository.lfsEnabled ? 'Enabled' : 'Disabled'}`}
            color={repository.lfsEnabled ? 'success' : 'default'}
            size="small"
          />
        </Box>

        <Divider />

        {(statusLoading || logLoading) && <LinearProgress />}

        {status && (
          <Box mt={2}>
            <Typography variant="h6">Status</Typography>
            <Box display="flex" gap={1} mt={1}>
              {status.staged.length > 0 && (
                <Chip 
                  label={`${status.staged.length} staged`}
                  color="success"
                  size="small"
                />
              )}
              {status.unstaged.length > 0 && (
                <Chip 
                  label={`${status.unstaged.length} unstaged`}
                  color="warning"
                  size="small"
                />
              )}
              {status.ahead > 0 && (
                <Chip 
                  label={`${status.ahead} ahead`}
                  color="info"
                  size="small"
                />
              )}
              {status.behind > 0 && (
                <Chip 
                  label={`${status.behind} behind`}
                  color="error"
                  size="small"
                />
              )}
            </Box>
          </Box>
        )}

        {commits.length > 0 && (
          <Box mt={2}>
            <Typography variant="h6">Recent Commits</Typography>
            {commits.map((commit) => (
              <Box key={commit.oid} mt={1}>
                <Typography variant="subtitle2">
                  {commit.message}
                </Typography>
                <Typography variant="caption" color="textSecondary">
                  {commit.author.name} • {formatDistance(new Date(commit.author.timestamp), new Date(), { addSuffix: true })}
                </Typography>
              </Box>
            ))}
          </Box>
        )}
      </CardContent>
    </Card>
  );
};
