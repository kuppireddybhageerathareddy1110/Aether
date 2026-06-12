'use client';

import { useState } from 'react';

export default function SmartResearchDashboard() {
  const [insights, setInsights] = useState<any>(null);

  const generateInsights = () => {
    setInsights({
      moodTrend: "Your curiosity has increased 34% this week — aligned with 3 new graph communities",
      topConcept: "Knowledge Graphs + Mood Detection (correlation: 0.81)",
      recommendation: "You should explore 'Counterfactual Graph Explanations' next",
      agentsUsed: ["Graph Analyst", "Mood Analyst", "XAI Explainer"],
      journalLink: "See related journal entries →",
      graphLink: "View generated graph →"
    });
  };

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <h1 className="text-5xl font-semibold tracking-tighter mb-2">Smart Research Dashboard</h1>
      <p className="text-xl text-zinc-400 mb-8">Combines Journal + Graph + XAI + Agents + Mood</p>

      <button onClick={generateInsights} className="mb-8 px-8 py-3 bg-white text-black rounded-2xl font-medium">Generate Cross-Feature Insights</button>

      {insights && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-8">
            <div className="text-emerald-400 text-xs mb-3">MOOD + GRAPH CORRELATION</div>
            <div className="text-xl leading-snug">{insights.moodTrend}</div>
          </div>
          <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-8">
            <div className="text-emerald-400 text-xs mb-3">TOP CONCEPT PAIR</div>
            <div className="text-xl leading-snug">{insights.topConcept}</div>
          </div>
          <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-8 col-span-1 md:col-span-2">
            <div className="text-emerald-400 text-xs mb-3">AI RECOMMENDATION</div>
            <div className="text-2xl">{insights.recommendation}</div>
            <div className="mt-6 text-xs text-zinc-400">Agents involved: {insights.agentsUsed.join(" • ")}</div>
          </div>
        </div>
      )}
    </div>
  );
}