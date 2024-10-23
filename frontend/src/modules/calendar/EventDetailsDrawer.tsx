import React from 'react';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import { FaMapMarkerAlt, FaUser, FaClock, FaTag, FaEdit, FaTrash } from 'react-icons/fa';
import { Event } from './types';

interface EventDetailsDrawerProps {
  event: Event;
  onClose: () => void;
  onEdit: () => void;
  onDelete: () => void;
  isEditable: boolean;
}

const EventDetailsDrawer: React.FC<EventDetailsDrawerProps> = ({
  event,
  onClose,
  onEdit,
  onDelete,
  isEditable,
}) => {
  return (
    <motion.div
      initial={{ x: '100%' }}
      animate={{ x: 0 }}
      exit={{ x: '100%' }}
      className="fixed right-0 top-0 h-full w-96 bg-white dark:bg-gray-800 shadow-lg z-50"
    >
      <div className="p-6">
        <div className="flex justify-between items-start mb-6">
          <h2 className="text-2xl font-bold">{event.title}</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            ×
          </button>
        </div>

        <div className="space-y-4">
          <div className="flex items-center gap-2 text-gray-600">
            <FaClock />
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
              <FaMapMarkerAlt />
              <span>{event.location}</span>
            </div>
          )}

          {event.category && (
            <div className="flex items-center gap-2 text-gray-600">
              <FaTag />
              <span>{event.category}</span>
            </div>
          )}

          <div className="flex items-center gap-2 text-gray-600">
            <FaUser />
            <span>Created by {event.createdBy.username}</span>
          </div>

          {event.description && (
            <div className="mt-4">
              <h3 className="font-semibold mb-2">Description</h3>
              <p className="text-gray-600">{event.description}</p>
            </div>
          )}

          {event.attendees && event.attendees.length > 0 && (
            <div className="mt-4">
              <h3 className="font-semibold mb-2">Attendees</h3>
              <div className="flex flex-wrap gap-2">
                {event.attendees.map((attendee) => (
                  <span
                    key={attendee}
                    className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded"
                  >
                    {attendee}
                  </span>
                ))}
              </div>
            </div>
          )}

          {isEditable && (
            <div className="flex justify-end gap-4 mt-8">
              <button
                onClick={onEdit}
                className="flex items-center gap-2 px-4 py-2 text-blue-500 hover:text-blue-600"
              >
                <FaEdit />
                Edit
              </button>
              <button
                onClick={onDelete}
                className="flex items-center gap-2 px-4 py-2 text-red-500 hover:text-red-600"
              >
                <FaTrash />
                Delete
              </button>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default EventDetailsDrawer;
