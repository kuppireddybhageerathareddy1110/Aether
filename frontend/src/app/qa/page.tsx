'use client';

import { useState } from 'react';

interface TestCase {
  id: number;
  scenario: string;
  steps: string[];
}

interface QAResponse {
  query: string;
  test_cases: TestCase[];
  selenium_script: string;
}

export default function QAGenerator() {
  const [query, setQuery] = useState('');
  const [result, setResult] = useState<QAResponse | null>(null);
  const [loading, setLoading] = useState(false);

  const generate = async () => {
    if (!query.trim()) return;
    setLoading(true);
    const res = await fetch('http://localhost:8000/qa/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query }),
    });
    const data = await res.json();
    setResult(data);
    setLoading(false);
  };

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-4xl font-semibold tracking-tight mb-2">QA Generator</h1>
      <p className="text-zinc-400 mb-8">RAG-powered test case &amp; Selenium generator (from sel-gen + new)</p>

      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-8">
        <textarea 
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full h-24 bg-zinc-950 border border-zinc-800 rounded-xl p-4 text-sm"
          placeholder="Generate all positive and negative test cases for the discount code feature..."
        />
        <button 
          onClick={generate} 
          disabled={loading}
          className="mt-4 px-6 py-2.5 bg-white text-black rounded-xl text-sm font-medium disabled:opacity-50"
        >
          {loading ? 'Generating...' : 'Generate Test Cases'}
        </button>
      </div>

      {result && (
        <div className="mt-8 space-y-6">
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
            <h4 className="font-medium mb-3">Test Cases</h4>
            {result.test_cases.map(tc => (
              <div key={tc.id} className="mb-4 last:mb-0">
                <div className="font-medium text-sm">{tc.scenario}</div>
                <ul className="text-sm text-zinc-400 mt-1 list-disc list-inside">
                  {tc.steps.map((step, i) => <li key={i}>{step}</li>)}
                </ul>
              </div>
            ))}
          </div>

          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
            <h4 className="font-medium mb-3">Generated Selenium Script</h4>
            <pre className="text-xs bg-zinc-950 p-4 rounded-xl overflow-x-auto whitespace-pre-wrap text-zinc-300">
              {result.selenium_script}
            </pre>
          </div>
        </div>
      )}
    </div>
  );
}