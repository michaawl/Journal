import React, { useEffect, useState } from 'react';
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import { useNavigate } from 'react-router-dom';
import JournalService from '../services/journal-service';

interface CalendarEvent {
  displayTitle: string;
  actualTitle: string;
  entryId: number;
  content: string;
  date: string;
  allDay: boolean;
}

export const Calendar: React.FC = () => {
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const navigate = useNavigate();
  const journalService = new JournalService();

  //const handleDateClick = (arg: { dateStr: string }) => {
  //  navigate(`/journalEntry?date=${arg.dateStr}`);
  //};

  const handleDateClick = (arg: { dateStr: string }) => {

    console.log("Clicked Date:", arg.dateStr);

    const selectedEvent = events.find((event) => {
      const eventDate = event.date.split(' ')[0]; // Strips the time part
      console.log("Comparing:", eventDate, "with", arg.dateStr);
      return eventDate === arg.dateStr;
    });

    if (selectedEvent) {
      // Navigate with the event details
      navigate(
        `/journalEntry?date=${arg.dateStr}&title=${encodeURIComponent(selectedEvent.actualTitle)}&content=${encodeURIComponent(selectedEvent.content)}&id=${selectedEvent.entryId}`
      );
    } else {
      // If no event, just navigate to the date
      navigate(`/journalEntry?date=${arg.dateStr}`);
    }
  };

  const fetchJournalEntries = async (userId: number) => {
    try {
      const response = await journalService.getJournalEntries(userId);
    
      const journalEntries = response.entriesList || [];

      const formattedEvents = journalEntries.map((entry: any) => ({
        displayTitle: "Journal Entry", 
        actualTitle: entry.entryTitle,
        entryId: entry.entryId,
        content: entry.entryContent,
        date: entry.entryDate.split('T')[0],
        allDay: true, //füranzeige
      }));

      setEvents(formattedEvents);
    } catch (error) {
      console.error('Error fetching journal entries:', error);
    }
  };
  
    useEffect(() => {
      const userId = 1; // HARDCODED!!
      fetchJournalEntries(userId);
    }, []);

  return (
    <div>
      <FullCalendar
       plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]} 
       initialView="dayGridMonth" 
       dateClick={handleDateClick}
       events={events.map(event => ({
        title: event.displayTitle,
        date: event.date,
        allDay: event.allDay,
      }))}
       eventDisplay='list-item'
       />cd
    </div>
  );
}

