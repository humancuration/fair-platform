import { toast } from 'react-toastify';

export const handleError = (error: any) => {
  if (error.response) {
    // Server responded with a status other than 2xx
    toast.error(`Error: ${error.response.data.message || 'Something went wrong!'}`);
  } else if (error.request) {
    // Request was made but no response received
    toast.error('Network error. Please check your connection.');
  } else {
    // Something else happened
    toast.error(`Error: ${error.message}`);
  }
};