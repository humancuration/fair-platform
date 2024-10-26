import { Form, useActionData, useTransition } from '@remix-run/react';
import { motion } from 'framer-motion';
import { FormInput, FormContainer } from './FormElements';
import type { ActionData } from '~/types/forms';

interface MediaItemFormProps {
  onSuccess?: () => void;
}

export default function MediaItemForm({ onSuccess }: MediaItemFormProps) {
  const actionData = useActionData<ActionData>();
  const transition = useTransition();
  const isSubmitting = transition.state === "submitting";

  return (
    <FormContainer
      as={Form}
      method="post"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <div className="space-y-4">
        <select
          name="type"
          className="w-full p-2 border rounded"
          defaultValue="music"
        >
          <option value="music">Music</option>
          <option value="video">Video</option>
          <option value="social">Social Media Clip</option>
          <option value="podcast">Podcast</option>
        </select>

        <FormInput
          name="title"
          label="Title"
          type="text"
          required
        />

        <FormInput
          name="url"
          label="URL"
          type="url"
          required
        />

        <motion.button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-blue-500 text-white py-2 px-4 rounded
                   hover:bg-blue-600 disabled:opacity-50"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          {isSubmitting ? 'Adding...' : 'Add Media Item'}
        </motion.button>

        {actionData?.error && (
          <div className="text-red-500 text-sm">{actionData.error}</div>
        )}
      </div>
    </FormContainer>
  );
}
