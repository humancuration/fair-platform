import { useState } from 'react';
import type { FC } from 'react';
import { motion } from 'framer-motion';
import { useForm, Controller } from 'react-hook-form';
import DatePicker from 'react-datepicker';
import { format } from 'date-fns';
import { FaTimes, FaClock, FaMapMarkerAlt, FaUsers, FaBell } from 'react-icons/fa';
import type { Event, EventFormData } from '~/types/calendar';
import { Form, useSubmit, useNavigation } from "@remix-run/react";

interface EventModalProps {
  initialDate?: Date | null;
  event?: Event | null;
  onClose: () => void;
  onSubmit: (data: EventFormData) => void;
  isSubmitting: boolean;
}

export const EventModal: FC<EventModalProps> = ({
  initialDate,
  event,
  onClose,
}) => {
  const submit = useSubmit();
  const navigation = useNavigation();
  const isSubmitting = navigation.state === "submitting";

  const [showRecurring, setShowRecurring] = useState(false);
  const [showReminders, setShowReminders] = useState(false);

  const { control, handleSubmit, watch } = useForm<EventFormData>({
    defaultValues: {
      title: event?.title || '',
      description: event?.description || '',
      start: event ? new Date(event.start) : initialDate || new Date(),
      end: event?.end ? new Date(event.end) : undefined,
      location: event?.location || '',
      category: event?.category || '',
      color: event?.color || '#3B82F6', // Default blue
      isRecurring: event?.isRecurring || false,
      recurringPattern: event?.recurringPattern || {
        frequency: 'weekly',
        interval: 1,
      },
      attendees: event?.attendees || [],
      reminders: event?.reminders || [],
    },
  });

  const isRecurring = watch('isRecurring');

  return (
    <Form 
      method="post"
      onSubmit={(e) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        formData.append("intent", event ? "update" : "create");
        submit(formData, { method: "POST" });
        onClose();
      }}
    >
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          className="bg-white rounded-lg shadow-xl w-full max-w-2xl mx-4"
        >
          <div className="p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">
                {event ? 'Edit Event' : 'Create Event'}
              </h2>
              <button
                onClick={onClose}
                className="text-gray-500 hover:text-gray-700 transition"
              >
                <FaTimes className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-4">
              <Controller
                name="title"
                control={control}
                rules={{ required: 'Title is required' }}
                render={({ field, fieldState: { error } }) => (
                  <div>
                    <input
                      {...field}
                      placeholder="Event Title"
                      className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                    {error && (
                      <p className="mt-1 text-sm text-red-500">{error.message}</p>
                    )}
                  </div>
                )}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Controller
                  name="start"
                  control={control}
                  rules={{ required: 'Start time is required' }}
                  render={({ field }) => (
                    <div className="flex items-center space-x-2">
                      <FaClock className="text-gray-400" />
                      <DatePicker
                        selected={field.value}
                        onChange={field.onChange}
                        showTimeSelect
                        dateFormat="MMMM d, yyyy h:mm aa"
                        className="w-full px-4 py-2 border rounded-md"
                        placeholderText="Start Time"
                      />
                    </div>
                  )}
                />

                <Controller
                  name="end"
                  control={control}
                  render={({ field }) => (
                    <div className="flex items-center space-x-2">
                      <FaClock className="text-gray-400" />
                      <DatePicker
                        selected={field.value}
                        onChange={field.onChange}
                        showTimeSelect
                        dateFormat="MMMM d, yyyy h:mm aa"
                        className="w-full px-4 py-2 border rounded-md"
                        placeholderText="End Time (Optional)"
                        minDate={watch('start')}
                      />
                    </div>
                  )}
                />
              </div>

              <Controller
                name="location"
                control={control}
                render={({ field }) => (
                  <div className="flex items-center space-x-2">
                    <FaMapMarkerAlt className="text-gray-400" />
                    <input
                      {...field}
                      placeholder="Location (Optional)"
                      className="w-full px-4 py-2 border rounded-md"
                    />
                  </div>
                )}
              />

              <Controller
                name="description"
                control={control}
                render={({ field }) => (
                  <textarea
                    {...field}
                    placeholder="Description (Optional)"
                    rows={3}
                    className="w-full px-4 py-2 border rounded-md"
                  />
                )}
              />

              <div className="flex items-center space-x-4">
                <Controller
                  name="isRecurring"
                  control={control}
                  render={({ field: { value, onChange } }) => (
                    <label className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={value}
                        onChange={(e) => {
                          onChange(e.target.checked);
                          setShowRecurring(e.target.checked);
                        }}
                        className="rounded border-gray-300"
                      />
                      <span>Recurring Event</span>
                    </label>
                  )}
                />
              </div>

              {isRecurring && showRecurring && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="space-y-4 p-4 bg-gray-50 rounded-md"
                >
                  {/* Recurring pattern controls */}
                  <Controller
                    name="recurringPattern.frequency"
                    control={control}
                    render={({ field }) => (
                      <select {...field} className="w-full px-4 py-2 border rounded-md">
                        <option value="daily">Daily</option>
                        <option value="weekly">Weekly</option>
                        <option value="monthly">Monthly</option>
                      </select>
                    )}
                  />
                  
                  <Controller
                    name="recurringPattern.interval"
                    control={control}
                    render={({ field }) => (
                      <input
                        type="number"
                        {...field}
                        min={1}
                        className="w-full px-4 py-2 border rounded-md"
                        placeholder="Repeat every X days/weeks/months"
                      />
                    )}
                  />
                </motion.div>
              )}
            </div>

            <div className="flex justify-end space-x-4">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition disabled:bg-blue-300"
              >
                {isSubmitting ? 'Saving...' : event ? 'Update Event' : 'Create Event'}
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </Form>
  );
};
