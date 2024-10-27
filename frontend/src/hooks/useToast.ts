import { useCallback } from 'react';
import { useSnackbar, VariantType } from 'notistack';
import logger from '../../app/utils/logger.client';

interface ToastOptions {
  variant?: VariantType;
  autoHideDuration?: number;
  preventDuplicate?: boolean;
}

interface ToastMessage {
  type: 'success' | 'error' | 'info' | 'warning';
  message: string;
}

export const useToast = () => {
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();

  const showToast = useCallback(({ type, message }: ToastMessage, options?: ToastOptions) => {
    logger.info(`Showing toast: ${type} - ${message}`);
    enqueueSnackbar(message, {
      variant: type,
      autoHideDuration: 3000,
      preventDuplicate: true,
      ...options
    });
  }, [enqueueSnackbar]);

  const success = useCallback((message: string, options?: ToastOptions) => {
    showToast({ type: 'success', message }, options);
  }, [showToast]);

  const error = useCallback((message: string, options?: ToastOptions) => {
    showToast({ type: 'error', message }, options);
  }, [showToast]);

  const info = useCallback((message: string, options?: ToastOptions) => {
    showToast({ type: 'info', message }, options);
  }, [showToast]);

  const warning = useCallback((message: string, options?: ToastOptions) => {
    showToast({ type: 'warning', message }, options);
  }, [showToast]);

  return {
    showToast,
    success,
    error,
    info,
    warning,
    close: closeSnackbar
  };
};
