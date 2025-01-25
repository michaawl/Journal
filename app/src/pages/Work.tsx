import React, { useEffect, useState } from 'react';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import ReflectionService from '../services/reflection-service'; // Import the ReflectionService

// Enum for schedule types
enum ScheduleType {
    Yearly = 'Yearly',
    Monthly = 'Monthly',
    Weekly = 'Weekly',
    Daily = 'Daily',
}

// Interface for a Reflection Question
interface IReflectionQuestion {
    questionId: number;
    userId: number;
    questionText: string;
    scheduleType: ScheduleType;
    scheduleValue: string;
}

export const Work: React.FC = () => {
    const [questions, setQuestions] = useState<IReflectionQuestion[]>([]);
    const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());
    const [questionText, setQuestionText] = useState('');
    const [scheduleType, setScheduleType] = useState<ScheduleType>(ScheduleType.Daily);
    const [scheduleValue, setScheduleValue] = useState<Date | null>(new Date());

    const reflectionService = new ReflectionService(); // Create an instance of ReflectionService

    // Fetch reflection questions on component mount
    useEffect(() => {
        const fetchQuestions = async () => {
            try {
                const response = await reflectionService.getReflectionQuestions(1);
        
                // Access questionsList from the response
                const questions = response.questionsList ?? [];
                console.log('Fetched Questions:', questions);
        
                // Map the questions to the state
                const mappedQuestions = questions.map((q: any) => ({
                    questionId: q.questionId,
                    userId: q.userId,
                    questionText: q.questionText,
                    scheduleType: q.scheduleType as ScheduleType,
                    scheduleValue: q.scheduleValue,
                }));
        
                setQuestions(mappedQuestions);
            } catch (error) {
                console.error('Failed to fetch reflection questions:', error);
            }
        };
        
        
        fetchQuestions();
    }, []);

    // Handle adding a new reflection question
    const handleAddQuestion = async () => {
        if (questionText.trim() && selectedDate) {
            try {
                // Call the backend service to save the reflection question
                await reflectionService.postReflectionQuestion(
                    1, // Replace with dynamic user ID if needed
                    questionText.trim(),
                    scheduleType,
                    scheduleValue?.toLocaleDateString() || ''
                );

                // Update the local state with the new question
                const newQuestion: IReflectionQuestion = {
                    questionId: questions.length + 1,
                    userId: 1,
                    questionText: questionText.trim(),
                    scheduleType,
                    scheduleValue: scheduleValue?.toLocaleDateString() || '',
                };

                setQuestions((prevQuestions) => [...prevQuestions, newQuestion]);
                setQuestionText('');
                setSelectedDate(new Date());
                setScheduleType(ScheduleType.Daily);
                setScheduleValue(new Date());
            } catch (error) {
                console.error('Failed to add reflection question:', error);
            }
        }
    };

    return (
        <div>
            <h2>Reflection Questions</h2>
            <ul>
                {questions.map((question) => (
                    <li key={question.questionId}>
                        {question.questionText} ({question.scheduleType} - {question.scheduleValue})
                    </li>
                ))}
            </ul>

            <h3>Add a New Reflection Question</h3>
            <div style={{ marginBottom: "1rem" }}>
                <label>
                    Reflection Question:
                    <input
                        type="text"
                        value={questionText}
                        onChange={(e) => setQuestionText(e.target.value)}
                        style={{ marginLeft: "0.5rem" }}
                    />
                </label>
            </div>

            <div style={{ marginBottom: "1rem" }}>
                <DatePicker
                    selected={selectedDate}
                    onChange={(date) => setSelectedDate(date)}
                    dateFormat="dd/MM/yyyy"
                />
            </div>

            <div style={{ marginBottom: "1rem" }}>
                <label>
                    Schedule Type:
                    <select
                        value={scheduleType}
                        onChange={(e) => setScheduleType(e.target.value as ScheduleType)}
                        style={{ marginLeft: "0.5rem" }}
                    >
                        {Object.values(ScheduleType).map((type) => (
                            <option key={type} value={type}>
                                {type}
                            </option>
                        ))}
                    </select>
                </label>
            </div>

            <div style={{ marginBottom: "1rem" }}>
                <label>
                    Schedule Date:
                    <DatePicker
                        selected={scheduleValue}
                        onChange={(date) => setScheduleValue(date)}
                        dateFormat="dd/MM/yyyy"
                    />
                </label>
            </div>

            <button
                onClick={handleAddQuestion}
                style={{
                    backgroundColor: 'yellow',
                    border: 'none',
                    padding: '10px 20px',
                    cursor: 'pointer',
                    fontSize: '16px',
                }}
            >
                Add Reflection Question
            </button>
        </div>
    );
};
