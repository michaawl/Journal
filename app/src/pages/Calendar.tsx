import React from 'react';
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import { useNavigate } from 'react-router-dom';

export const Calendar: React.FC = () => {

  const navigate = useNavigate();

  const handleDateClick = (arg: { dateStr: string }) => {
    navigate(`/journalEntry?date=${arg.dateStr}`);
  };

  return (
    <div>
      <FullCalendar
       plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]} 
       initialView="dayGridMonth" 
       dateClick={handleDateClick}
       />
    </div>
  );
}

