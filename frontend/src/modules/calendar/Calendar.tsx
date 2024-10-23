import React, { useEffect, useState, useCallback, useMemo } from 'react';
import FullCalendar, { EventInput, EventClickArg, EventChangeArg } from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin, { DateClickArg } from '@fullcalendar/interaction';
import listPlugin from '@fullcalendar/list';
import { motion, AnimatePresence } from 'framer-motion';
import { useSocket } from '../../hooks/useSocket';
import { useToast } from '../../hooks/useToast';
import { useTheme } from '../../hooks/useTheme';
import EventModal from './EventModal';
import EventDetailsDrawer from './EventDetailsDrawer';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import api from '../../api/api';
import { FaCalendarPlus, FaSync, FaFilter } from 'react-icons/fa';

interface CalendarProps {
  groupId: string;
  isEditable?: boolean;
}

interface Event {
  _id: string;
  title: string;
  description: string;
  start: string;
  end?: string;
  location: string;
  color?: string;
  category?: string;
  isRecurring?: boolean;
  recurringPattern?: string;
  attendees?: string[];
  createdBy: {
    username: string;
    avatar?: string;
  };
  reminders?: {
    type: 'email' | 'notification';
    time: number; // minutes before event
  }[];
}

const CalendarComponent: React.FC<CalendarProps> = ({ groupId, isEditable = true }) => {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [view, setView] = useState('dayGridMonth');
  const [filters, setFilters] = useState<{ categories: string[]; attendees: string[] }>({
    categories: [],
    attendees: [],
  });

  const socket = useSocket('http://your-socket-server-url');
  const toast = useToast();
  const { theme } = useTheme();
  const queryClient = useQueryClient();

  // Fetch events
  const { data: events = [], isLoading } = useQuery<Event[]>(
    ['events', groupId],
    () => api.get(`/events/group/${groupId}`).then(res => res.data),
    {
      refetchInterval: 300000, // Refetch every 5 minutes
    }
  );

  // Create event mutation
  const createEventMutation = useMutation(
    (newEvent: Partial<Event>) => api.post(`/events/group/${groupId}`, newEvent),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['events', groupId]);
        toast.success('Event created successfully');
        setIsModalOpen(false);
      },
      onError: () => {
        toast.error('Failed to create event');
      },
    }
  );

  // Update event mutation
  const updateEventMutation = useMutation(
    (updatedEvent: Partial<Event>) => 
      api.put(`/events/${updatedEvent._id}`, updatedEvent),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['events', groupId]);
        toast.success('Event updated successfully');
      },
      onError: () => {
        toast.error('Failed to update event');
      },
    }
  );

  // Delete event mutation
  const deleteEventMutation = useMutation(
    (eventId: string) => api.delete(`/events/${eventId}`),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['events', groupId]);
        toast.success('Event deleted successfully');
        setIsDrawerOpen(false);
      },
      onError: () => {
        toast.error('Failed to delete event');
      },
    }
  );

  // Filter events based on current filters
  const filteredEvents = useMemo(() => {
    return events.filter(event => {
      const categoryMatch = filters.categories.length === 0 || 
        (event.category && filters.categories.includes(event.category));
      const attendeeMatch = filters.attendees.length === 0 ||
        (event.attendees && event.attendees.some(a => filters.attendees.includes(a)));
      return categoryMatch && attendeeMatch;
    });
  }, [events, filters]);

  // Socket event handlers
  useEffect(() => {
    if (!socket) return;

    const handleEventUpdate = (event: Event) => {
      queryClient.invalidateQueries(['events', groupId]);
      toast.info('Calendar has been updated');
    };

    socket.on('eventCreated', handleEventUpdate);
    socket.on('eventUpdated', handleEventUpdate);
    socket.on('eventDeleted', handleEventUpdate);

    return () => {
      socket.off('eventCreated', handleEventUpdate);
      socket.off('eventUpdated', handleEventUpdate);
      socket.off('eventDeleted', handleEventUpdate);
    };
  }, [socket, groupId, queryClient, toast]);

  const handleDateClick = (arg: DateClickArg) => {
    if (!isEditable) return;
    setSelectedDate(arg.date);
    setIsModalOpen(true);
  };

  const handleEventClick = (clickInfo: EventClickArg) => {
    const event = events.find(e => e._id === clickInfo.event.id);
    if (event) {
      setSelectedEvent(event);
      setIsDrawerOpen(true);
    }
  };

  const handleEventDrop = (eventChangeInfo: EventChangeArg) => {
    if (!isEditable) return;
    
    const event = events.find(e => e._id === eventChangeInfo.event.id);
    if (event) {
      updateEventMutation.mutate({
        ...event,
        start: eventChangeInfo.event.start?.toISOString(),
        end: eventChangeInfo.event.end?.toISOString(),
      });
    }
  };

  const calendarOptions = {
    plugins: [dayGridPlugin, timeGridPlugin, interactionPlugin, listPlugin],
    initialView: view,
    headerToolbar: {
      left: 'prev,next today',
      center: 'title',
      right: 'dayGridMonth,timeGridWeek,timeGridDay,listWeek',
    },
    events: filteredEvents.map(event => ({
      id: event._id,
      title: event.title,
      start: event.start,
      end: event.end,
      color: event.color,
      extendedProps: {
        description: event.description,
        location: event.location,
        category: event.category,
        createdBy: event.createdBy,
      },
    })),
    editable: isEditable,
    selectable: isEditable,
    selectMirror: true,
    dayMaxEvents: true,
    weekends: true,
    eventClick: handleEventClick,
    dateClick: handleDateClick,
    eventDrop: handleEventDrop,
    eventTimeFormat: {
      hour: '2-digit',
      minute: '2-digit',
      meridiem: false,
    },
    slotMinTime: '06:00:00',
    slotMaxTime: '22:00:00',
    nowIndicator: true,
    height: 'auto',
    themeSystem: theme === 'dark' ? 'darkly' : 'standard',
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-4"
    >
      {/* Toolbar */}
      <div className="flex justify-between items-center mb-4">
        <div className="flex gap-2">
          {isEditable && (
            <button
              onClick={() => setIsModalOpen(true)}
              className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              <FaCalendarPlus />
              Add Event
            </button>
          )}
          <button
            onClick={() => queryClient.invalidateQueries(['events', groupId])}
            className="flex items-center gap-2 px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
          >
            <FaSync />
            Refresh
          </button>
        </div>

        <button
          onClick={() => setIsDrawerOpen(true)}
          className="flex items-center gap-2 px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
        >
          <FaFilter />
          Filters
        </button>
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>
      )}

      {/* Calendar */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4">
        <FullCalendar {...calendarOptions} />
      </div>

      {/* Event Creation/Edit Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <EventModal
            initialDate={selectedDate}
            event={selectedEvent}
            onClose={() => {
              setIsModalOpen(false);
              setSelectedEvent(null);
              setSelectedDate(null);
            }}
            onSubmit={(eventData) => {
              if (selectedEvent) {
                updateEventMutation.mutate({ ...selectedEvent, ...eventData });
              } else {
                createEventMutation.mutate(eventData);
              }
            }}
            isSubmitting={createEventMutation.isLoading || updateEventMutation.isLoading}
          />
        )}
      </AnimatePresence>

      {/* Event Details Drawer */}
      <AnimatePresence>
        {isDrawerOpen && selectedEvent && (
          <EventDetailsDrawer
            event={selectedEvent}
            onClose={() => {
              setIsDrawerOpen(false);
              setSelectedEvent(null);
            }}
            onEdit={() => {
              setIsDrawerOpen(false);
              setIsModalOpen(true);
            }}
            onDelete={() => {
              if (window.confirm('Are you sure you want to delete this event?')) {
                deleteEventMutation.mutate(selectedEvent._id);
              }
            }}
            isEditable={isEditable}
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default CalendarComponent;
