import React, { useEffect, useState } from 'react';
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import { useNavigate } from 'react-router-dom';
import JournalService from '../services/journal-service';
import ReflectionService from '../services/reflection-service';
import ICalendarEvent from '../interfaces/ICalendarEvent';

export const Calendar: React.FC = () => {

  // States und Services
  const [events, setEvents] = useState<ICalendarEvent[]>([]);
  const navigate = useNavigate(); //wird verwendet um in andere Component zu navigieren und parameter mitzugeben
  const journalService = new JournalService();
  const reflectionService = new ReflectionService();

    // wird bei den Click auf ein Datum aufgerufen
    const handleDateClick = (arg: { dateStr: string }) => {

      const selectedEvent = events.find((event) => {
        const eventDate = event.date.split(' ')[0]; // Strips the time part
        return eventDate === arg.dateStr && event.actualTitle !== "Q"; //übergibt den Journal Eintrag des jeweiligen Tages
      });
  
      if (selectedEvent) {
        navigate(
          `/journalEntry?date=${arg.dateStr}&title=${encodeURIComponent(selectedEvent.actualTitle)}&content=${encodeURIComponent(selectedEvent.content || '')}&id=${selectedEvent.entryId || ''}`
        );
      } else {
        navigate(`/journalEntry?date=${arg.dateStr}`);
      }
    };

  // Lädt alle Journal Enträge des jewiligen Users
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
        allDay: true,
      }));

      return formattedEvents;
    } catch (error) {
      console.error('Error fetching journal entries:', error);
      return [];
    }
  };

  // Fetched Reflection answer, um diese als ICalender Event in Preview anzuzeigen
  const fetchReflectionAnswersByDates = async (dates: string[]) => {
    const reflectionEvents: ICalendarEvent[] = [];
    for (const date of dates) {
      try {
        const response = await reflectionService.getReflectionAnswersByDate(date);

        if (response.length > 0) {
          reflectionEvents.push({
            displayTitle: "Q",
            actualTitle: "Q",
            date: date,
            allDay: true,
          });
        }
      } catch (error) {
        console.error(`Error fetching reflection answers for date ${date}:`, error);
      }
    }
    return reflectionEvents;
  };

  /* 
  wird die Calender Component aufgerufen wird diese Methode aufgerufen und geht alle
  Tage der jeweiligen Ansicht durch, dabei wird geschaut ob die jeweiligen Tage einen
  Eintrag haben bzw. ob an dem jeweiligen Tag eine Frage beantwortet wurde. Falls ja
  werden diese in der Preview angezeigt
  */

  const loadEventsForVisibleDates = async (startDate: string, endDate: string) => {
    const userId = 1; // HARDCODED!! Da App momentan nur für single benutzer gemacht wurde

    try {
      const journalEvents = await fetchJournalEntries(userId);

      const dates = [];
      let currentDate = new Date(startDate);
      const end = new Date(endDate);

      while (currentDate <= end) {
        dates.push(currentDate.toISOString().split('T')[0]); // Format YYYY-MM-DD
        currentDate.setDate(currentDate.getDate() + 1);
      }

      const reflectionEvents = await fetchReflectionAnswersByDates(dates);

      setEvents([...journalEvents, ...reflectionEvents]); // aktualisiert den event state, indem durch Spread Operator [...] die beiden Arrays zusammengefügt werden
    } catch (error) {
      console.error("Error loading events for visible dates:", error);
    }
  };

  // Component

  return (
    <div>
      <FullCalendar
        plugins={[dayGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        dateClick={handleDateClick}
        events={events.map((event) => ({
          title: event.displayTitle,
          date: event.date,
          allDay: event.allDay,
          color: event.displayTitle === "Q" ? "#FFA500" : undefined,
        }))}
        eventDisplay="list-item" 
        datesSet={(arg) => {
          const startDate = arg.startStr; 
          const endDate = arg.endStr;
          loadEventsForVisibleDates(startDate, endDate);
        }}
      />
    </div>
  );
};
