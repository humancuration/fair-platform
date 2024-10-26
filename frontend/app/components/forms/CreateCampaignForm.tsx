import { Form, useActionData, useTransition } from '@remix-run/react';
import { motion } from 'framer-motion';
import { FormInput, FormTextArea, FormContainer } from './FormElements';
import type { ActionData } from '~/types/forms';

export default function CreateCampaignForm() {
  const actionData = useActionData<ActionData>();
  const transition = useTransition();
  const isSubmitting = transition.state === "submitting";

  return (
    <FormContainer
      as={Form}
      method="post"
      encType="multipart/form-data"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <FormInput
        name="title"
        label="Campaign Title"
        type="text"
        required
      />

      <FormTextArea
        name="description"
        label="Description"
        rows={4}
        required
      />

      <FormInput
        name="goal"
        label="Goal Amount"
        type="number"
        min="1"
        required
      />

      <FormInput
        name="deadline"
        label="Deadline"
        type="date"
        required
      />

      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">Category</label>
        <select
          name="category"
          className="w-full p-2 border rounded"
          required
        >
          <option value="">Select a category</option>
          <option value="technology">Technology</option>
          <option value="art">Art</option>
          <option value="music">Music</option>
          <option value="film">Film</option>
          <option value="games">Games</option>
          <option value="other">Other</option>
        </select>
      </div>

      <FormInput
        name="image"
        label="Image URL"
        type="url"
      />

      <motion.button
        type="submit"
        disabled={isSubmitting}
        className="w-full bg-blue-500 text-white py-2 px-4 rounded
                 hover:bg-blue-600 disabled:opacity-50"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        {isSubmitting ? 'Creating...' : 'Create Campaign'}
      </motion.button>

      {actionData?.error && (
        <div className="text-red-500 text-sm">{actionData.error}</div>
      )}
    </FormContainer>
  );
}
