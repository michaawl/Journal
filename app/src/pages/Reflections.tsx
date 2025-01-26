import React, { useState, useEffect } from 'react';
import ReflectionService from '../services/reflection-service';
import IReflectionQuestion from '../interfaces/IReflectionQuestion';
import { ScheduleType } from '../interfaces/ScheduleType';

// Component die die jeweils täglichen Refklektionsfragen bearbeitet
export const Reflections: React.FC = () => {

  //states und services
  const [questions, setQuestions] = useState<IReflectionQuestion[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [postMessage, setPostMessage] = useState<string | null>(null);

  const reflectionService = new ReflectionService();


  // fetched alle reflections fragen und filtert + mapped alle für den heutigen Tag
  const fetchReflectionQuestions = async () => {
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
    }
  };

  // liefert alle Fragen die für den heutigen Tag vorhergesehen sind
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

  // Filtert alle fragen die noch beantwortet werden müssen
  const filterQuestionsWithAnswers = async (questions: IReflectionQuestion[]) => {
    const todayDateString = getTodayDateString();
    const filteredQuestions: IReflectionQuestion[] = [];

    for (const question of questions) {
      try {
        const answer = await reflectionService.getReflectionAnswerByQuestionId(question.questionId);

       
        if (answer?.answerDate && answer.answerDate.startsWith(todayDateString)) {
          continue;  // wenn frage bereits beantwortet wurde -> überspringen
        }

        filteredQuestions.push(question);
      } catch {
        filteredQuestions.push(question);
      }
    }

    return filteredQuestions;
  };


  // sendet Antwort der Frage an gGRPC server
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

      setAnswers({});
      fetchReflectionQuestions();
      setPostMessage(`Answer posted successfully.`);
    } catch (err: any) {
      setPostMessage(`Error posting answer: ${err.message}`);
    }
  };

    // Antwort speichern
    const handleAnswerChange = (questionId: number, value: string) => {
      setAnswers((prev) => ({
        ...prev,
        [questionId]: value,
      }));
    };
  
  useEffect(() => {
    fetchReflectionQuestions();
  }, []);

    //custom date string, wie das Datum in der Datenbank gespeichert wird
    const getTodayDateString = () => {
      const today = new Date();
      return today.toLocaleDateString('en-CA');
    };

  return (
    <div className="container py-4 bg-dark text-light">
      <h2 className="mb-4 text-center fw-bold fs-5">Today's Reflection Questions</h2>


      {error && <p className="text-danger">{error}</p>}

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
        <p className="text-muted">No questions to answer left.</p>
      )}

      {postMessage && <p className="text-success mt-3">{postMessage}</p>}
    </div>
  );
};
