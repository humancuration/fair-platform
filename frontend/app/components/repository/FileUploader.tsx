import type { FC } from 'react';
import { Form, useSubmit, useNavigation } from '@remix-run/react';
import { motion } from 'framer-motion';
import { FaUpload, FaSpinner } from 'react-icons/fa';

interface FileUploaderProps {
  repoId: string;
}

export const FileUploader: FC<FileUploaderProps> = ({ repoId }) => {
  const submit = useSubmit();
  const navigation = useNavigation();
  const isUploading = navigation.state === "submitting";

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.currentTarget.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('intent', 'upload');
    formData.append('file', file);
    formData.append('repoId', repoId);

    submit(formData, { method: 'post', encType: 'multipart/form-data' });
  };

  return (
    <Form method="post" encType="multipart/form-data" className="mt-4">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center"
      >
        <input
          type="file"
          onChange={handleFileChange}
          className="hidden"
          id="file-upload"
          disabled={isUploading}
        />
        <label
          htmlFor="file-upload"
          className="cursor-pointer flex flex-col items-center gap-2"
        >
          {isUploading ? (
            <FaSpinner className="animate-spin h-8 w-8 text-blue-500" />
          ) : (
            <FaUpload className="h-8 w-8 text-gray-400" />
          )}
          <span className="text-gray-600">
            {isUploading ? 'Uploading...' : 'Click to upload a file'}
          </span>
        </label>
      </motion.div>
    </Form>
  );
};
