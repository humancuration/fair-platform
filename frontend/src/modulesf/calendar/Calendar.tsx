import React, { useEffect, useState } from 'react';
import FullCalendar, { EventInput, DateSelectArg, EventApi } from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin, { DateClickArg } from '@fullcalendar/interaction';
import api from '@/utils/api';
import { useSocket } from '../contexts/SocketContext';

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
  const socket = useSocket();

  useEffect(() => {
    const fetchEvents = async () => {
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
      }
    };

    fetchEvents();
  }, [groupId]);

  useEffect(() => {
    if (!socket) return;

    socket.emit('joinGroup', groupId);

    socket.on('eventCreated', (event: Event) => {
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
    });

    socket.on('eventUpdated', (event: Event) => {
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
    });

    socket.on('eventDeleted', ({ eventId }: { eventId: string }) => {
      setEvents((prevEvents) => prevEvents.filter((e) => e.id !== eventId));
    });

    return () => {
      socket.emit('leaveGroup', groupId);
      socket.off('eventCreated');
      socket.off('eventUpdated');
      socket.off('eventDeleted');
    };
  }, [socket, groupId]);

  const handleDateClick = (arg: DateClickArg) => {
    alert(`Date clicked: ${arg.dateStr}`);
  };

  const handleEventClick = (clickInfo: any) => {
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