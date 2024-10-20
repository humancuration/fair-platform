import { useCallback } from 'react';
import { toast } from 'react-toastify';

export const useToast = () => {
  const success = useCallback((message: string) => {
    toast.success(message);
  }, []);

  const error = useCallback((message: string) => {
    toast.error(message);
  }, []);

  const info = useCallback((message: string) => {
    toast.info(message);
  }, []);

  return { success, error, info };
};
