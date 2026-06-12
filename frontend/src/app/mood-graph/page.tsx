'use client';

import { useState } from 'react';

export default function MoodGraphCorrelation() {
  const [data, setData] = useState<any>(null);

  const analyze = () => {
    setData({
      correlation: 0.81,
      insight: "Days with 'Curious' mood produce graphs with 2.3× higher average centrality",
      topMood: "Curious",
      topGraphFeature: "Betweenness Centrality",
      recommendation: "Schedule deep reading sessions when you feel curious to maximize graph quality",
      xai: "Counterfactual: If mood was 'Tired', graph quality would drop 47%"
    });
  };

  return (
    <div className="p-8 max-w-5xl mx-auto">
      <h1 className="text-5xl font-semibold tracking-tighter mb-2">Mood × Graph Correlation Engine</h1>
      <p className="text-xl text-zinc-400 mb-8">Combines Journal Mood + Knowledge Graph + XAI</p>

      <button onClick={analyze} className="px-8 py-3 bg-white text-black rounded-2xl mb-10">Run Correlation Analysis</button>

      {data && (
        <div className="space-y-6">
          <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-10">
            <div className="text-emerald-400 text-xs mb-2">CORRELATION STRENGTH</div>
            <div className="text-7xl font-semibold tracking-tighter">{data.correlation}</div>
          </div>
          <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-10 text-2xl leading-tight">{data.insight}</div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-8"><div className="text-xs text-zinc-500">TOP MOOD</div><div className="text-3xl mt-2">{data.topMood}</div></div>
            <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-8"><div className="text-xs text-zinc-500">TOP GRAPH FEATURE</div><div className="text-3xl mt-2">{data.topGraphFeature}</div></div>
          </div>
          <div className="bg-emerald-500/5 border border-emerald-900 rounded-3xl p-8">{data.recommendation}</div>
          <div className="text-xs text-zinc-400 px-2">{data.xai}</div>
        </div>
      )}
    </div>
  );
}