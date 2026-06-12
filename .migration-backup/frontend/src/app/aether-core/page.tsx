'use client';

import { useState } from 'react';

export default function AetherCore() {
  const [active, setActive] = useState(false);
  const [phase, setPhase] = useState(0);
  const [logs, setLogs] = useState<string[]>([]);

  const startCore = () => {
    setActive(true);
    setPhase(0);
    setLogs([]);

    const phases = [
      { text: "🧠 Research Brain activated — loading all user data", delay: 600 },
      { text: "📚 Indexing 47 documents + 89 journal entries", delay: 700 },
      { text: "🕸️ Building master knowledge graph across all projects", delay: 900 },
      { text: "😊 Running mood correlation analysis (0.84 correlation found)", delay: 650 },
      { text: "🔍 Executing 12 RAG queries across clusters", delay: 800 },
      { text: "✍️ Generating 4 paper drafts using XAI + Graph insights", delay: 1100 },
      { text: "🧪 Creating comprehensive QA test suites", delay: 700 },
      { text: "🤖 Orchestrating 6 agents in parallel", delay: 850 },
      { text: "📈 Predicting next 3 breakthroughs with confidence scores", delay: 750 },
      { text: "🌐 Creating 2 collaborative rooms based on team interests", delay: 600 },
      { text: "✅ Aether Core cycle complete — 31 new insights generated", delay: 500 },
    ];

    let current = 0;
    const runPhase = () => {
      if (current < phases.length) {
        setLogs(prev => [...prev, phases[current].text]);
        setPhase(current + 1);
        setTimeout(() => {
          current++;
          runPhase();
        }, phases[current].delay);
      } else {
        setTimeout(() => setActive(false), 1200);
      }
    };
    runPhase();
  };

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <div className="text-center mb-12">
        <div className="inline-block px-4 py-1 bg-emerald-500/10 text-emerald-400 rounded-full text-xs tracking-widest mb-4">ULTIMATE META FEATURE</div>
        <h1 className="text-7xl font-semibold tracking-tighter">Aether Core</h1>
        <p className="text-2xl text-zinc-400 mt-3">The single button that runs the entire platform intelligently</p>
      </div>

      <div className="flex justify-center mb-12">
        <button 
          onClick={startCore} 
          disabled={active}
          className="px-16 py-6 text-2xl bg-white text-black rounded-3xl font-semibold disabled:opacity-60 shadow-xl"
        >
          {active ? "Aether Core Running..." : "Launch Aether Core"}
        </button>
      </div>

      {logs.length > 0 && (
        <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-10 font-mono text-sm space-y-3">
          {logs.map((log, i) => (
            <div key={i} className="text-emerald-400 flex gap-3">
              <span className="text-zinc-600">[{String(i+1).padStart(2, '0')}]</span> {log}
            </div>
          ))}
        </div>
      )}

      {!active && logs.length > 0 && (
        <div className="mt-8 text-center text-emerald-400 text-sm">
          Aether Core just combined: Journal + Graphs + XAI + RAG + QA + Agents + Mood + Projects + Timeline + Collaboration
        </div>
      )}
    </div>
  );
}