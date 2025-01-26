import { ScheduleType } from "./ScheduleType";

export default interface IReflectionQuestion {
    questionId: number;
    userId: number;
    questionText: string;
    scheduleType: ScheduleType;
    scheduleValue: string;
}