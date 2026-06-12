import { useState } from 'react';

export default function ResearchBrain() {
  const [state, setState] = useState<any>(null);

  const activateBrain = () => {
    setState({
      mood: 'Curious',
      activeGraphs: 4,
      journalInsights: 17,
      xaiQueries: 89,
      agentsRunning: 5,
      currentFocus: 'Mood-aware Graph Neural Networks',
      prediction: 'You are 3 days away from a major insight based on current trajectory',
      recommendedActions: [
        'Ask AI Assistant to generate a paper',
        'Run Graph + Mood correlation analysis',
        'Create collaborative room for this topic',
        'Generate QA tests for new hypothesis',
      ],
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
            {[
              { label: 'Mood', value: state.mood },
              { label: 'Active Graphs', value: state.activeGraphs },
              { label: 'Journal Insights', value: state.journalInsights },
              { label: 'XAI Queries', value: state.xaiQueries },
              { label: 'Agents Running', value: state.agentsRunning },
            ].map(({ label, value }) => (
              <div key={label} className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6">
                <div className="text-xs text-zinc-500">{label}</div>
                <div className="text-2xl font-semibold mt-2">{value}</div>
              </div>
            ))}
          </div>

          <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-8">
            <div className="text-xs text-zinc-500 mb-2">CURRENT FOCUS</div>
            <div className="text-3xl font-semibold">{state.currentFocus}</div>
          </div>

          <div className="bg-emerald-500/5 border border-emerald-900 rounded-3xl p-8">
            <div className="text-emerald-400 text-xs mb-2">PREDICTION</div>
            <div className="text-2xl">{state.prediction}</div>
          </div>

          <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-8">
            <div className="text-xs text-zinc-500 mb-4">RECOMMENDED ACTIONS</div>
            <div className="space-y-3">
              {state.recommendedActions.map((action: string, i: number) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-full bg-zinc-800 flex items-center justify-center text-xs">{i + 1}</div>
                  <div className="text-sm">{action}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
