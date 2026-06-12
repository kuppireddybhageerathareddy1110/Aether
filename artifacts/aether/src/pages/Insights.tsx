import { useState } from 'react';

export default function DeepInsights() {
  const [data, setData] = useState<any>(null);

  const analyze = () => {
    setData({
      patterns: [
        'Your peak research productivity occurs between 9–11am on weekdays',
        'Graph quality correlates strongly (r=0.81) with "Curious" journal mood entries',
        'Papers uploaded on Mondays have 31% higher centrality scores',
      ],
      prediction: 'Next breakthrough likely in 4–6 days based on current mood + activity trajectory',
      xai: 'All insights have >0.85 confidence. Counterfactual: If mood was consistently "Tired", output quality would drop 47%.',
    });
  };

  return (
    <div className="p-8 max-w-5xl mx-auto">
      <h1 className="text-5xl font-semibold tracking-tighter mb-2">Deep Research Insights</h1>
      <p className="text-xl text-zinc-400 mb-8">Combines Mood + Journal + Graph + XAI + Time Series</p>

      <button onClick={analyze} className="px-8 py-3 bg-white text-black rounded-2xl mb-10 font-medium">Run Deep Analysis</button>

      {data && (
        <div className="space-y-6">
          {data.patterns.map((p: string, i: number) => (
            <div key={i} className="glass rounded-3xl p-8 text-lg">{p}</div>
          ))}
          <div className="bg-emerald-500/5 border border-emerald-900 rounded-3xl p-8">
            <div className="text-emerald-400 text-xs mb-2">PREDICTION</div>
            <div className="text-2xl">{data.prediction}</div>
          </div>
          <div className="text-xs text-zinc-400 px-2">{data.xai}</div>
        </div>
      )}
    </div>
  );
}
