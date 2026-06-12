'use client';

import { useState } from 'react';

const projects = [
  { id: 1, name: "Knowledge Graph Paper", docs: 7, entries: 23, graphs: 4, lastActive: "2h ago" },
  { id: 2, name: "Mood-Aware Interfaces", docs: 12, entries: 41, graphs: 9, lastActive: "yesterday" },
  { id: 3, name: "XAI Benchmark Study", docs: 5, entries: 18, graphs: 3, lastActive: "3 days ago" },
];

export default function Projects() {
  const [selected, setSelected] = useState<number | null>(null);

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <div className="flex justify-between items-end mb-8">
        <div>
          <h1 className="text-5xl font-semibold tracking-tighter">Projects</h1>
          <p className="text-zinc-400 mt-2">Organize your research into intelligent workspaces</p>
        </div>
        <button className="px-6 py-3 bg-white text-black rounded-2xl text-sm font-medium">New Project</button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map(p => (
          <div 
            key={p.id}
            onClick={() => setSelected(p.id)}
            className={`bg-zinc-900 border border-zinc-800 rounded-3xl p-7 cursor-pointer transition-all hover:border-zinc-700 ${selected === p.id ? 'ring-1 ring-white' : ''}`}
          >
            <div className="font-semibold text-xl">{p.name}</div>
            <div className="text-xs text-zinc-500 mt-1">{p.lastActive}</div>

            <div className="flex gap-6 mt-8 text-sm">
              <div><span className="font-mono text-lg">{p.docs}</span><div className="text-xs text-zinc-500">Docs</div></div>
              <div><span className="font-mono text-lg">{p.entries}</span><div className="text-xs text-zinc-500">Journal</div></div>
              <div><span className="font-mono text-lg">{p.graphs}</span><div className="text-xs text-zinc-500">Graphs</div></div>
            </div>
          </div>
        ))}
      </div>

      {selected && (
        <div className="mt-10 bg-zinc-900 border border-zinc-800 rounded-3xl p-8">
          <div className="text-emerald-400 text-xs tracking-widest mb-2">PROJECT INSIGHTS</div>
          <div className="text-2xl">This project has 3 high-centrality concepts and strong mood correlation with "Curious".</div>
          <div className="mt-6 flex gap-4">
            <button className="px-6 py-3 bg-white text-black rounded-2xl text-sm">Generate Report</button>
            <button className="px-6 py-3 border border-zinc-700 rounded-2xl text-sm">Run Graph Analysis</button>
            <button className="px-6 py-3 border border-zinc-700 rounded-2xl text-sm">Ask AI Assistant</button>
          </div>
        </div>
      )}
    </div>
  );
}