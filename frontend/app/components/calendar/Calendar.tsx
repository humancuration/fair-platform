import type { FC } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import listPlugin from '@fullcalendar/list';
import type { EventClickArg, EventChangeArg, DateClickArg } from '@fullcalendar/core';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import { FaCalendarPlus, FaSync, FaFilter } from 'react-icons/fa';
import { useNavigation } from "@remix-run/react";

import type { Event } from '~/types/calendar';
import { EventModal } from './EventModal';
import { EventDetailsDrawer } from './EventDetailsDrawer';

interface CalendarProps {
  groupId: string;
  isEditable?: boolean;
}

export const Calendar: FC<CalendarProps> = ({ groupId, isEditable = true }) => {
  const queryClient = useQueryClient();
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const { data: events = [], isLoading } = useQuery<Event[]>({
    queryKey: ['events', groupId],
    queryFn: async () => {
      const response = await fetch(`/api/groups/${groupId}/events`);
      if (!response.ok) throw new Error('Failed to fetch events');
      return response.json();
    }
  });

  const createEventMutation = useMutation({
    mutationFn: async (newEvent: Partial<Event>) => {
      const response = await fetch(`/api/groups/${groupId}/events`, {
        method: 'POST',
        body: JSON.stringify(newEvent),
        headers: { 'Content-Type': 'application/json' },
      });
      if (!response.ok) throw new Error('Failed to create event');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['events', groupId] });
      setIsModalOpen(false);
    },
  });

  const updateEventMutation = useMutation({
    mutationFn: async (updatedEvent: Partial<Event>) => {
      const response = await fetch(`/api/events/${updatedEvent._id}`, {
        method: 'PUT',
        body: JSON.stringify(updatedEvent),
        headers: { 'Content-Type': 'application/json' },
      });
      if (!response.ok) throw new Error('Failed to update event');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['events', groupId] });
    },
  });

  const deleteEventMutation = useMutation({
    mutationFn: async (eventId: string) => {
      const response = await fetch(`/api/events/${eventId}`, {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error('Failed to delete event');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['events', groupId] });
      setIsDrawerOpen(false);
    },
  });

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

  const navigation = useNavigation();
  const isLoading = navigation.state === "loading";

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-4"
    >
      {/* Toolbar */}
      <div className="flex justify-between items-center">
        <div className="flex gap-2">
          {isEditable && (
            <button
              onClick={() => setIsModalOpen(true)}
              className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition"
            >
              <FaCalendarPlus className="h-4 w-4" />
              <span>Add Event</span>
            </button>
          )}
          <button
            onClick={() => queryClient.invalidateQueries({ queryKey: ['events', groupId] })}
            className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition"
          >
            <FaSync className="h-4 w-4" />
            <span>Refresh</span>
          </button>
        </div>
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500" />
        </div>
      )}

      {/* Calendar */}
      <div className="bg-white rounded-lg shadow-lg p-4">
        <FullCalendar
          plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin, listPlugin]}
          initialView="dayGridMonth"
          headerToolbar={{
            left: 'prev,next today',
            center: 'title',
            right: 'dayGridMonth,timeGridWeek,timeGridDay,listWeek'
          }}
          events={events.map(event => ({
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
          }))}
          editable={isEditable}
          selectable={isEditable}
          selectMirror
          dayMaxEvents
          weekends
          eventClick={handleEventClick}
          dateClick={handleDateClick}
          eventDrop={handleEventDrop}
          height="auto"
        />
      </div>

      {/* Modals */}
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
            isSubmitting={createEventMutation.isPending || updateEventMutation.isPending}
          />
        )}

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
