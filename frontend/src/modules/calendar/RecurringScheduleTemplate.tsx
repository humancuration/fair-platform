import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useForm, Controller } from 'react-hook-form';
import DatePicker from 'react-datepicker';
import { useMutation } from 'react-query';
import api from '../../api/api';
import { toast } from 'react-toastify';

interface ScheduleTemplate {
  name: string;
  description: string;
  frequency: 'daily' | 'weekly' | 'monthly';
  interval: number;
  startDate: Date;
  endDate?: Date;
  timeSlots: {
    day: number;
    startTime: string;
    endTime: string;
    roles: string[];
    minimumAttendees: number;
  }[];
  rotateRoles: boolean;
  autoAssign: boolean;
  notifyInAdvance: number; // hours
  allowSwaps: boolean;
  requireApproval: boolean;
}

const RecurringScheduleTemplate: React.FC<{ groupId: string }> = ({ groupId }) => {
  const [timeSlots, setTimeSlots] = useState<ScheduleTemplate['timeSlots']>([]);
  const { control, handleSubmit, watch } = useForm<ScheduleTemplate>();
  const frequency = watch('frequency');

  const createTemplateMutation = useMutation(
    (data: ScheduleTemplate) => api.post(`/groups/${groupId}/schedule-templates`, data),
    {
      onSuccess: () => {
        toast.success('Schedule template created successfully!');
      },
      onError: () => {
        toast.error('Failed to create schedule template');
      },
    }
  );

  const addTimeSlot = () => {
    setTimeSlots([
      ...timeSlots,
      {
        day: 0,
        startTime: '09:00',
        endTime: '17:00',
        roles: [],
        minimumAttendees: 1,
      },
    ]);
  };

  const removeTimeSlot = (index: number) => {
    setTimeSlots(timeSlots.filter((_, i) => i !== index));
  };

  const onSubmit = (data: ScheduleTemplate) => {
    createTemplateMutation.mutate({
      ...data,
      timeSlots,
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="bg-white rounded-lg shadow-lg p-6"
    >
      <h2 className="text-2xl font-bold mb-6">Create Recurring Schedule Template</h2>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium mb-1">Template Name</label>
            <Controller
              name="name"
              control={control}
              rules={{ required: true }}
              render={({ field }) => (
                <input
                  {...field}
                  className="w-full p-2 border rounded"
                  placeholder="Enter template name"
                />
              )}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Frequency</label>
            <Controller
              name="frequency"
              control={control}
              rules={{ required: true }}
              render={({ field }) => (
                <select {...field} className="w-full p-2 border rounded">
                  <option value="daily">Daily</option>
                  <option value="weekly">Weekly</option>
                  <option value="monthly">Monthly</option>
                </select>
              )}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium mb-1">Start Date</label>
            <Controller
              name="startDate"
              control={control}
              rules={{ required: true }}
              render={({ field }) => (
                <DatePicker
                  selected={field.value}
                  onChange={field.onChange}
                  className="w-full p-2 border rounded"
                />
              )}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">End Date (Optional)</label>
            <Controller
              name="endDate"
              control={control}
              render={({ field }) => (
                <DatePicker
                  selected={field.value}
                  onChange={field.onChange}
                  className="w-full p-2 border rounded"
                  minDate={watch('startDate')}
                />
              )}
            />
          </div>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-4">Time Slots</h3>
          <div className="space-y-4">
            {timeSlots.map((slot, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-4 p-4 border rounded"
              >
                {frequency === 'weekly' && (
                  <select
                    value={slot.day}
                    onChange={(e) => {
                      const newSlots = [...timeSlots];
                      newSlots[index].day = parseInt(e.target.value);
                      setTimeSlots(newSlots);
                    }}
                    className="p-2 border rounded"
                  >
                    <option value={0}>Sunday</option>
                    <option value={1}>Monday</option>
                    <option value={2}>Tuesday</option>
                    <option value={3}>Wednesday</option>
                    <option value={4}>Thursday</option>
                    <option value={5}>Friday</option>
                    <option value={6}>Saturday</option>
                  </select>
                )}

                <input
                  type="time"
                  value={slot.startTime}
                  onChange={(e) => {
                    const newSlots = [...timeSlots];
                    newSlots[index].startTime = e.target.value;
                    setTimeSlots(newSlots);
                  }}
                  className="p-2 border rounded"
                />

                <input
                  type="time"
                  value={slot.endTime}
                  onChange={(e) => {
                    const newSlots = [...timeSlots];
                    newSlots[index].endTime = e.target.value;
                    setTimeSlots(newSlots);
                  }}
                  className="p-2 border rounded"
                />

                <button
                  type="button"
                  onClick={() => removeTimeSlot(index)}
                  className="text-red-500 hover:text-red-700"
                >
                  Remove
                </button>
              </motion.div>
            ))}
          </div>
          <button
            type="button"
            onClick={addTimeSlot}
            className="mt-4 text-blue-500 hover:text-blue-700"
          >
            Add Time Slot
          </button>
        </div>

        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <Controller
              name="rotateRoles"
              control={control}
              render={({ field }) => (
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={field.value}
                    onChange={field.onChange}
                  />
                  Rotate Roles
                </label>
              )}
            />

            <Controller
              name="autoAssign"
              control={control}
              render={({ field }) => (
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={field.value}
                    onChange={field.onChange}
                  />
                  Auto-assign Members
                </label>
              )}
            />
          </div>

          <div className="flex items-center gap-4">
            <Controller
              name="allowSwaps"
              control={control}
              render={({ field }) => (
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={field.value}
                    onChange={field.onChange}
                  />
                  Allow Shift Swaps
                </label>
              )}
            />

            <Controller
              name="requireApproval"
              control={control}
              render={({ field }) => (
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={field.value}
                    onChange={field.onChange}
                  />
                  Require Approval
                </label>
              )}
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            Notify Members in Advance (hours)
          </label>
          <Controller
            name="notifyInAdvance"
            control={control}
            rules={{ required: true, min: 1 }}
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

        <div className="flex justify-end gap-4">
          <button
            type="submit"
            disabled={createTemplateMutation.isLoading}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-blue-300"
          >
            {createTemplateMutation.isLoading ? 'Creating...' : 'Create Template'}
          </button>
        </div>
      </form>
    </motion.div>
  );
};

export default RecurringScheduleTemplate;
