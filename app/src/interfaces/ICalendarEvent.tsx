export default interface CalendarEvent {
    displayTitle: string;
    actualTitle: string;
    entryId?: number;
    content?: string;
    date: string;
    allDay: boolean;
  }