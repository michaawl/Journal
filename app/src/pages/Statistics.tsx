import React, { useState, useEffect } from 'react';
import JournalService from '../journal-service';

type JournalEntry = {
  entryId: number;
  entryTitle: string;
  entryContent: string;
  entryDate: string;
};

export const Statistics: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [error, setError] = useState<string | null>(null);

  const journalService = new JournalService();

  const fetchJournalEntries = async () => {
    setLoading(true);
    setError(null);

    try {
      const result = await journalService.getJournalEntries(1);
      setEntries(result.entries || []);
      console.log('Journal Entries:', result);
    } catch (err: any) {
      setError(err.message);
      console.error('Error fetching journal entries:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJournalEntries();
  }, []);

  return (
    <div>
      <button
        onClick={fetchJournalEntries}
        style={{
          backgroundColor: 'yellow',
          border: 'none',
          padding: '10px 20px',
          fontSize: '16px',
          fontWeight: 'bold',
          cursor: 'pointer',
          borderRadius: '5px',
        }}
      >
        {loading ? 'Loading...' : 'Fetch Journal Entries'}
      </button>

      {error && <p style={{ color: 'red' }}>Error: {error}</p>}

      <div>
        <h2>Journal Entries</h2>
        {entries.length > 0 ? (
          entries.map((entry: JournalEntry) => (
            <div key={entry.entryId}>
              <h3>{entry.entryTitle}</h3>
              <p>{entry.entryContent}</p>
              <p>{entry.entryDate}</p>
            </div>
          ))
        ) : (
          <p>No entries available</p>
        )}
      </div>
    </div>
  );
};
