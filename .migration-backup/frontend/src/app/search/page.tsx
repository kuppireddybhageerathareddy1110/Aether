'use client';

import { useState } from 'react';

export default function UniversalSearch() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const search = async () => {
    if (!query.trim()) return;
    setLoading(true);
    const res = await fetch('http://localhost:8000/search', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query }),
    });
    const data = await res.json();
    setResults(data.results);
    setLoading(false);
  };

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-4xl font-semibold tracking-tight mb-2">Universal Search</h1>
      <p className="text-zinc-400 mb-8">Search across journal entries, documents, and knowledge base</p>

      <div className="flex gap-3">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && search()}
          className="flex-1 bg-zinc-900 border border-zinc-800 rounded-2xl px-6 py-4 text-lg"
          placeholder="Search everything..."
        />
        <button 
          onClick={search} 
          disabled={loading}
          className="px-8 py-4 bg-white text-black rounded-2xl font-medium disabled:opacity-50"
        >
          Search
        </button>
      </div>

      {results.length > 0 && (
        <div className="mt-8 space-y-4">
          {results.map((r, i) => (
            <div key={i} className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
              <div className="text-xs uppercase tracking-widest text-zinc-500 mb-1">{r.type}</div>
              {r.name && <div className="font-medium">{r.name}</div>}
              {r.content && <div className="text-sm text-zinc-300 mt-1">{r.content}</div>}
              {r.mood && <div className="mt-2 text-xs text-emerald-400">Mood: {r.mood}</div>}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}