import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import JournalService from '../services/journal-service';
import ReflectionService from '../services/reflection-service';

export const JournalEntry: React.FC = () => {
  const location = useLocation();
  const query = new URLSearchParams(location.search);

  const initialDate = query.get('date');
  const initialTitle = query.get('title') || '';
  const initialContent = query.get('content') || '';
  const initialId = query.get('id') ? Number(query.get('id')) : undefined;

  const [title, setTitle] = useState(initialTitle);
  const [entry, setEntry] = useState(initialContent);
  const [questionsAndAnswers, setQuestionsAndAnswers] = useState<any[]>([]);

  const journalService = new JournalService();
  const reflectionService = new ReflectionService();

  useEffect(() => {
    const fetchQuestionsAndAnswers = async () => {
      if (!initialDate) {
        console.warn('Initial date is null or undefined.');
        return;
      }

      try {
        const response = await reflectionService.getReflectionAnswersByDate(initialDate);
        const answersWithQuestions = Array.isArray(response)
          ? response
          : response.answersWithQuestionsList || [];
        setQuestionsAndAnswers(answersWithQuestions);
      } catch (error) {
        console.error(`Failed to fetch questions and answers for date ${initialDate}:`, error);
      }
    };

    fetchQuestionsAndAnswers();
  }, [initialDate]);

  const handleSave = async () => {
    if (!title.trim() || !entry.trim()) {
      alert('Title and entry cannot be empty.');
      return;
    }

    try {
      const userId = 1;
      const entryDate = initialDate || new Date().toISOString();

      await journalService.postJournalEntry(userId, title, entry, entryDate, initialId);

      alert('Journal entry saved successfully!');
    } catch (error) {
      console.error('Error saving journal entry:', error);
      alert('Failed to save the journal entry.');
    }
  };

  return (
    <div className="container py-4 bg-dark text-light">
      <h2 className="text-center mb-4 fw-bold">Journal Manager</h2>

      <section className="p-4 mb-5 bg-secondary rounded shadow-sm border border-secondary">
        <h3 className="fw-bold fs-5 mb-4">Write a Journal Entry</h3>
        <form>
          <div className="mb-3">
            <label htmlFor="journalTitle" className="form-label fw-bold">
              Title
            </label>
            <input
              type="text"
              id="journalTitle"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="form-control bg-secondary-subtle text-light border-secondary"
              placeholder="Enter a journal title..."
            />
          </div>

          <div className="mb-4">
            <label htmlFor="journalContent" className="form-label fw-bold">
              What's on your mind?
            </label>
            <textarea
              id="journalContent"
              value={entry}
              onChange={(e) => setEntry(e.target.value)}
              className="form-control bg-secondary-subtle text-light border-secondary"
              placeholder="Write your thoughts here..."
              rows={6}
            />
          </div>

          <button type="button" onClick={handleSave} className="btn btn-primary">
            Save Journal Entry
          </button>
        </form>
      </section>

      <section className="p-4 bg-secondary rounded shadow-sm border-secondary">
        <h3 className="fw-bold fs-5 mb-4">Reflection Answers for {initialDate || 'Selected Date'}</h3>
        {questionsAndAnswers.length > 0 ? (
          <ul className="list-group bg-dark">
            {questionsAndAnswers.map((qa, index) => (
              <li
                key={index}
                className="list-group-item bg-dark d-flex flex-column mb-3 border-secondary rounded"
              >
                <strong className="text-info">Question:</strong>
                <p className="mb-2">{qa.question.questionText}</p>
                <strong className="text-success">Answer:</strong>
                <p>{qa.answer.answerContent || 'No answer provided'}</p>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-muted">No questions or answers found for this date.</p>
        )}
      </section>
    </div>
  );
};
