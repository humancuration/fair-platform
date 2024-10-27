import type { FC } from 'react';
import { motion } from 'framer-motion';
import { Form, useNavigation, useSubmit } from '@remix-run/react';
import { useForm, Controller } from 'react-hook-form';
import DatePicker from 'react-datepicker';
import { FaClock, FaUsers, FaBell, FaCalendarAlt } from 'react-icons/fa';

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

interface RecurringScheduleTemplateProps {
  groupId: string;
  roles?: Array<{ id: string; name: string }>;
}

export const RecurringScheduleTemplate: FC<RecurringScheduleTemplateProps> = ({ 
  groupId,
  roles = [] 
}) => {
  const [timeSlots, setTimeSlots] = useState<ScheduleTemplate['timeSlots']>([]);
  const navigation = useNavigation();
  const submit = useSubmit();
  const isSubmitting = navigation.state === "submitting";

  const { control, handleSubmit, watch } = useForm<ScheduleTemplate>({
    defaultValues: {
      name: '',
      description: '',
      frequency: 'weekly',
      interval: 1,
      startDate: new Date(),
      rotateRoles: false,
      autoAssign: true,
      notifyInAdvance: 24,
      allowSwaps: true,
      requireApproval: true,
      timeSlots: [],
    }
  });

  const frequency = watch('frequency');

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

  return (
    <Form 
      method="post" 
      onSubmit={(e) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        formData.append('intent', 'createTemplate');
        formData.append('timeSlots', JSON.stringify(timeSlots));
        submit(formData, { method: 'post' });
      }}
      className="space-y-6"
    >
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="bg-white rounded-lg shadow-lg p-6"
      >
        <h2 className="text-2xl font-bold mb-6">Create Recurring Schedule Template</h2>

        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Controller
              name="name"
              control={control}
              rules={{ required: 'Template name is required' }}
              render={({ field, fieldState: { error } }) => (
                <div>
                  <label className="block text-sm font-medium mb-1">Template Name</label>
                  <input
                    {...field}
                    className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter template name"
                  />
                  {error && (
                    <p className="mt-1 text-sm text-red-500">{error.message}</p>
                  )}
                </div>
              )}
            />

            <Controller
              name="frequency"
              control={control}
              rules={{ required: true }}
              render={({ field }) => (
                <div>
                  <label className="block text-sm font-medium mb-1">Frequency</label>
                  <select {...field} className="w-full p-2 border rounded">
                    <option value="daily">Daily</option>
                    <option value="weekly">Weekly</option>
                    <option value="monthly">Monthly</option>
                  </select>
                </div>
              )}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Controller
              name="startDate"
              control={control}
              rules={{ required: true }}
              render={({ field }) => (
                <div>
                  <label className="block text-sm font-medium mb-1">Start Date</label>
                  <div className="flex items-center space-x-2">
                    <FaCalendarAlt className="text-gray-400" />
                    <DatePicker
                      selected={field.value}
                      onChange={field.onChange}
                      className="w-full p-2 border rounded"
                    />
                  </div>
                </div>
              )}
            />

            <Controller
              name="endDate"
              control={control}
              render={({ field }) => (
                <div>
                  <label className="block text-sm font-medium mb-1">End Date (Optional)</label>
                  <div className="flex items-center space-x-2">
                    <FaCalendarAlt className="text-gray-400" />
                    <DatePicker
                      selected={field.value}
                      onChange={field.onChange}
                      className="w-full p-2 border rounded"
                      minDate={watch('startDate')}
                    />
                  </div>
                </div>
              )}
            />
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

                  <div className="flex items-center gap-2">
                    <FaClock className="text-gray-400" />
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
                    <span>to</span>
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
                  </div>

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
                render={({ field: { value, onChange } }) => (
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={value}
                      onChange={(e) => onChange(e.target.checked)}
                      className="rounded border-gray-300"
                    />
                    <span>Rotate Roles</span>
                  </label>
                )}
              />

              <Controller
                name="autoAssign"
                control={control}
                render={({ field: { value, onChange } }) => (
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={value}
                      onChange={(e) => onChange(e.target.checked)}
                      className="rounded border-gray-300"
                    />
                    <span>Auto-assign Members</span>
                  </label>
                )}
              />
            </div>

            <div className="flex items-center gap-4">
              <Controller
                name="allowSwaps"
                control={control}
                render={({ field: { value, onChange } }) => (
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={value}
                      onChange={(e) => onChange(e.target.checked)}
                      className="rounded border-gray-300"
                    />
                    <span>Allow Shift Swaps</span>
                  </label>
                )}
              />

              <Controller
                name="requireApproval"
                control={control}
                render={({ field: { value, onChange } }) => (
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={value}
                      onChange={(e) => onChange(e.target.checked)}
                      className="rounded border-gray-300"
                    />
                    <span>Require Approval</span>
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
              disabled={isSubmitting}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-blue-300 transition"
            >
              {isSubmitting ? 'Creating...' : 'Create Template'}
            </button>
          </div>
        </div>
      </motion.div>
    </Form>
  );
};
