'use client';

import { useState } from 'react';

const agents = [
  { name: "RAG Researcher", desc: "Retrieves and synthesizes from documents", tasks: 124, status: "active" },
  { name: "Graph Analyst", desc: "Builds and analyzes knowledge graphs", tasks: 67, status: "active" },
  { name: "XAI Explainer", desc: "Generates explanations and counterfactuals", tasks: 89, status: "active" },
  { name: "QA Automator", desc: "Creates test cases and Selenium scripts", tasks: 53, status: "active" },
  { name: "Mood Analyst", desc: "Detects and correlates emotional patterns", tasks: 31, status: "active" },
  { name: "Paper Generator", desc: "Creates LaTeX papers from research", tasks: 12, status: "idle" },
];

export default function AgentOrchestration() {
  const [running, setRunning] = useState<string | null>(null);

  const runAgent = (name: string) => {
    setRunning(name);
    setTimeout(() => setRunning(null), 1800);
  };

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-5xl font-semibold tracking-tighter">Agent Orchestration</h1>
        <p className="text-zinc-400 mt-2">Multi-agent system with task tracking and coordination</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {agents.map((agent, i) => (
          <div key={i} className="bg-zinc-900 border border-zinc-800 rounded-3xl p-7">
            <div className="flex justify-between">
              <div>
                <div className="font-semibold text-lg">{agent.name}</div>
                <div className="text-xs text-zinc-400 mt-1">{agent.desc}</div>
              </div>
              <div className={`px-3 h-6 rounded-full text-xs flex items-center ${agent.status === 'active' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-zinc-700'}`}>
                {agent.status}
              </div>
            </div>

            <div className="mt-8 flex justify-between items-end">
              <div>
                <div className="text-4xl font-semibold tabular-nums">{agent.tasks}</div>
                <div className="text-xs text-zinc-500">tasks completed</div>
              </div>
              <button 
                onClick={() => runAgent(agent.name)}
                disabled={running === agent.name}
                className="px-5 py-2 text-sm border border-zinc-700 rounded-xl hover:bg-zinc-800 disabled:opacity-50"
              >
                {running === agent.name ? "Running..." : "Run Agent"}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}