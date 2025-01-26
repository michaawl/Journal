import React, { useState, useEffect } from 'react';
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
        console.log(`Fetching questions and answers for date: ${initialDate}`);
        const response = await reflectionService.getReflectionAnswersByDate(initialDate);

        console.log("Raw backend response:", response);

        const answersWithQuestions = Array.isArray(response)
          ? response 
          : response.answersWithQuestionsList || []; // Fallback to an empty array

        console.log("Mapped Questions and Answers:", answersWithQuestions);

        // Update state with the processed data
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

      console.log(
        `Saving journal entry. title: "${title}". entry: "${entry}". date: "${entryDate}"`
      );
      const response = await journalService.postJournalEntry(
        userId,
        title,
        entry,
        entryDate,
        initialId
      );
      console.log('Save successful:', response);

      alert('Journal entry saved successfully!');
    } catch (error) {
      console.error('Error saving journal entry:', error);
      alert('Failed to save the journal entry.');
    }
  };

  console.log("Current state - questionsAndAnswers:", questionsAndAnswers);

  return (
    <div style={{ padding: '20px', maxWidth: '600px', margin: '0 auto' }}>
      <h1>Journal Entry</h1>
      <p>Selected Date: {initialDate}</p>

      <h2>Title</h2>
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Enter a journal title..."
        style={{
          width: '100%',
          padding: '10px',
          marginBottom: '15px',
          fontSize: '16px',
          boxSizing: 'border-box',
        }}
      />

      <h2>What's on your mind?</h2>
      <textarea
        value={entry}
        onChange={(e) => setEntry(e.target.value)}
        placeholder="Write your thoughts here..."
        style={{
          width: '100%',
          height: '150px',
          padding: '10px',
          fontSize: '16px',
          boxSizing: 'border-box',
        }}
      />

      <h2>Questions and Answers</h2>
      <ul>
        {questionsAndAnswers.length > 0 ? (
          questionsAndAnswers.map((qa, index) => (
            <li key={index} style={{ marginBottom: '10px' }}>
              <strong>Question:</strong> {qa.question.questionText} <br />
              <strong>Answer:</strong> {qa.answer.answerContent || 'No answer provided'}
            </li>
          ))
        ) : (
          <p>No questions or answers for this date.</p>
        )}
      </ul>

      <button
        type="button"
        className="btn btn-primary"
        onClick={handleSave}
      >
        Save
      </button>
    </div>
  );
};
