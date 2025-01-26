import { ScheduleType } from "./ScheduleType";

// Eigenschaften einer Question die verarbeitet werden

export default interface IReflectionQuestion {
    questionId: number;
    userId: number;
    questionText: string;
    scheduleType: ScheduleType;
    scheduleValue: string;
}