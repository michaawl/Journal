import React, { useState, useEffect } from 'react';
import ReflectionService from '../services/reflection-service';

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

export const Statistics: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [questions, setQuestions] = useState<IReflectionQuestion[]>([]);
  const [error, setError] = useState<string | null>(null);

  const reflectionService = new ReflectionService();

  // Fetch reflection questions
  const fetchReflectionQuestions = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await reflectionService.getReflectionQuestions(1);

      // Access and log questionsList from the response
      const questions = response.questionsList || [];
      console.log('Fetched Reflection Questions:', questions);

      // Map questions to the local state
      const mappedQuestions = questions.map((q: any) => ({
        questionId: q.questionId,
        userId: q.userId,
        questionText: q.questionText,
        scheduleType: q.scheduleType as ScheduleType,
        scheduleValue: q.scheduleValue,
      }));

      setQuestions(mappedQuestions);
    } catch (err: any) {
      setError(err.message);
      console.error('Error fetching reflection questions:', err);
    } finally {
      setLoading(false);
    }
  };

  // Get today's date in the required format
  const getTodayDateString = () => {
    const today = new Date();
    return today.toLocaleDateString('en-CA'); // Format as YYYY-MM-DD
  };

// Filter questions to show only those for today
const getTodaysQuestions = () => {
  const today = new Date();
  const todayDateString = getTodayDateString();

  return questions.filter((question) => {
    // Parse the scheduleValue as a date
    const scheduleDate = new Date(question.scheduleValue);

    // Exclude questions with a scheduled date in the future
    if (scheduleDate > today) {
      return false;
    }

    if (question.scheduleType === ScheduleType.Daily) {
      return true; // Always show daily questions
    }

    if (question.scheduleType === ScheduleType.Weekly) {
      // Get the day of the week for today's date (0 = Sunday, 1 = Monday, ..., 6 = Saturday)
      const todayDay = today.getDay();
      const scheduleDay = scheduleDate.getDay();

      // Return true if today's day of the week matches the scheduled day of the week
      return todayDay === scheduleDay;
    }

    if (question.scheduleType === ScheduleType.Monthly) {
      // Check if today is the same day of the month as the scheduled date
      const todayDayOfMonth = today.getDate();
      const scheduleDayOfMonth = scheduleDate.getDate();

      return todayDayOfMonth === scheduleDayOfMonth;
    }

    if (question.scheduleType === ScheduleType.Yearly) {
      // Check if today matches the month and day of the scheduled date
      const todayMonth = today.getMonth();
      const todayDayOfMonth = today.getDate();

      const scheduleMonth = scheduleDate.getMonth();
      const scheduleDayOfMonth = scheduleDate.getDate();

      return todayMonth === scheduleMonth && todayDayOfMonth === scheduleDayOfMonth;
    }

    // Default: exclude questions that don't match any of the above types
    return false;
  });
};

  useEffect(() => {
    fetchReflectionQuestions();
  }, []);

  const todaysQuestions = getTodaysQuestions();

  return (
    <div>
      <button
        onClick={fetchReflectionQuestions}
        style={{
          backgroundColor: 'yellow',
          padding: '10px',
          fontSize: '16px',
          cursor: 'pointer',
          border: 'none',
        }}
      >
        Reload Questions
      </button>

      {error && <p style={{ color: 'red' }}>Error: {error}</p>}
      {loading && <p>Loading...</p>}

      <div>
        <h2>Today's Reflection Questions</h2>
        {todaysQuestions.length > 0 ? (
          todaysQuestions.map((question) => (
            <div key={question.questionId} style={{ marginBottom: '1rem' }}>
              <h3>Question:</h3>
              <p>{question.questionText}</p>
              <p>
                <strong>Schedule Type:</strong> {question.scheduleType}
              </p>
              <p>
                <strong>Schedule Date:</strong> {question.scheduleValue}
              </p>
            </div>
          ))
        ) : (
          <p>No questions scheduled for today</p>
        )}
      </div>
    </div>
  );
};
