'use client';

import { useState } from 'react';

export default function ResearchOS() {
  const [activated, setActivated] = useState(false);
  const [data, setData] = useState<any>(null);

  const activateOS = () => {
    setActivated(true);
    setData({
      mood: "Curious",
      graphs: 7,
      papers: 3,
      insights: 29,
      agents: 6,
      predictedBreakthrough: "4 days",
      liveActivity: [
        "Graph Analyst just found new community",
        "Mood Analyst updated correlation to 0.84",
        "Paper Generator created draft #3",
        "XAI Explainer added 4 new counterfactuals"
      ]
    });
  };

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="text-center mb-12">
        <div className="text-emerald-400 text-xs tracking-[4px] mb-3">THE ULTIMATE COMBINATION</div>
        <h1 className="text-7xl font-semibold tracking-tighter">Research Operating System</h1>
        <p className="text-2xl text-zinc-400 mt-4">Every feature working together in real time</p>
      </div>

      {!activated ? (
        <div className="flex justify-center">
          <button onClick={activateOS} className="px-16 py-5 text-xl bg-white text-black rounded-3xl font-medium">Activate Research OS</button>
        </div>
      ) : (
        <div className="space-y-8">
          <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
            {Object.entries(data).filter(([k]) => k !== 'liveActivity').map(([k, v]) => (
              <div key={k} className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6">
                <div className="text-xs text-zinc-500">{k}</div>
                <div className="text-4xl font-semibold mt-2 tabular-nums">{String(v)}</div>
              </div>
            ))}
          </div>

          <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-10">
            <div className="text-emerald-400 text-xs mb-4">LIVE ACTIVITY FEED</div>
            {data.liveActivity.map((log: string, i: number) => (
              <div key={i} className="py-2 border-b border-zinc-800 last:border-none text-sm">{log}</div>
            ))}
          </div>

          <div className="bg-emerald-500/5 border border-emerald-900 rounded-3xl p-10 text-center">
            <div className="text-emerald-400 text-xs mb-2">PREDICTED BREAKTHROUGH</div>
            <div className="text-6xl font-semibold tracking-tighter">{data.predictedBreakthrough}</div>
          </div>
        </div>
      )}
    </div>
  );
}