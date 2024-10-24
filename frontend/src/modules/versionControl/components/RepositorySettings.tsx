import React, { useState } from 'react';
import { 
  Card, 
  CardContent, 
  Typography, 
  TextField, 
  Switch, 
  FormControlLabel, 
  Button,
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert
} from '@mui/material';
import { Repository } from '../types';
import { useRepositoryOperations } from '../hooks/useRepositoryOperations';

interface RepositorySettingsProps {
  repository: Repository;
  onUpdate?: () => void;
}

export const RepositorySettings: React.FC<RepositorySettingsProps> = ({ 
  repository,
  onUpdate 
}) => {
  const [name, setName] = useState(repository.name);
  const [description, setDescription] = useState(repository.description || '');
  const [isPrivate, setIsPrivate] = useState(repository.isPrivate);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { update, remove } = useRepositoryOperations({
    onSuccess: onUpdate
  });

  const handleSave = async () => {
    setError(null);
    const result = await update(repository.id, {
      name,
      description,
      isPrivate
    });

    if (result) {
      onUpdate?.();
    }
  };

  const handleDelete = async () => {
    const success = await remove(repository.id);
    if (success) {
      setDeleteDialogOpen(false);
      onUpdate?.();
    }
  };

  return (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Repository Settings
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <Box component="form" sx={{ '& > *': { mb: 2 } }}>
          <TextField
            fullWidth
            label="Repository Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <TextField
            fullWidth
            multiline
            rows={3}
            label="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />

          <FormControlLabel
            control={
              <Switch
                checked={isPrivate}
                onChange={(e) => setIsPrivate(e.target.checked)}
              />
            }
            label="Private Repository"
          />

          <Box display="flex" justifyContent="space-between" mt={3}>
            <Button
              variant="contained"
              color="primary"
              onClick={handleSave}
            >
              Save Changes
            </Button>

            <Button
              variant="outlined"
              color="error"
              onClick={() => setDeleteDialogOpen(true)}
            >
              Delete Repository
            </Button>
          </Box>
        </Box>

        <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
          <DialogTitle>Delete Repository?</DialogTitle>
          <DialogContent>
            <Typography>
              Are you sure you want to delete {repository.name}? This action cannot be undone.
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleDelete} color="error">Delete</Button>
          </DialogActions>
        </Dialog>
      </CardContent>
    </Card>
  );
};
