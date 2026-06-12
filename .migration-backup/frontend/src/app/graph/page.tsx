'use client';

import { useState } from 'react';

export default function KnowledgeGraph() {
  const [pdfName, setPdfName] = useState('');
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const analyze = async () => {
    if (!pdfName.trim()) return;
    setLoading(true);
    const res = await fetch('http://localhost:8000/graph/analyze', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ pdf_name: pdfName }),
    });
    const data = await res.json();
    setResult(data);
    setLoading(false);
  };

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-4xl font-semibold tracking-tight mb-2">Knowledge Graph</h1>
      <p className="text-zinc-400 mb-8">PDF → Knowledge Graph + GAT Analysis (from pdf-graph)</p>

      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-8">
        <input
          type="text"
          value={pdfName}
          onChange={(e) => setPdfName(e.target.value)}
          className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-sm"
          placeholder="research-paper.pdf"
        />
        <button 
          onClick={analyze} 
          disabled={loading}
          className="mt-4 px-6 py-2.5 bg-white text-black rounded-xl text-sm font-medium disabled:opacity-50"
        >
          {loading ? 'Analyzing...' : 'Analyze PDF'}
        </button>
      </div>

      {result && (
        <div className="mt-8 bg-zinc-900 border border-zinc-800 rounded-2xl p-8">
          <h3 className="font-medium mb-4">Analysis Results</h3>
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-3xl font-semibold">{result.nodes}</div>
              <div className="text-xs text-zinc-500 mt-1">NODES</div>
            </div>
            <div>
              <div className="text-3xl font-semibold">{result.edges}</div>
              <div className="text-xs text-zinc-500 mt-1">EDGES</div>
            </div>
            <div className="col-span-3 mt-4 text-sm text-emerald-400">{result.message}</div>
          </div>
        </div>
      )}
    </div>
  );
}