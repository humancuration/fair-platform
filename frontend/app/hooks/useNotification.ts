import { toast } from 'react-toastify';

const useNotification = () => {
  const notifySuccess = (message: string) => toast.success(message);
  const notifyError = (message: string) => toast.error(message);
  const notifyInfo = (message: string) => toast.info(message);
  const notifyWarning = (message: string) => toast.warn(message);

  return { notifySuccess, notifyError, notifyInfo, notifyWarning };
};

export default useNotification;