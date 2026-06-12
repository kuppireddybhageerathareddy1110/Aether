import { useState } from 'react';

const agents = [
  { id: 1, name: 'Graph Analyst', status: 'active', task: 'Analyzing centrality of 87-node graph', skill: 'Graph Neural Networks' },
  { id: 2, name: 'Mood Analyst', status: 'active', task: 'Processing journal entry sentiment', skill: 'NLP + Gemini' },
  { id: 3, name: 'XAI Explainer', status: 'active', task: 'Generating counterfactuals for query', skill: 'Explainable AI' },
  { id: 4, name: 'QA Generator', status: 'idle', task: '', skill: 'Selenium + RAG' },
  { id: 5, name: 'Paper Writer', status: 'idle', task: '', skill: 'LaTeX + LLM' },
  { id: 6, name: 'Search Agent', status: 'active', task: 'Indexing 3 new documents', skill: 'FAISS + BM25' },
  { id: 7, name: 'RAG Retriever', status: 'active', task: 'Processing query queue', skill: 'RAG + FAISS' },
  { id: 8, name: 'Orchestrator', status: 'active', task: 'Coordinating agent tasks', skill: 'NEXUS Core' },
];

export default function Agents() {
  const [selected, setSelected] = useState<number | null>(null);

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <h1 className="text-5xl font-semibold tracking-tighter mb-2">Agent System</h1>
      <p className="text-xl text-zinc-400 mb-8">Skills-based autonomous agents (from new + NEXUS)</p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {agents.map(agent => (
          <div
            key={agent.id}
            onClick={() => setSelected(agent.id === selected ? null : agent.id)}
            className={`glass rounded-3xl p-6 cursor-pointer transition-all hover:border-zinc-700 ${selected === agent.id ? 'ring-1 ring-white' : ''}`}
          >
            <div className="flex items-center justify-between mb-3">
              <div className="font-semibold">{agent.name}</div>
              <div className={`w-2 h-2 rounded-full ${agent.status === 'active' ? 'bg-emerald-400' : 'bg-zinc-600'}`} />
            </div>
            <div className="text-xs text-zinc-500 mb-2">{agent.skill}</div>
            {agent.task && <div className="text-xs text-zinc-400 leading-relaxed">{agent.task}</div>}
            {!agent.task && <div className="text-xs text-zinc-600">Idle — waiting for tasks</div>}
          </div>
        ))}
      </div>

      <div className="mt-8 glass rounded-3xl p-8">
        <div className="text-emerald-400 text-xs mb-2">SYSTEM STATUS</div>
        <div className="text-2xl">{agents.filter(a => a.status === 'active').length} agents running • {agents.filter(a => a.status === 'idle').length} idle</div>
        <div className="mt-4 flex gap-4">
          <button className="px-6 py-3 bg-white text-black rounded-2xl text-sm">Deploy New Agent</button>
          <button className="px-6 py-3 border border-zinc-700 rounded-2xl text-sm">View Logs</button>
        </div>
      </div>
    </div>
  );
}
