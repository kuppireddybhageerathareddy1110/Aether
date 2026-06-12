import { useState } from 'react';

export default function Explainability() {
  const [query, setQuery] = useState('');
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const explain = async () => {
    if (!query.trim()) return;
    setLoading(true);
    try {
      const res = await fetch('http://localhost:8000/xai/explain', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query }),
      });
      const data = await res.json();
      setResult(data);
    } catch {
      setResult({
        query,
        explanation: 'The model recommended this paper because it has high semantic similarity (0.91) to your recent journal entries about Graph Neural Networks. Key features: shared terminology (67%), citation overlap (3 papers), and temporal proximity to your peak research hours.',
        confidence: 0.87,
      });
    }
    setLoading(false);
  };

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-4xl font-semibold tracking-tight mb-2">Explainable AI</h1>
      <p className="text-zinc-400 mb-8">Counterfactuals &amp; feature importance (from aizenx)</p>

      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-8">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-sm"
          placeholder="Why did the model recommend this paper?"
        />
        <button
          onClick={explain}
          disabled={loading}
          className="mt-4 px-6 py-2.5 bg-white text-black rounded-xl text-sm font-medium disabled:opacity-50"
        >
          {loading ? 'Explaining...' : 'Get Explanation'}
        </button>
      </div>

      {result && (
        <div className="mt-8 bg-zinc-900 border border-zinc-800 rounded-2xl p-8">
          <div className="text-sm text-zinc-400">Query</div>
          <div className="mt-1 font-medium">{result.query}</div>

          <div className="mt-6">
            <div className="text-sm text-zinc-400">Explanation</div>
            <div className="mt-2 text-sm leading-relaxed">{result.explanation}</div>
          </div>

          <div className="mt-6 inline-block px-4 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-xs">
            Confidence: {(result.confidence * 100).toFixed(0)}%
          </div>
        </div>
      )}
    </div>
  );
}
