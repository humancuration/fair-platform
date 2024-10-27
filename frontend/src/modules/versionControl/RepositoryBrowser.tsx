import React, { useState, useEffect } from 'react';
import { json } from '@remix-run/node';
import { useLoaderData, useActionData, useFetcher, Form } from '@remix-run/react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Box, 
  Button, 
  TextField, 
  Typography,
  Alert,
  CircularProgress,
  Card,
  CardContent,
  Grid 
} from '@mui/material';
import { Repository } from './types';
import { RepositoryDetails } from './components/RepositoryDetails';
import { RepositorySettings } from './components/RepositorySettings';
import FileUploader from './FileUploader';
import { useToast } from '../../hooks/useToast';
import logger from '../../../app/utils/logger.client';

// Loader function for fetching repositories
export async function loader() {
  try {
    const repositories = await getRepositories(); // Implement this function to fetch repos
    return json({ repositories });
  } catch (error) {
    logger.error('Error loading repositories:', error);
    throw new Error('Failed to load repositories');
  }
}

// Action function for handling mutations
export async function action({ request }: { request: Request }) {
  const formData = await request.formData();
  const intent = formData.get('intent');

  try {
    switch (intent) {
      case 'initialize':
        const name = formData.get('name') as string;
        const description = formData.get('description') as string;
        return await initializeRepository(name, description);

      case 'clone':
        const url = formData.get('url') as string;
        const repoName = formData.get('repoName') as string;
        return await cloneRepository(url, repoName);

      case 'createBranch':
        const branchName = formData.get('branchName') as string;
        const repoDir = formData.get('repoDir') as string;
        return await createBranch(repoDir, branchName);

      default:
        return json({ error: 'Invalid action' }, { status: 400 });
    }
  } catch (error) {
    logger.error('Action error:', error);
    return json({ error: error.message }, { status: 500 });
  }
}

export default function RepositoryBrowser() {
  const { repositories } = useLoaderData<typeof loader>();
  const actionData = useActionData<typeof action>();
  const fetcher = useFetcher();
  const { showToast } = useToast();
  const [selectedRepo, setSelectedRepo] = useState<Repository | null>(null);

  // Show errors from action data
  useEffect(() => {
    if (actionData?.error) {
      showToast({
        type: 'error',
        message: actionData.error
      });
    }
  }, [actionData, showToast]);

  const handleRepoSelect = (repo: Repository) => {
    setSelectedRepo(repo);
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Repository Management
      </Typography>

      {fetcher.state === 'loading' && <CircularProgress />}

      <Grid container spacing={3}>
        {/* Repository List */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6">Your Repositories</Typography>
              <AnimatePresence>
                {repositories.map((repo: Repository) => (
                  <motion.div
                    key={repo.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    <Card 
                      variant="outlined" 
                      sx={{ mb: 1, cursor: 'pointer' }}
                      onClick={() => handleRepoSelect(repo)}
                    >
                      <CardContent>
                        <Typography variant="h6">{repo.name}</Typography>
                        {repo.description && (
                          <Typography color="textSecondary">
                            {repo.description}
                          </Typography>
                        )}
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </AnimatePresence>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          {selectedRepo ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
            >
              <RepositoryDetails repository={selectedRepo} />
              <Box mt={2}>
                <RepositorySettings 
                  repository={selectedRepo}
                  onUpdate={() => {
                    showToast({
                      type: 'success',
                      message: 'Repository settings updated successfully!'
                    });
                  }}
                />
              </Box>
            </motion.div>
          ) : (
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Create New Repository
                </Typography>
                <Form method="post">
                  <input type="hidden" name="intent" value="initialize" />
                  <Box sx={{ '& > *': { mb: 2 } }}>
                    <TextField
                      fullWidth
                      label="Repository Name"
                      name="name"
                      required
                      inputProps={{
                        pattern: '^[a-zA-Z0-9-_]+$',
                        title: 'Use only letters, numbers, hyphens, and underscores'
                      }}
                    />
                    <TextField
                      fullWidth
                      multiline
                      rows={3}
                      label="Description (optional)"
                      name="description"
                    />
                    <Button
                      type="submit"
                      variant="contained"
                      disabled={fetcher.state === 'submitting'}
                    >
                      {fetcher.state === 'submitting' ? 'Creating...' : 'Create Repository'}
                    </Button>
                  </Box>
                </Form>

                <Typography variant="h6" gutterBottom sx={{ mt: 4 }}>
                  Clone Repository
                </Typography>
                <fetcher.Form method="post">
                  <input type="hidden" name="intent" value="clone" />
                  <Box sx={{ '& > *': { mb: 2 } }}>
                    <TextField
                      fullWidth
                      label="Repository URL"
                      name="url"
                      required
                    />
                    <TextField
                      fullWidth
                      label="Repository Name"
                      name="repoName"
                      required
                    />
                    <Button
                      type="submit"
                      variant="contained"
                      disabled={fetcher.state === 'submitting'}
                    >
                      {fetcher.state === 'submitting' ? 'Cloning...' : 'Clone Repository'}
                    </Button>
                  </Box>
                </fetcher.Form>
              </CardContent>
            </Card>
          )}
        </Grid>
      </Grid>
    </Box>
  );
}
