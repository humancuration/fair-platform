import type { FC } from 'react';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import { 
  FaTimes, 
  FaMapMarkerAlt, 
  FaUser, 
  FaClock, 
  FaTag, 
  FaEdit, 
  FaTrash,
  FaUsers,
  FaBell 
} from 'react-icons/fa';
import { Form } from '@remix-run/react';
import type { Event } from '~/types/calendar';

interface EventDetailsDrawerProps {
  event: Event;
  onClose: () => void;
  onEdit: () => void;
  isEditable: boolean;
}

export const EventDetailsDrawer: FC<EventDetailsDrawerProps> = ({
  event,
  onClose,
  onEdit,
  isEditable,
}) => {
  return (
    <motion.div
      initial={{ x: '100%' }}
      animate={{ x: 0 }}
      exit={{ x: '100%' }}
      transition={{ type: 'spring', damping: 25, stiffness: 200 }}
      className="fixed right-0 top-0 h-full w-full max-w-md bg-white shadow-lg z-50"
    >
      <div className="h-full overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-start mb-6">
            <h2 className="text-2xl font-bold">{event.title}</h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 transition"
              aria-label="Close"
            >
              <FaTimes className="h-5 w-5" />
            </button>
          </div>

          <div className="space-y-6">
            <div className="flex items-center gap-2 text-gray-600">
              <FaClock className="h-5 w-5" />
              <div>
                <div>{format(new Date(event.start), 'MMMM d, yyyy h:mm aa')}</div>
                {event.end && (
                  <div>
                    to {format(new Date(event.end), 'MMMM d, yyyy h:mm aa')}
                  </div>
                )}
              </div>
            </div>

            {event.location && (
              <div className="flex items-center gap-2 text-gray-600">
                <FaMapMarkerAlt className="h-5 w-5" />
                <span>{event.location}</span>
              </div>
            )}

            {event.category && (
              <div className="flex items-center gap-2 text-gray-600">
                <FaTag className="h-5 w-5" />
                <span>{event.category}</span>
              </div>
            )}

            <div className="flex items-center gap-2 text-gray-600">
              <FaUser className="h-5 w-5" />
              <div className="flex items-center gap-2">
                {event.createdBy.avatar && (
                  <img 
                    src={event.createdBy.avatar} 
                    alt={event.createdBy.username}
                    className="h-6 w-6 rounded-full"
                  />
                )}
                <span>Created by {event.createdBy.username}</span>
              </div>
            </div>

            {event.description && (
              <div className="mt-4">
                <h3 className="font-semibold mb-2">Description</h3>
                <p className="text-gray-600 whitespace-pre-wrap">{event.description}</p>
              </div>
            )}

            {event.attendees && event.attendees.length > 0 && (
              <div className="mt-4">
                <div className="flex items-center gap-2 mb-2">
                  <FaUsers className="h-5 w-5 text-gray-600" />
                  <h3 className="font-semibold">Attendees</h3>
                </div>
                <div className="flex flex-wrap gap-2">
                  {event.attendees.map((attendee) => (
                    <span
                      key={attendee}
                      className="px-3 py-1 bg-gray-100 rounded-full text-sm"
                    >
                      {attendee}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {event.reminders && event.reminders.length > 0 && (
              <div className="mt-4">
                <div className="flex items-center gap-2 mb-2">
                  <FaBell className="h-5 w-5 text-gray-600" />
                  <h3 className="font-semibold">Reminders</h3>
                </div>
                <div className="space-y-2">
                  {event.reminders.map((reminder, index) => (
                    <div key={index} className="flex items-center gap-2 text-sm text-gray-600">
                      <span>{reminder.type === 'email' ? '📧' : '🔔'}</span>
                      <span>{reminder.time} minutes before</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {isEditable && (
              <div className="flex justify-end gap-4 mt-8">
                <button
                  onClick={onEdit}
                  className="flex items-center gap-2 px-4 py-2 text-blue-500 hover:text-blue-600 transition"
                >
                  <FaEdit className="h-4 w-4" />
                  Edit
                </button>
                <Form method="post" className="inline">
                  <input type="hidden" name="intent" value="delete" />
                  <input type="hidden" name="eventId" value={event._id} />
                  <button
                    type="submit"
                    className="flex items-center gap-2 px-4 py-2 text-red-500 hover:text-red-600 transition"
                    onClick={(e) => {
                      if (!confirm('Are you sure you want to delete this event?')) {
                        e.preventDefault();
                      }
                    }}
                  >
                    <FaTrash className="h-4 w-4" />
                    Delete
                  </button>
                </Form>
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};
