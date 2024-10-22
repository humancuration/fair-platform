import React, { useState } from 'react';
import { useMutation } from '@apollo/client';
import { COMMIT_CHANGES } from './repositoryOperations';

const FileUploader: React.FC<{ repoName: string }> = ({ repoName }) => {
  const [file, setFile] = useState<File | null>(null);
  const [commitChanges] = useMutation(COMMIT_CHANGES);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setFile(event.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!file) return;

    try {
      // Check if file is large (e.g., over 100MB)
      if (file.size > 100 * 1024 * 1024) {
        // Handle large file upload (you might want to implement a separate mutation for this)
        console.log('Uploading large file...');
        // Implement large file upload logic here
      } else {
        const result = await commitChanges({
          variables: {
            repoName,
            filepath: file.name,
            message: `Upload ${file.name}`
          }
        });

        if (result.data.commitChanges) {
          console.log('File uploaded and committed successfully');
          // You might want to update UI or trigger a refresh here
        }
      }
    } catch (error) {
      console.error('Error uploading file:', error);
    }
  };

  return (
    <div>
      <input type="file" onChange={handleFileChange} />
      <button onClick={handleUpload} disabled={!file}>
        Upload and Commit
      </button>
    </div>
  );
};

export default FileUploader;