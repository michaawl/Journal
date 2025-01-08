import React, { useEffect, useState } from 'react';
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import { useNavigate } from 'react-router-dom';
import JournalService from '../services/journal-service';

export const Calendar: React.FC = () => {
  const [events, setEvents] = useState([]);
  const navigate = useNavigate();
  const journalService = new JournalService();

  const handleDateClick = (arg: { dateStr: string }) => {
    navigate(`/journalEntry?date=${arg.dateStr}`);
  };

  const fetchJournalEntries = async (userId: number) => {
    try {
      const response = await journalService.getJournalEntries(userId);
    
      const journalEntries = response.entriesList || [];
      const formattedEvents = journalEntries.map((entry: any) => ({
        title: "Journal Entry",
        date: entry.entryDate,
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
       events={events}
       eventDisplay='list-item'
       />cd
    </div>
  );
}

