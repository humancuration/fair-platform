import { useState } from 'react';
import { useMutation, useQuery } from '@apollo/client';
import { useToast } from '../../../hooks/useToast';
import logger from '../../../../app/utils/logger.client';
import * as operations from '../repositoryOperations';

export const useVersionControl = () => {
  const [loading, setLoading] = useState(false);
  const { showToast } = useToast();

  const handleError = (error: any, operation: string) => {
    logger.error(`Version control error during ${operation}:`, error);
    showToast({
      type: 'error',
      message: `Failed to ${operation}: ${error.message}`
    });
  };

  const handleSuccess = (message: string) => {
    showToast({
      type: 'success',
      message
    });
  };

  const [initializeRepository] = useMutation(operations.INITIALIZE_REPOSITORY, {
    onError: (error) => handleError(error, 'initialize repository'),
    onCompleted: () => handleSuccess('Repository initialized successfully')
  });

  // ... other mutations with similar error handling

  return {
    loading,
    initializeRepository,
    // ... other operations
  };
};
