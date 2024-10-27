import type { FC } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Form, useNavigation, useSubmit } from '@remix-run/react';
import DatePicker from 'react-datepicker';
import { useForm, Controller } from 'react-hook-form';
import { FaClock, FaMapMarkerAlt, FaUsers, FaTag } from 'react-icons/fa';

interface GroupSchedulerProps {
  groupId: string;
  onScheduled?: () => void;
  roles?: Array<{ id: string; name: string }>;
  resources?: Array<{ id: string; name: string }>;
}

interface ScheduleFormData {
  title: string;
  description: string;
  type: 'meeting' | 'event' | 'task' | 'shift';
  startTime: Date;
  endTime: Date;
  isRecurring: boolean;
  recurrencePattern?: {
    frequency: 'daily' | 'weekly' | 'monthly';
    interval: number;
    endDate?: Date;
  };
  location?: string;
  requiredRoles?: string[];
  minimumAttendees?: number;
  maximumAttendees?: number;
  resources?: string[];
  tasks?: { title: string; assignedTo?: string }[];
  availabilityPolling: boolean;
}

export const GroupScheduler: FC<GroupSchedulerProps> = ({ 
  groupId, 
  onScheduled,
  roles = [],
  resources = []
}) => {
  const [showAdvancedOptions, setShowAdvancedOptions] = useState(false);
  const navigation = useNavigation();
  const submit = useSubmit();
  const isSubmitting = navigation.state === "submitting";

  const { control, watch, handleSubmit } = useForm<ScheduleFormData>({
    defaultValues: {
      title: '',
      description: '',
      type: 'meeting',
      startTime: new Date(),
      endTime: new Date(),
      isRecurring: false,
      availabilityPolling: false,
      minimumAttendees: 1,
    }
  });

  const isRecurring = watch('isRecurring');
  const availabilityPolling = watch('availabilityPolling');

  const onSubmit = (data: ScheduleFormData) => {
    const formData = new FormData();
    formData.append('intent', 'schedule');
    formData.append('scheduleData', JSON.stringify(data));
    submit(formData, { method: 'post' });
    onScheduled?.();
  };

  return (
    <Form method="post" onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="bg-white rounded-lg shadow-lg p-6"
      >
        <h2 className="text-2xl font-bold mb-6">Schedule Group Event</h2>

        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Controller
              name="title"
              control={control}
              rules={{ required: 'Title is required' }}
              render={({ field, fieldState: { error } }) => (
                <div>
                  <label className="block text-sm font-medium mb-1">Event Title</label>
                  <input
                    {...field}
                    className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter event title"
                  />
                  {error && (
                    <p className="mt-1 text-sm text-red-500">{error.message}</p>
                  )}
                </div>
              )}
            />

            <Controller
              name="type"
              control={control}
              rules={{ required: true }}
              render={({ field }) => (
                <div>
                  <label className="block text-sm font-medium mb-1">Event Type</label>
                  <select {...field} className="w-full p-2 border rounded">
                    <option value="meeting">Meeting</option>
                    <option value="event">Event</option>
                    <option value="task">Task</option>
                    <option value="shift">Shift</option>
                  </select>
                </div>
              )}
            />
          </div>

          {!availabilityPolling && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Controller
                name="startTime"
                control={control}
                rules={{ required: true }}
                render={({ field }) => (
                  <div>
                    <label className="block text-sm font-medium mb-1">Start Time</label>
                    <div className="flex items-center space-x-2">
                      <FaClock className="text-gray-400" />
                      <DatePicker
                        selected={field.value}
                        onChange={field.onChange}
                        showTimeSelect
                        dateFormat="MMMM d, yyyy h:mm aa"
                        className="w-full p-2 border rounded"
                      />
                    </div>
                  </div>
                )}
              />

              <Controller
                name="endTime"
                control={control}
                render={({ field }) => (
                  <div>
                    <label className="block text-sm font-medium mb-1">End Time</label>
                    <div className="flex items-center space-x-2">
                      <FaClock className="text-gray-400" />
                      <DatePicker
                        selected={field.value}
                        onChange={field.onChange}
                        showTimeSelect
                        dateFormat="MMMM d, yyyy h:mm aa"
                        className="w-full p-2 border rounded"
                        minDate={watch('startTime')}
                      />
                    </div>
                  </div>
                )}
              />
            </div>
          )}

          <div className="flex items-center gap-4">
            <Controller
              name="availabilityPolling"
              control={control}
              render={({ field: { value, onChange } }) => (
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={value}
                    onChange={(e) => onChange(e.target.checked)}
                    className="rounded border-gray-300"
                  />
                  <span>Poll for availability</span>
                </label>
              )}
            />

            <Controller
              name="isRecurring"
              control={control}
              render={({ field: { value, onChange } }) => (
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={value}
                    onChange={(e) => onChange(e.target.checked)}
                    className="rounded border-gray-300"
                  />
                  <span>Recurring event</span>
                </label>
              )}
            />
          </div>

          <button
            type="button"
            onClick={() => setShowAdvancedOptions(!showAdvancedOptions)}
            className="text-blue-500 hover:text-blue-600"
          >
            {showAdvancedOptions ? 'Hide' : 'Show'} Advanced Options
          </button>

          <AnimatePresence>
            {showAdvancedOptions && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="space-y-4"
              >
                {/* Advanced scheduling options */}
                <div>
                  <label className="block text-sm font-medium mb-1">Required Roles</label>
                  <Controller
                    name="requiredRoles"
                    control={control}
                    render={({ field }) => (
                      <select {...field} multiple className="w-full p-2 border rounded">
                        {roles.map(role => (
                          <option key={role.id} value={role.id}>
                            {role.name}
                          </option>
                        ))}
                      </select>
                    )}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <Controller
                    name="minimumAttendees"
                    control={control}
                    render={({ field }) => (
                      <div>
                        <label className="block text-sm font-medium mb-1">
                          Minimum Attendees
                        </label>
                        <input
                          type="number"
                          {...field}
                          min={1}
                          className="w-full p-2 border rounded"
                        />
                      </div>
                    )}
                  />

                  <Controller
                    name="maximumAttendees"
                    control={control}
                    render={({ field }) => (
                      <div>
                        <label className="block text-sm font-medium mb-1">
                          Maximum Attendees
                        </label>
                        <input
                          type="number"
                          {...field}
                          min={1}
                          className="w-full p-2 border rounded"
                        />
                      </div>
                    )}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Resources Needed</label>
                  <Controller
                    name="resources"
                    control={control}
                    render={({ field }) => (
                      <select {...field} multiple className="w-full p-2 border rounded">
                        {resources.map(resource => (
                          <option key={resource.id} value={resource.id}>
                            {resource.name}
                          </option>
                        ))}
                      </select>
                    )}
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="flex justify-end gap-4">
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-blue-300 transition"
            >
              {isSubmitting ? 'Scheduling...' : 'Schedule Event'}
            </button>
          </div>
        </div>
      </motion.div>
    </Form>
  );
};
