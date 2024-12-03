import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';

export const JournalEntry: React.FC = () => {
    const location = useLocation();
    const query = new URLSearchParams(location.search);
    const date = query.get('date');
    
    const [title, setTitle] = useState('');
    const [entry, setEntry] = useState('');
    
    const handleSave = () => {
      console.log('Journal entry saved:', { title, entry });
    };
  
    return (
      <div style={{ padding: '20px', maxWidth: '600px', margin: '0 auto' }}>
        <h1>Journal Entry</h1>
        <p>Selected Date: {date}</p>
  
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
            onClick={handleSave}>
            Save
        </button>
      </div>
    );
  };