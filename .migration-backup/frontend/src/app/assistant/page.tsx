'use client';

import { useState } from 'react';

export default function AIResearchAssistant() {
  const [query, setQuery] = useState('');
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const runAssistant = async () => {
    if (!query.trim()) return;
    setLoading(true);

    // Simulate multi-agent orchestration
    await new Promise(r => setTimeout(r, 1400));

    setResult({
      query,
      steps: [
        { agent: "RAG Researcher", output: "Found 7 relevant papers and 12 journal entries" },
        { agent: "Graph Analyst", output: "Identified 3 key concept clusters with high centrality" },
        { agent: "XAI Explainer", output: "Generated counterfactual explanations for top 3 insights" },
        { agent: "Mood Analyst", output: "Your recent entries show high curiosity — aligned with topic" },
      ],
      finalAnswer: "The strongest research direction right now is combining knowledge graphs with mood-aware interfaces. Confidence: 94%",
      suggestedActions: ["Create new journal entry", "Generate QA tests", "Export graph"]
    });
    setLoading(false);
  };

  return (
    <div className="p-8 max-w-5xl mx-auto">
      <div className="mb-8">
        <h1 className="text-5xl font-semibold tracking-tighter">AI Research Assistant</h1>
        <p className="text-xl text-zinc-400 mt-2">Multi-agent orchestration across your entire knowledge base</p>
      </div>

      <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-8">
        <div className="flex gap-3">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="flex-1 bg-zinc-950 border border-zinc-800 rounded-2xl px-6 py-4 text-lg"
            placeholder="What should I research next?"
          />
          <button onClick={runAssistant} disabled={loading} className="px-10 py-4 bg-white text-black rounded-2xl font-medium">
            {loading ? "Thinking..." : "Ask Assistant"}
          </button>
        </div>
      </div>

      {result && (
        <div className="mt-8 space-y-6">
          <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-8">
            <div className="text-emerald-400 text-sm mb-2">FINAL INSIGHT</div>
            <div className="text-xl leading-tight">{result.finalAnswer}</div>
          </div>

          <div>
            <div className="font-medium mb-4 px-2">Agent Execution Trace</div>
            <div className="space-y-3">
              {result.steps.map((step: any, i: number) => (
                <div key={i} className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 flex gap-4">
                  <div className="font-mono text-xs px-3 py-1 rounded bg-zinc-800 h-fit">{step.agent}</div>
                  <div className="text-sm text-zinc-300">{step.output}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex gap-3">
            {result.suggestedActions.map((action: string, i: number) => (
              <button key={i} className="px-5 py-2 text-sm border border-zinc-700 rounded-xl hover:bg-zinc-800">
                {action}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}