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
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [postMessage, setPostMessage] = useState<string | null>(null);

  const reflectionService = new ReflectionService();

  // Fetch reflection questions and filter based on today's schedule and answers
  const fetchReflectionQuestions = async () => {
    setLoading(true);
    setError(null);
  
    try {
      const response = await reflectionService.getReflectionQuestions(1);
      const questions = response.questionsList || [];
  
      const mappedQuestions = questions.map((q: any) => ({
        questionId: q.questionId,
        userId: q.userId,
        questionText: q.questionText,
        scheduleType: q.scheduleType as ScheduleType,
        scheduleValue: q.scheduleValue,
      }));
  
      // Filter questions for today's schedule
      const todaysQuestions = getTodaysQuestions(mappedQuestions);
  
      // Filter out questions with answers for today
      const filteredQuestions = await filterQuestionsWithAnswers(todaysQuestions);
  
      setQuestions(filteredQuestions);
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
  const getTodaysQuestions = (questions: IReflectionQuestion[]) => {
    const today = new Date();
    return questions.filter((question) => {
      const scheduleDate = new Date(question.scheduleValue);

      if (scheduleDate > today) {
        return false;
      }

      if (question.scheduleType === ScheduleType.Daily) {
        return true;
      }

      if (question.scheduleType === ScheduleType.Weekly) {
        return today.getDay() === scheduleDate.getDay();
      }

      if (question.scheduleType === ScheduleType.Monthly) {
        return today.getDate() === scheduleDate.getDate();
      }

      if (question.scheduleType === ScheduleType.Yearly) {
        return (
          today.getMonth() === scheduleDate.getMonth() &&
          today.getDate() === scheduleDate.getDate()
        );
      }

      return false;
    });
  };

  // Filter out questions with answers for today
  const filterQuestionsWithAnswers = async (questions: IReflectionQuestion[]) => {
    const todayDateString = getTodayDateString(); // Get today's date in YYYY-MM-DD format
    const filteredQuestions: IReflectionQuestion[] = [];
    
    for (const question of questions) {
      console.log(`Processing question ID ${question.questionId} with text: "${question.questionText}"`);
      try {
        const answer = await reflectionService.getReflectionAnswerByQuestionId(question.questionId);
  
        // Log the raw answer object to verify its structure
        console.log(`Raw answer object for question ID ${question.questionId}:`, answer);
  
        if (answer) {
          console.log(
            `Answer retrieved for question ID ${question.questionId}: Answer ID ${answer.answerId}, Date: ${answer.answerDate}, Is Completed: ${answer.isCompleted}`
          );
  
          const hasAnswerToday = answer.answerDate && answer.answerDate.startsWith(todayDateString);
          if (hasAnswerToday) {
            console.log(
              `Answer for question ID ${question.questionId} matches today's date (${todayDateString}). Excluding this question.`
            );
          } else {
            console.log(
              `Answer for question ID ${question.questionId} does not match today's date. Including this question.`
            );
            filteredQuestions.push(question);
          }
        } else {
          console.log(`No answer found for question ID ${question.questionId}. Including this question.`);
          filteredQuestions.push(question);
        }
      } catch (err) {
        console.error(`Error retrieving answer for question ID ${question.questionId}:`, err);

        console.log(`Including question ID ${question.questionId} due to error.`);
        filteredQuestions.push(question);
      }
    }
  
    console.log(`Filtering complete. ${filteredQuestions.length} questions remain.`);
    return filteredQuestions;
  };
  
  
  
  // Handle input change for answers
  const handleAnswerChange = (questionId: number, value: string) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: value,
    }));
  };

  // Post answer to the server
  const postAnswer = async (questionId: number) => {
    const answerContent = answers[questionId];

    if (!answerContent) {
      setPostMessage('Please enter an answer before submitting.');
      return;
    }

    setPostMessage(null);

    try {
      const response = await reflectionService.postReflectionAnswer(
        questionId,
        1, // Example userId
        answerContent,
        new Date().toISOString(),
        true // Mark as completed
      );
      setPostMessage(`Answer posted successfully: ${response.message}`);
    } catch (err: any) {
      setPostMessage(`Error posting answer: ${err.message}`);
    }
  };

  useEffect(() => {
    fetchReflectionQuestions();
  }, []);

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
        {questions.length > 0 ? (
          questions.map((question) => (
            <div key={question.questionId} style={{ marginBottom: '1rem' }}>
              <h3>Question:</h3>
              <p>{question.questionText}</p>
              <p>
                <strong>Schedule Type:</strong> {question.scheduleType}
              </p>
              <p>
                <strong>Schedule Date:</strong> {question.scheduleValue}
              </p>
              <textarea
                placeholder="Write your answer here..."
                value={answers[question.questionId] || ''}
                onChange={(e) => handleAnswerChange(question.questionId, e.target.value)}
                style={{ width: '100%', padding: '8px', marginBottom: '8px' }}
              />
              <button
                onClick={() => postAnswer(question.questionId)}
                style={{
                  backgroundColor: 'blue',
                  color: 'white',
                  padding: '10px',
                  cursor: 'pointer',
                  border: 'none',
                }}
              >
                Submit Answer
              </button>
            </div>
          ))
        ) : (
          <p>No questions scheduled for today</p>
        )}
      </div>

      {postMessage && <p style={{ color: 'green' }}>{postMessage}</p>}
    </div>
  );
};
