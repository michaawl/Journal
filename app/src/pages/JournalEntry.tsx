import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import JournalService from '../services/journal-service';

export const JournalEntry: React.FC = () => {
  const location = useLocation();
  const query = new URLSearchParams(location.search);

  // Get initial values from query parameters
  const initialDate = query.get('date');
  const initialTitle = query.get('title') || '';
  const initialContent = query.get('content') || '';
  const initialId = query.get('id') ? Number(query.get('id')) : undefined;

  // State hooks
  const [title, setTitle] = useState(initialTitle);
  const [entry, setEntry] = useState(initialContent);
  const journalService = new JournalService();

  // Debug logs
  console.log("Date:", initialDate);
  console.log("Title:", initialTitle);
  console.log("Content:", initialContent);
  console.log("Entry Id:", initialId);

  // Handle Save Button
  const handleSave = async () => {
    if (!title.trim() || !entry.trim()) {
      alert('Title and entry cannot be empty.');
      return;
    }
  
    try {
      // Assuming userId is hardcoded for now
      const userId = 1;
  
      // Use the current date if initialDate is not provided
      const entryDate = initialDate || new Date().toISOString();
  
      // If initialId exists, update the entry; otherwise, create a new entry
      const response = await journalService.postJournalEntry(userId, title, entry, entryDate, initialId);
      console.log('Save successful:', response);
  
      alert('Journal entry saved successfully!');
    } catch (error) {
      console.error('Error saving journal entry:', error);
      alert('Failed to save the journal entry.');
    }
  };
  

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
