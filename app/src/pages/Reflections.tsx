import React, { useState, useEffect } from 'react';
import ReflectionService from '../services/reflection-service';
import IReflectionQuestion from '../interfaces/IReflectionQuestion';
import { ScheduleType } from '../interfaces/ScheduleType';


export const Reflections: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [questions, setQuestions] = useState<IReflectionQuestion[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [postMessage, setPostMessage] = useState<string | null>(null);

  const reflectionService = new ReflectionService();

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

      const todaysQuestions = getTodaysQuestions(mappedQuestions);
      const filteredQuestions = await filterQuestionsWithAnswers(todaysQuestions);

      setQuestions(filteredQuestions);
    } catch (err: any) {
      setError(err.message);
      console.error('Error fetching reflection questions:', err);
    } finally {
      setLoading(false);
    }
  };

  const getTodayDateString = () => {
    const today = new Date();
    return today.toLocaleDateString('en-CA');
  };

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

  const filterQuestionsWithAnswers = async (questions: IReflectionQuestion[]) => {
    const todayDateString = getTodayDateString();
    const filteredQuestions: IReflectionQuestion[] = [];

    for (const question of questions) {
      try {
        const answer = await reflectionService.getReflectionAnswerByQuestionId(question.questionId);

        if (answer?.answerDate && answer.answerDate.startsWith(todayDateString)) {
          continue;
        }

        filteredQuestions.push(question);
      } catch {
        filteredQuestions.push(question);
      }
    }

    return filteredQuestions;
  };

  const handleAnswerChange = (questionId: number, value: string) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: value,
    }));
  };

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
        1,
        answerContent,
        new Date().toISOString(),
        true
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
    <div className="container py-4 bg-dark text-light">
      <h2 className="mb-4 text-center fw-bold fs-5">Today's Reflection Questions</h2>


      {error && <p className="text-danger">{error}</p>}
      {loading && <p className="text-info">Loading...</p>}

      {questions.length > 0 ? (
        <section className="p-4 bg-dark-subtle rounded border border-secondary">
          {questions.map((question) => (
            <div key={question.questionId} className="mb-4">
              <h5 className="fw-bold mb-3">{question.questionText}</h5> {/* Added mb-3 */}
              <textarea
                className="form-control bg-secondary-subtle text-light border-secondary mb-3"
                placeholder="Write your answer here..."
                value={answers[question.questionId] || ''}
                onChange={(e) => handleAnswerChange(question.questionId, e.target.value)}
              />
              <button
                onClick={() => postAnswer(question.questionId)}
                className="btn btn-primary"
              >
                Submit Answer
              </button>
            </div>
          ))}
        </section>
      ) : (
        <p className="text-muted">No questions scheduled for today.</p>
      )}

      {postMessage && <p className="text-success mt-3">{postMessage}</p>}
    </div>
  );
};
