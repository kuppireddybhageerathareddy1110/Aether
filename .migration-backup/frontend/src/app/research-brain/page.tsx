'use client';

import { useState } from 'react';

export default function ResearchBrain() {
  const [state, setState] = useState<any>(null);

  const activateBrain = () => {
    setState({
      mood: "Curious",
      activeGraphs: 4,
      journalInsights: 17,
      xaiQueries: 89,
      agentsRunning: 5,
      currentFocus: "Mood-aware Graph Neural Networks",
      prediction: "You are 3 days away from a major insight based on current trajectory",
      recommendedActions: [
        "Ask AI Assistant to generate a paper",
        "Run Graph + Mood correlation analysis",
        "Create collaborative room for this topic",
        "Generate QA tests for new hypothesis"
      ]
    });
  };

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <h1 className="text-6xl font-semibold tracking-tighter mb-3">The Research Brain</h1>
      <p className="text-2xl text-zinc-400 mb-10">Central nervous system of your entire research life — combines everything</p>

      <button onClick={activateBrain} className="px-10 py-4 bg-white text-black rounded-3xl text-lg font-medium mb-12">Activate Research Brain</button>

      {state && (
        <div className="space-y-8">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {Object.entries(state).filter(([k]) => !['currentFocus','prediction','recommendedActions'].includes(k)).map(([k,v]) => (
              <div key={k} className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6">
                <div className="text-xs text-zinc-500">{k.replace(/([A-Z])/g, ' $1')}</div>
                <div className="text-4xl font-semibold mt-3 tabular-nums">{String(v)}</div>
              </div>
            ))}
          </div>

          <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-10">
            <div className="text-emerald-400 text-xs mb-2">CURRENT FOCUS</div>
            <div className="text-4xl leading-none tracking-tighter">{state.currentFocus}</div>
          </div>

          <div className="bg-emerald-500/5 border border-emerald-900 rounded-3xl p-10">
            <div className="text-emerald-400 text-xs mb-3">PREDICTION</div>
            <div className="text-3xl">{state.prediction}</div>
          </div>

          <div>
            <div className="text-xs text-zinc-500 mb-4 px-2">RECOMMENDED ACTIONS</div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {state.recommendedActions.map((a: string, i: number) => (
                <div key={i} className="bg-zinc-900 border border-zinc-800 rounded-2xl px-6 py-5 text-sm">{a}</div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}