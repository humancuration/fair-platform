import { useCallback } from 'react';
import { useMutation, useQuery } from '@apollo/client';
import { useToast } from '../../../hooks/useToast';
import { Repository } from '../types';
import * as operations from '../repositoryOperations';

interface UseRepositoryOperationsProps {
  onSuccess?: (operation: string) => void;
}

export const useRepositoryOperations = ({ onSuccess }: UseRepositoryOperationsProps = {}) => {
  const { success, error: showError } = useToast();

  const handleError = useCallback((error: Error, operation: string) => {
    showError(`Failed to ${operation}: ${error.message}`);
  }, [showError]);

  const handleSuccess = useCallback((operation: string) => {
    success(`Successfully ${operation}`);
    onSuccess?.(operation);
  }, [success, onSuccess]);

  const [initializeRepo] = useMutation(operations.INITIALIZE_REPOSITORY, {
    onError: (error) => handleError(error, 'initialize repository'),
    onCompleted: () => handleSuccess('initialized repository')
  });

  const [deleteRepo] = useMutation(operations.DELETE_REPOSITORY, {
    onError: (error) => handleError(error, 'delete repository'),
    onCompleted: () => handleSuccess('deleted repository')
  });

  const [updateRepo] = useMutation(operations.UPDATE_REPOSITORY, {
    onError: (error) => handleError(error, 'update repository'),
    onCompleted: () => handleSuccess('updated repository')
  });

  const { data: repoData, loading, refetch } = useQuery(operations.GET_REPOSITORIES);

  const initialize = useCallback(async (name: string, description?: string) => {
    try {
      const result = await initializeRepo({
        variables: { name, description }
      });
      return result.data?.initializeRepository;
    } catch (error) {
      handleError(error as Error, 'initialize repository');
      return null;
    }
  }, [initializeRepo, handleError]);

  const update = useCallback(async (id: string, data: Partial<Repository>) => {
    try {
      const result = await updateRepo({
        variables: { id, ...data }
      });
      return result.data?.updateRepository;
    } catch (error) {
      handleError(error as Error, 'update repository');
      return null;
    }
  }, [updateRepo, handleError]);

  const remove = useCallback(async (id: string) => {
    try {
      await deleteRepo({
        variables: { id }
      });
      return true;
    } catch (error) {
      handleError(error as Error, 'delete repository');
      return false;
    }
  }, [deleteRepo, handleError]);

  return {
    repositories: repoData?.repositories || [],
    loading,
    refetch,
    initialize,
    update,
    remove
  };
};
