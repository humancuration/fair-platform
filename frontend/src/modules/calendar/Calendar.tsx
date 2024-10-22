import React, { useEffect, useState, useCallback } from 'react';
import FullCalendar, { EventInput, EventClickArg } from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin, { DateClickArg } from '@fullcalendar/interaction';
import api from '../../api/api';
import { useSocket } from '../../hooks/useSocket';
import { useToast } from '../../hooks/useToast';

interface CalendarProps {
  groupId: string;
}

interface Event {
  _id: string;
  title: string;
  description: string;
  date: string;
  location: string;
  createdBy: {
    username: string;
  };
}

const CalendarComponent: React.FC<CalendarProps> = ({ groupId }) => {
  const [events, setEvents] = useState<EventInput[]>([]);
  const socket = useSocket('http://your-socket-server-url');
  const toast = useToast();

  const fetchEvents = useCallback(async () => {
    try {
      const response = await api.get(`/events/group/${groupId}`);
      const calendarEvents = response.data.map((event: Event) => ({
        id: event._id,
        title: event.title,
        start: event.date,
        description: event.description,
        location: event.location,
      }));
      setEvents(calendarEvents);
    } catch (error) {
      console.error('Error fetching events:', error);
      toast.error('Failed to load events. Please try again.');
    }
  }, [groupId, toast]);

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  useEffect(() => {
    if (!socket) return;

    const handleEventCreated = (event: Event) => {
      setEvents((prevEvents) => [
        ...prevEvents,
        {
          id: event._id,
          title: event.title,
          start: event.date,
          description: event.description,
          location: event.location,
        },
      ]);
      toast.success('New event added to the calendar');
    };

    const handleEventUpdated = (event: Event) => {
      setEvents((prevEvents) =>
        prevEvents.map((e) =>
          e.id === event._id
            ? {
                id: event._id,
                title: event.title,
                start: event.date,
                description: event.description,
                location: event.location,
              }
            : e
        )
      );
      toast.info('An event has been updated');
    };

    const handleEventDeleted = ({ eventId }: { eventId: string }) => {
      setEvents((prevEvents) => prevEvents.filter((e) => e.id !== eventId));
      toast.info('An event has been removed from the calendar');
    };

    socket.on('eventCreated', handleEventCreated);
    socket.on('eventUpdated', handleEventUpdated);
    socket.on('eventDeleted', handleEventDeleted);

    return () => {
      socket.off('eventCreated', handleEventCreated);
      socket.off('eventUpdated', handleEventUpdated);
      socket.off('eventDeleted', handleEventDeleted);
    };
  }, [socket, toast]);

  const handleDateClick = (arg: DateClickArg) => {
    // Implement date click functionality
    console.log(`Date clicked: ${arg.dateStr}`);
    // You can open a modal or navigate to a new page to create an event
  };

  const handleEventClick = (clickInfo: EventClickArg) => {
    // Navigate to the event details page
    window.location.href = `/events/${clickInfo.event.id}`;
  };

  return (
    <div className="mt-4">
      <FullCalendar
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        headerToolbar={{
          left: 'prev,next today',
          center: 'title',
          right: 'dayGridMonth,timeGridWeek,timeGridDay',
        }}
        events={events}
        selectable={true}
        selectMirror={true}
        dayMaxEvents={true}
        eventClick={handleEventClick}
        dateClick={handleDateClick}
      />
    </div>
  );
};

export default CalendarComponent;
