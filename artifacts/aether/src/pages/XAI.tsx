import { useState } from 'react';
import { FlaskConical, Play, RefreshCw, BarChart3, Brain } from 'lucide-react';

function generateExplanation(query: string) {
  const features = [
    { name: 'Semantic Similarity', value: 0.91, type: 'positive' },
    { name: 'Journal Correlation', value: 0.84, type: 'positive' },
    { name: 'Citation Overlap', value: 0.67, type: 'positive' },
    { name: 'Temporal Proximity', value: 0.73, type: 'positive' },
    { name: 'Domain Mismatch', value: -0.23, type: 'negative' },
    { name: 'Recency Bias', value: -0.12, type: 'negative' },
  ];
  const counterfactuals = [
    `If semantic similarity dropped below 0.75, "${query}" would NOT be recommended`,
    `If journal correlation were < 0.60, confidence would drop by 32%`,
    `Adding 2 more shared citations would increase confidence to 0.94`,
  ];
  return { features, counterfactuals, confidence: 0.87, model: 'GAT-v2', decision: `Recommended based on high cross-domain relevance to "${query}"` };
}

export default function Explainability() {
  const [query, setQuery] = useState('');
  const [result, setResult] = useState<ReturnType<typeof generateExplanation> | null>(null);
  const [loading, setLoading] = useState(false);
  const [tab, setTab] = useState<'shap' | 'attention' | 'counterfactual'>('shap');

  const explain = async () => {
    if (!query.trim()) return;
    setLoading(true);
    await new Promise(r => setTimeout(r, 800 + Math.random() * 600));
    setResult(generateExplanation(query));
    setLoading(false);
  };

  return (
    <div className="h-screen flex flex-col bg-transparent">
      <div className="border-b border-white/[0.07] bg-zinc-900/50 px-6 py-4">
        <h1 className="text-xl font-bold text-white flex items-center gap-2"><FlaskConical className="w-5 h-5 text-amber-400" />XAI — Explainability</h1>
        <p className="text-xs text-zinc-500 mt-0.5">SHAP values, attention heatmaps, and counterfactual explanations</p>
      </div>

      <div className="flex-1 overflow-auto p-6">
        <div className="max-w-3xl mx-auto space-y-5">
          <div className="glass rounded-2xl p-5">
            <div className="text-xs font-semibold text-zinc-400 uppercase tracking-widest mb-3">Explain Model Decision For</div>
            <div className="flex gap-3">
              <input value={query} onChange={e => setQuery(e.target.value)} onKeyDown={e => e.key === 'Enter' && explain()}
                className="flex-1 bg-transparent border border-zinc-700 rounded-xl px-4 py-2.5 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:border-amber-500/50"
                placeholder="e.g. 'Recommend paper on graph attention networks'" />
              <button onClick={explain} disabled={loading || !query.trim()}
                className="flex items-center gap-2 px-5 py-2.5 bg-amber-600 hover:bg-amber-500 disabled:opacity-40 text-white rounded-xl text-sm font-medium transition-colors">
                {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4" />}
                {loading ? 'Explaining...' : 'Explain'}
              </button>
            </div>
          </div>

          {result && (
            <>
              <div className="glass rounded-2xl p-5">
                <div className="flex items-center justify-between mb-2">
                  <div className="text-sm font-semibold text-white">{result.decision}</div>
                  <span className="text-xs text-emerald-400 font-mono">Confidence: {(result.confidence * 100).toFixed(0)}%</span>
                </div>
                <div className="text-xs text-zinc-500">Model: {result.model}</div>
              </div>

              <div className="flex gap-2">
                {[['shap', 'SHAP Values'], ['attention', 'Attention'], ['counterfactual', 'Counterfactuals']].map(([k, label]) => (
                  <button key={k} onClick={() => setTab(k as any)}
                    className={`px-4 py-1.5 rounded-lg text-xs font-medium transition-colors ${tab === k ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' : 'text-zinc-500 hover:text-white hover:bg-zinc-800'}`}>
                    {label}
                  </button>
                ))}
              </div>

              {tab === 'shap' && (
                <div className="glass rounded-2xl p-5">
                  <div className="text-xs font-semibold text-zinc-400 uppercase tracking-widest mb-4 flex items-center gap-1.5"><BarChart3 className="w-3.5 h-3.5" />Feature Contributions (SHAP)</div>
                  <div className="space-y-3">
                    {result.features.map(f => (
                      <div key={f.name}>
                        <div className="flex justify-between text-xs mb-1.5">
                          <span className="text-zinc-300">{f.name}</span>
                          <span className={f.type === 'positive' ? 'text-emerald-400' : 'text-red-400'}>{f.value > 0 ? '+' : ''}{f.value.toFixed(2)}</span>
                        </div>
                        <div className="h-2 bg-white/[0.06] rounded-full overflow-hidden">
                          <div className={`h-full rounded-full ${f.type === 'positive' ? 'bg-gradient-to-r from-emerald-600 to-emerald-400' : 'bg-gradient-to-r from-red-600 to-red-400'}`}
                            style={{ width: `${Math.abs(f.value) * 100}%`, marginLeft: f.type === 'negative' ? `${(1 - Math.abs(f.value)) * 100}%` : undefined }} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {tab === 'attention' && (
                <div className="glass rounded-2xl p-5">
                  <div className="text-xs font-semibold text-zinc-400 uppercase tracking-widest mb-4 flex items-center gap-1.5"><Brain className="w-3.5 h-3.5" />Attention Weights (Layer 4)</div>
                  <div className="grid grid-cols-8 gap-1">
                    {Array.from({ length: 64 }, (_, i) => {
                      const v = Math.pow(Math.random(), 2);
                      return <div key={i} className="h-8 rounded" style={{ backgroundColor: `rgba(16,185,129,${v.toFixed(2)})` }} title={v.toFixed(2)} />;
                    })}
                  </div>
                  <div className="flex items-center justify-between mt-3 text-[10px] text-zinc-500">
                    <span>Low attention</span><div className="flex-1 mx-3 h-1 bg-gradient-to-r from-zinc-800 to-emerald-500 rounded-full" /><span>High attention</span>
                  </div>
                </div>
              )}

              {tab === 'counterfactual' && (
                <div className="glass rounded-2xl p-5">
                  <div className="text-xs font-semibold text-zinc-400 uppercase tracking-widest mb-4">Counterfactual Explanations</div>
                  <div className="space-y-3">
                    {result.counterfactuals.map((cf, i) => (
                      <div key={i} className="flex gap-3 p-3 bg-amber-500/5 border border-amber-500/15 rounded-xl">
                        <span className="w-5 h-5 rounded-full bg-amber-500/20 text-amber-400 text-[10px] font-bold flex items-center justify-center flex-shrink-0">{i + 1}</span>
                        <span className="text-xs text-zinc-300 leading-relaxed">{cf}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}

          {!result && (
            <div className="text-center py-16 text-zinc-600">
              <FlaskConical className="w-12 h-12 mx-auto mb-3 text-zinc-700" />
              <div className="text-sm">Enter a recommendation or decision to explain</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
