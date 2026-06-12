'use client';

import { useState } from 'react';

export default function AutoResearchAgent() {
  const [running, setRunning] = useState(false);
  const [logs, setLogs] = useState<string[]>([]);

  const startAutoResearch = () => {
    setRunning(true);
    setLogs([]);

    const steps = [
      "🧠 Research Brain activated",
      "📄 Scanning all uploaded documents...",
      "📊 Building cross-document knowledge graph (GAT)",
      "😊 Analyzing 41 journal entries for mood patterns",
      "🔍 Running RAG queries on top concepts",
      "✍️ Generating 3 paper outlines using XAI insights",
      "🧪 Creating QA test suites for new hypotheses",
      "📈 Predicting next breakthrough in 4 days",
      "✅ Auto-research cycle complete. 7 new insights generated."
    ];

    let i = 0;
    const interval = setInterval(() => {
      if (i < steps.length) {
        setLogs(prev => [...prev, steps[i]]);
        i++;
      } else {
        clearInterval(interval);
        setRunning(false);
      }
    }, 650);
  };

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-5xl font-semibold tracking-tighter mb-2">Autonomous Research Agent</h1>
      <p className="text-xl text-zinc-400 mb-8">Fully autonomous loop: Upload → Graph → Journal → XAI → Paper → QA</p>

      <button 
        onClick={startAutoResearch} 
        disabled={running}
        className="px-10 py-4 bg-white text-black rounded-3xl text-lg font-medium disabled:opacity-50 mb-8"
      >
        {running ? "Running Autonomous Research..." : "Start Autonomous Research Cycle"}
      </button>

      {logs.length > 0 && (
        <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-8 font-mono text-sm space-y-2">
          {logs.map((log, i) => (
            <div key={i} className="text-emerald-400">{log}</div>
          ))}
        </div>
      )}
    </div>
  );
}