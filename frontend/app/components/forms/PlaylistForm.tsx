import { Form, useActionData, useSubmit, useTransition } from '@remix-run/react';
import { motion } from 'framer-motion';
import { FaMagic, FaMusic } from 'react-icons/fa';
import { FormInput, FormTextArea, FormContainer } from './FormElements';

interface PlaylistFormProps {
  initialData?: {
    title?: string;
    description?: string;
    isPublic?: boolean;
  };
}

export default function PlaylistForm({ initialData }: PlaylistFormProps) {
  const actionData = useActionData();
  const transition = useTransition();
  const submit = useSubmit();

  const isSubmitting = transition.state === "submitting";

  return (
    <FormContainer
      as={Form}
      method="post"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <FormInput
        name="title"
        label="Playlist Title"
        type="text"
        defaultValue={initialData?.title}
        required
      />

      <FormTextArea
        name="description"
        label="Description"
        defaultValue={initialData?.description}
        rows={4}
      />

      <div className="flex items-center gap-2 mb-4">
        <input
          type="checkbox"
          id="isPublic"
          name="isPublic"
          defaultChecked={initialData?.isPublic}
        />
        <label htmlFor="isPublic">Make this playlist public</label>
      </div>

      <motion.button
        type="submit"
        disabled={isSubmitting}
        className="w-full bg-gradient-to-r from-indigo-500 to-purple-500 text-white py-2 px-4 rounded-md
                 flex items-center justify-center gap-2 hover:from-indigo-600 hover:to-purple-600
                 disabled:opacity-50 disabled:cursor-not-allowed"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <FaMagic />
        {isSubmitting ? 'Creating...' : 'Create Playlist'}
      </motion.button>

      {actionData?.error && (
        <div className="mt-4 text-red-500 text-sm">{actionData.error}</div>
      )}
    </FormContainer>
  );
}
