// Gibt die einstellungen für ein jeweiligen CalenderEvent an, wie im der Calender Component verwendet werden

export default interface CalendarEvent {
    displayTitle: string;
    actualTitle: string;
    entryId?: number;
    content?: string;
    date: string;
    allDay: boolean;
  }