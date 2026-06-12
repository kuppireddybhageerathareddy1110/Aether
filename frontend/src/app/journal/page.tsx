'use client';

import { useState, useEffect } from 'react';

interface Entry {
  id: number;
  content: string;
  mood: string;
  timestamp: string;
}

export default function ResearchJournal() {
  const [entry, setEntry] = useState('');
  const [entries, setEntries] = useState<Entry[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchEntries = async () => {
    const res = await fetch('http://localhost:8000/journal');
    const data = await res.json();
    setEntries(data);
  };

  const saveEntry = async () => {
    if (!entry.trim()) return;
    setLoading(true);
    await fetch('http://localhost:8000/journal', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content: entry }),
    });
    setEntry('');
    await fetchEntries();
    setLoading(false);
  };

  useEffect(() => {
    fetchEntries();
  }, []);

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-4xl font-semibold tracking-tight mb-2">Research Journal</h1>
      <p className="text-zinc-400 mb-8">AI mood detection powered by Gemini (from myjournal)</p>

      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-8 mb-8">
        <textarea
          value={entry}
          onChange={(e) => setEntry(e.target.value)}
          className="w-full h-36 bg-zinc-950 border border-zinc-800 rounded-xl p-4 text-sm focus:outline-none focus:border-zinc-700"
          placeholder="Today I discovered something important about..."
        />
        <div className="flex justify-end mt-4">
          <button 
            onClick={saveEntry}
            disabled={loading}
            className="px-6 py-2.5 bg-white text-black rounded-xl text-sm font-medium disabled:opacity-50"
          >
            {loading ? 'Saving...' : 'Save Entry'}
          </button>
        </div>
      </div>

      <div>
        <h3 className="font-medium mb-4">Recent Entries</h3>
        <div className="space-y-3">
          {entries.length === 0 && (
            <p className="text-zinc-500 text-sm">No entries yet. Start journaling!</p>
          )}
          {entries.map((e) => (
            <div key={e.id} className="bg-zinc-900 border border-zinc-800 rounded-xl p-5">
              <div className="flex justify-between items-start">
                <div className="text-sm text-zinc-400">{e.timestamp}</div>
                <div className="px-3 py-0.5 text-xs rounded-full bg-zinc-800 text-zinc-300">{e.mood}</div>
              </div>
              <p className="mt-3 text-sm leading-relaxed">{e.content}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}