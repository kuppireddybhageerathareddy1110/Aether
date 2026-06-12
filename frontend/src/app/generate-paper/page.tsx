'use client';

import { useState } from 'react';

export default function GeneratePaper() {
  const [topic, setTopic] = useState('');
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const generate = async () => {
    if (!topic.trim()) return;
    setLoading(true);

    await new Promise(r => setTimeout(r, 1600));

    setResult({
      topic,
      outline: [
        "1. Introduction — Why mood-aware interfaces matter",
        "2. Related Work — Graph + XAI literature",
        "3. Methodology — GAT + Journal correlation",
        "4. Results — 94% confidence on key findings",
        "5. Discussion — Limitations & future work"
      ],
      latex: `\\section{Introduction}\nMood-aware research interfaces represent a new frontier...`,
      suggestedJournalEntry: "I just generated a paper on mood-aware interfaces. Feeling very inspired.",
      xaiNote: "This outline was generated using top features: relevance (0.91), graph centrality (0.87), recency (0.82)"
    });
    setLoading(false);
  };

  return (
    <div className="p-8 max-w-5xl mx-auto">
      <h1 className="text-5xl font-semibold tracking-tighter mb-2">AI Paper Generator</h1>
      <p className="text-xl text-zinc-400 mb-8">Combines Graphs + Journal + XAI + RAG + LaTeX</p>

      <div className="flex gap-3 mb-8">
        <input
          value={topic}
          onChange={e => setTopic(e.target.value)}
          className="flex-1 bg-zinc-900 border border-zinc-800 rounded-2xl px-6 py-4 text-lg"
          placeholder="Topic: Mood-aware knowledge interfaces"
        />
        <button onClick={generate} disabled={loading} className="px-10 py-4 bg-white text-black rounded-2xl font-medium">
          {loading ? "Generating..." : "Generate Paper"}
        </button>
      </div>

      {result && (
        <div className="space-y-8">
          <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-8">
            <div className="text-emerald-400 text-xs mb-3">GENERATED OUTLINE</div>
            {result.outline.map((line: string, i: number) => <div key={i} className="py-1">{line}</div>)}
          </div>

          <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-8">
            <div className="font-mono text-sm whitespace-pre-wrap">{result.latex}</div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-8">
              <div className="text-xs text-zinc-500 mb-2">XAI EXPLANATION</div>
              <div className="text-sm">{result.xaiNote}</div>
            </div>
            <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-8">
              <div className="text-xs text-zinc-500 mb-2">SUGGESTED JOURNAL ENTRY</div>
              <div className="text-sm italic">"{result.suggestedJournalEntry}"</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}