import React, { useEffect, useState } from 'react';
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import { useNavigate } from 'react-router-dom';
import JournalService from '../services/journal-service';
import ReflectionService from '../services/reflection-service';
import ICalendarEvent from '../interfaces/ICalendarEvent';

export const Calendar: React.FC = () => {
  const [events, setEvents] = useState<ICalendarEvent[]>([]);
  const navigate = useNavigate();
  const journalService = new JournalService();
  const reflectionService = new ReflectionService();

  const handleDateClick = (arg: { dateStr: string }) => {
    console.log("Clicked Date:", arg.dateStr);

    const selectedEvent = events.find((event) => {
      const eventDate = event.date.split(' ')[0]; // Strips the time part
      console.log("Comparing:", eventDate, "with", arg.dateStr);
      return eventDate === arg.dateStr && event.actualTitle !== "Q";
    });

    if (selectedEvent) {
      navigate(
        `/journalEntry?date=${arg.dateStr}&title=${encodeURIComponent(selectedEvent.actualTitle)}&content=${encodeURIComponent(selectedEvent.content || '')}&id=${selectedEvent.entryId || ''}`
      );
    } else {
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
        allDay: true,
      }));

      return formattedEvents;
    } catch (error) {
      console.error('Error fetching journal entries:', error);
      return [];
    }
  };

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

  const loadEventsForVisibleDates = async (startDate: string, endDate: string) => {
    const userId = 1; // HARDCODED!!

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

      setEvents([...journalEvents, ...reflectionEvents]);
    } catch (error) {
      console.error("Error loading events for visible dates:", error);
    }
  };

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
