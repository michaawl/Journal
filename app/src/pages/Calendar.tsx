import React from 'react';
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";

export const Calendar: React.FC = () => {
  return (
    <div>
      <FullCalendar
       plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]} 
       initialView="dayGridMonth" 
       />
    </div>
  );
}

