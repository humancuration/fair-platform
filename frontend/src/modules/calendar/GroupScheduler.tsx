import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useQuery, useMutation } from 'react-query';
import DatePicker from 'react-datepicker';
import { useForm, Controller } from 'react-hook-form';
import api from '../../api/api';
import { toast } from 'react-toastify';

interface GroupSchedulerProps {
  groupId: string;
  onScheduled: () => void;
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

const GroupScheduler: React.FC<GroupSchedulerProps> = ({ groupId, onScheduled }) => {
  const [showAdvancedOptions, setShowAdvancedOptions] = useState(false);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<Date | null>(null);

  const { control, watch, handleSubmit } = useForm<ScheduleFormData>();
  const isRecurring = watch('isRecurring');
  const availabilityPolling = watch('availabilityPolling');

  // Fetch group members and their availability
  const { data: groupMembers } = useQuery(['groupMembers', groupId], () =>
    api.get(`/groups/${groupId}/members`).then(res => res.data)
  );

  // Fetch available resources
  const { data: resources } = useQuery(['groupResources', groupId], () =>
    api.get(`/groups/${groupId}/resources`).then(res => res.data)
  );

  // Create event mutation
  const createEventMutation = useMutation(
    (data: ScheduleFormData) => api.post(`/groups/${groupId}/events`, data),
    {
      onSuccess: () => {
        toast.success('Event scheduled successfully!');
        onScheduled();
      },
      onError: () => {
        toast.error('Failed to schedule event');
      },
    }
  );

  // Find optimal time slots
  const findOptimalSlotsMutation = useMutation(
    (constraints: any) => api.post(`/groups/${groupId}/optimal-slots`, constraints),
    {
      onSuccess: (data) => {
        // Show optimal time slots
      },
    }
  );

  const onSubmit = (data: ScheduleFormData) => {
    createEventMutation.mutate(data);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="bg-white rounded-lg shadow-lg p-6"
    >
      <h2 className="text-2xl font-bold mb-6">Schedule Group Event</h2>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium mb-1">Event Title</label>
            <Controller
              name="title"
              control={control}
              rules={{ required: true }}
              render={({ field }) => (
                <input
                  {...field}
                  className="w-full p-2 border rounded"
                  placeholder="Enter event title"
                />
              )}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Event Type</label>
            <Controller
              name="type"
              control={control}
              rules={{ required: true }}
              render={({ field }) => (
                <select {...field} className="w-full p-2 border rounded">
                  <option value="meeting">Meeting</option>
                  <option value="event">Event</option>
                  <option value="task">Task</option>
                  <option value="shift">Shift</option>
                </select>
              )}
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Description</label>
          <Controller
            name="description"
            control={control}
            render={({ field }) => (
              <textarea
                {...field}
                className="w-full p-2 border rounded"
                rows={3}
                placeholder="Enter event description"
              />
            )}
          />
        </div>

        <div className="flex items-center gap-4">
          <Controller
            name="availabilityPolling"
            control={control}
            render={({ field }) => (
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={field.value}
                  onChange={field.onChange}
                />
                Poll for availability
              </label>
            )}
          />

          <Controller
            name="isRecurring"
            control={control}
            render={({ field }) => (
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={field.value}
                  onChange={field.onChange}
                />
                Recurring event
              </label>
            )}
          />
        </div>

        {!availabilityPolling && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium mb-1">Start Time</label>
              <Controller
                name="startTime"
                control={control}
                rules={{ required: true }}
                render={({ field }) => (
                  <DatePicker
                    selected={field.value}
                    onChange={field.onChange}
                    showTimeSelect
                    dateFormat="MMMM d, yyyy h:mm aa"
                    className="w-full p-2 border rounded"
                  />
                )}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">End Time</label>
              <Controller
                name="endTime"
                control={control}
                rules={{ required: true }}
                render={({ field }) => (
                  <DatePicker
                    selected={field.value}
                    onChange={field.onChange}
                    showTimeSelect
                    dateFormat="MMMM d, yyyy h:mm aa"
                    className="w-full p-2 border rounded"
                    minDate={watch('startTime')}
                  />
                )}
              />
            </div>
          </div>
        )}

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
                      {groupMembers?.roles.map(role => (
                        <option key={role.id} value={role.id}>
                          {role.name}
                        </option>
                      ))}
                    </select>
                  )}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Minimum Attendees</label>
                  <Controller
                    name="minimumAttendees"
                    control={control}
                    render={({ field }) => (
                      <input
                        type="number"
                        {...field}
                        className="w-full p-2 border rounded"
                        min={1}
                      />
                    )}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Maximum Attendees</label>
                  <Controller
                    name="maximumAttendees"
                    control={control}
                    render={({ field }) => (
                      <input
                        type="number"
                        {...field}
                        className="w-full p-2 border rounded"
                        min={1}
                      />
                    )}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Resources Needed</label>
                <Controller
                  name="resources"
                  control={control}
                  render={({ field }) => (
                    <select {...field} multiple className="w-full p-2 border rounded">
                      {resources?.map(resource => (
                        <option key={resource.id} value={resource.id}>
                          {resource.name}
                        </option>
                      ))}
                    </select>
                  )}
                />
              </div>

              {isRecurring && (
                <div className="space-y-4">
                  <h3 className="font-medium">Recurrence Pattern</h3>
                  <Controller
                    name="recurrencePattern.frequency"
                    control={control}
                    render={({ field }) => (
                      <select {...field} className="w-full p-2 border rounded">
                        <option value="daily">Daily</option>
                        <option value="weekly">Weekly</option>
                        <option value="monthly">Monthly</option>
                      </select>
                    )}
                  />
                  
                  <Controller
                    name="recurrencePattern.interval"
                    control={control}
                    render={({ field }) => (
                      <input
                        type="number"
                        {...field}
                        className="w-full p-2 border rounded"
                        placeholder="Interval"
                        min={1}
                      />
                    )}
                  />

                  <Controller
                    name="recurrencePattern.endDate"
                    control={control}
                    render={({ field }) => (
                      <DatePicker
                        selected={field.value}
                        onChange={field.onChange}
                        className="w-full p-2 border rounded"
                        placeholderText="End Date (Optional)"
                      />
                    )}
                  />
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        <div className="flex justify-end gap-4">
          <button
            type="button"
            onClick={() => findOptimalSlotsMutation.mutate({
              duration: 60, // minutes
              constraints: {
                earliestDate: new Date(),
                latestDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
                requiredAttendees: watch('requiredRoles'),
              },
            })}
            className="px-4 py-2 text-blue-500 hover:text-blue-600"
          >
            Find Optimal Time
          </button>
          
          <button
            type="submit"
            disabled={createEventMutation.isLoading}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-blue-300"
          >
            {createEventMutation.isLoading ? 'Scheduling...' : 'Schedule Event'}
          </button>
        </div>
      </form>
    </motion.div>
  );
};

export default GroupScheduler;
