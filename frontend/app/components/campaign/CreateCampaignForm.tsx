import type { FC } from 'react';
import { Form, useNavigation } from '@remix-run/react';
import { motion } from 'framer-motion';
import { useForm, Controller } from 'react-hook-form';
import DatePicker from 'react-datepicker';
import { FaImage, FaTag, FaDollarSign, FaCalendar } from 'react-icons/fa';

interface CreateCampaignFormData {
  title: string;
  description: string;
  goal: number;
  deadline: Date;
  category: string;
  image?: string;
}

export const CreateCampaignForm: FC = () => {
  const navigation = useNavigation();
  const isSubmitting = navigation.state === "submitting";

  const { control, handleSubmit } = useForm<CreateCampaignFormData>({
    defaultValues: {
      title: '',
      description: '',
      goal: 1000,
      deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
      category: 'general',
    },
  });

  return (
    <Form method="post" className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-lg shadow-lg p-6"
      >
        <Controller
          name="title"
          control={control}
          rules={{ required: 'Title is required' }}
          render={({ field, fieldState: { error } }) => (
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">Campaign Title</label>
              <input
                {...field}
                type="text"
                className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
                placeholder="Enter campaign title"
              />
              {error && (
                <p className="mt-1 text-sm text-red-500">{error.message}</p>
              )}
            </div>
          )}
        />

        <Controller
          name="description"
          control={control}
          rules={{ required: 'Description is required' }}
          render={({ field, fieldState: { error } }) => (
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">Description</label>
              <textarea
                {...field}
                rows={4}
                className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
                placeholder="Describe your campaign"
              />
              {error && (
                <p className="mt-1 text-sm text-red-500">{error.message}</p>
              )}
            </div>
          )}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <Controller
            name="goal"
            control={control}
            rules={{ required: 'Goal amount is required', min: 1 }}
            render={({ field, fieldState: { error } }) => (
              <div>
                <label className="block text-sm font-medium mb-1">
                  <FaDollarSign className="inline mr-1" />
                  Fundraising Goal
                </label>
                <input
                  {...field}
                  type="number"
                  min="1"
                  step="1"
                  className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter goal amount"
                />
                {error && (
                  <p className="mt-1 text-sm text-red-500">{error.message}</p>
                )}
              </div>
            )}
          />

          <Controller
            name="deadline"
            control={control}
            rules={{ required: 'Deadline is required' }}
            render={({ field, fieldState: { error } }) => (
              <div>
                <label className="block text-sm font-medium mb-1">
                  <FaCalendar className="inline mr-1" />
                  End Date
                </label>
                <DatePicker
                  selected={field.value}
                  onChange={field.onChange}
                  minDate={new Date()}
                  className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
                />
                {error && (
                  <p className="mt-1 text-sm text-red-500">{error.message}</p>
                )}
              </div>
            )}
          />
        </div>

        <Controller
          name="category"
          control={control}
          rules={{ required: 'Category is required' }}
          render={({ field, fieldState: { error } }) => (
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">
                <FaTag className="inline mr-1" />
                Category
              </label>
              <select
                {...field}
                className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
              >
                <option value="general">General</option>
                <option value="education">Education</option>
                <option value="medical">Medical</option>
                <option value="emergency">Emergency</option>
                <option value="community">Community</option>
                <option value="creative">Creative</option>
              </select>
              {error && (
                <p className="mt-1 text-sm text-red-500">{error.message}</p>
              )}
            </div>
          )}
        />

        <Controller
          name="image"
          control={control}
          render={({ field }) => (
            <div className="mb-6">
              <label className="block text-sm font-medium mb-1">
                <FaImage className="inline mr-1" />
                Campaign Image (Optional)
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    // Handle file upload here if needed
                    field.onChange(file);
                  }
                }}
                className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
              />
            </div>
          )}
        />

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-6 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-blue-300 transition flex items-center gap-2"
          >
            {isSubmitting ? 'Creating...' : 'Create Campaign'}
          </button>
        </div>
      </motion.div>
    </Form>
  );
};
