import { toast } from 'react-toastify';

interface ErrorResponse {
  response?: {
    data?: {
      message?: string;
    };
  };
  message?: string;
}

export const handleError = (error: ErrorResponse): void => {
  const errorMessage = error.response?.data?.message || error.message || 'An error occurred';
  toast.error(errorMessage);
};
