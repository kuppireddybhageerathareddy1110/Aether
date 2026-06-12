import { useState } from 'react';
import { FlaskConical, AlertTriangle, TrendingUp, Activity } from 'lucide-react';

const shapFeatures = [
  { name: 'betweenness_centrality', value: 0.42, positive: true },
  { name: 'mood_score', value: 0.31, positive: true },
  { name: 'paper_freshness', value: 0.28, positive: true },
  { name: 'citation_count', value: 0.19, positive: true },
  { name: 'author_h_index', value: 0.14, positive: true },
  { name: 'topic_coherence', value: -0.09, positive: false },
  { name: 'reading_time', value: -0.17, positive: false },
  { name: 'complexity_score', value: -0.23, positive: false },
];

const tokens = ['The', 'graph', 'attention', 'mechanism', 'enables', 'mood-aware', 'node', 'representations'];
const attentionMatrix = tokens.map((_, i) =>
  tokens.map((_, j) => {
    const base = Math.abs(Math.sin(i * 3.7 + j * 2.1));
    return i === j ? 0.9 : base * 0.6;
  })
);

const decisionTrace = [
  { step: 'Input Encoding', confidence: 0.52, desc: 'Raw features encoded to 256-dim embedding' },
  { step: 'Graph Attention Layer 1', confidence: 0.67, desc: 'Local neighborhood aggregation (k=2)' },
  { step: 'Mood Gating', confidence: 0.74, desc: 'Mood state modulates attention weights' },
  { step: 'Graph Attention Layer 2', confidence: 0.81, desc: 'Deep structural feature extraction' },
  { step: 'Global Pooling', confidence: 0.89, desc: 'Graph-level representation aggregation' },
  { step: 'Classification Head', confidence: 0.94, desc: 'Final prediction with confidence 94%' },
];

const radarAxes = ['Faithfulness', 'Completeness', 'Stability', 'Consistency', 'Plausibility'];
const radarValues = [0.92, 0.78, 0.85, 0.88, 0.71];

export default function XAIDashboard() {
  const [selectedToken, setSelectedToken] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState<'shap' | 'attention' | 'trace' | 'quality'>('shap');

  const cx = 120, cy = 120, r = 90;
  const getPoint = (i: number, v: number) => {
    const angle = (Math.PI * 2 * i) / radarAxes.length - Math.PI / 2;
    return [cx + v * r * Math.cos(angle), cy + v * r * Math.sin(angle)];
  };
  const polyPoints = radarValues.map((v, i) => getPoint(i, v).join(',')).join(' ');

  return (
    <div className="h-screen flex flex-col bg-zinc-950">
      <div className="border-b border-zinc-800 bg-zinc-900/50 px-6 py-4">
        <h1 className="text-xl font-bold text-white flex items-center gap-2">
          <FlaskConical className="w-5 h-5 text-amber-400" />XAI Lab
        </h1>
        <p className="text-xs text-zinc-500 mt-0.5">SHAP analysis, attention inspection, and explanation quality</p>
      </div>

      <div className="border-b border-zinc-800 px-6">
        <div className="flex gap-1 py-2">
          {[['shap', 'SHAP Features'], ['attention', 'Attention Heatmap'], ['trace', 'Decision Trace'], ['quality', 'Quality Radar']] .map(([k, label]) => (
            <button key={k} onClick={() => setActiveTab(k as any)}
              className={`px-4 py-1.5 rounded-lg text-xs font-medium transition-colors ${activeTab === k ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' : 'text-zinc-500 hover:text-white hover:bg-zinc-800'}`}>
              {label}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-auto p-6">
        {activeTab === 'shap' && (
          <div className="max-w-3xl mx-auto space-y-4">
            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5">
              <div className="text-xs font-semibold text-zinc-400 uppercase tracking-widest mb-4">SHAP Feature Importance</div>
              <div className="space-y-3">
                {shapFeatures.map(f => (
                  <div key={f.name}>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-zinc-300 font-mono">{f.name}</span>
                      <span className={f.positive ? 'text-emerald-400' : 'text-red-400'}>
                        {f.positive ? '+' : ''}{f.value.toFixed(2)}
                      </span>
                    </div>
                    <div className="h-5 bg-zinc-800 rounded-full overflow-hidden flex items-center">
                      {f.positive ? (
                        <div style={{ width: `${Math.abs(f.value) / 0.5 * 100}%`, marginLeft: '50%' }}
                          className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full" />
                      ) : (
                        <div style={{ width: `${Math.abs(f.value) / 0.5 * 100}%`, marginRight: '50%', marginLeft: 'auto' }}
                          className="h-full bg-gradient-to-l from-red-500 to-rose-400 rounded-full" />
                      )}
                    </div>
                  </div>
                ))}
              </div>
              <div className="flex justify-center items-center gap-8 mt-4 text-xs">
                <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded bg-emerald-500" /><span className="text-zinc-500">Positive impact</span></div>
                <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded bg-red-500" /><span className="text-zinc-500">Negative impact</span></div>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 text-center">
                <div className="text-2xl font-bold text-emerald-400">0.94</div>
                <div className="text-xs text-zinc-500 mt-1">Model Confidence</div>
              </div>
              <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 text-center">
                <div className="text-2xl font-bold text-amber-400">8</div>
                <div className="text-xs text-zinc-500 mt-1">Features Analyzed</div>
              </div>
              <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 text-center">
                <div className="text-2xl font-bold text-violet-400">0.42</div>
                <div className="text-xs text-zinc-500 mt-1">Top Feature SHAP</div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'attention' && (
          <div className="max-w-3xl mx-auto space-y-4">
            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5">
              <div className="text-xs font-semibold text-zinc-400 uppercase tracking-widest mb-1">Self-Attention Heatmap</div>
              <p className="text-xs text-zinc-600 mb-4">Click any token to inspect its attention profile</p>
              <div className="flex flex-wrap gap-2 mb-4">
                {tokens.map((tok, i) => (
                  <button key={i} onClick={() => setSelectedToken(i === selectedToken ? null : i)}
                    className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${selectedToken === i ? 'bg-amber-500/30 text-amber-300 border border-amber-500/50' : 'bg-zinc-800 text-zinc-300 hover:bg-zinc-700'}`}>
                    {tok}
                  </button>
                ))}
              </div>
              <div className="overflow-auto">
                <table className="w-full text-xs border-collapse">
                  <thead>
                    <tr>
                      <th className="p-1 text-zinc-600 text-left w-24">→</th>
                      {tokens.map(t => <th key={t} className={`p-1 text-[10px] font-normal rotate-45 text-zinc-500 w-10`}>{t}</th>)}
                    </tr>
                  </thead>
                  <tbody>
                    {tokens.map((row, i) => (
                      <tr key={i}>
                        <td className={`p-1 text-[10px] font-mono pr-3 ${selectedToken === i ? 'text-amber-400' : 'text-zinc-500'}`}>{row}</td>
                        {attentionMatrix[i].map((val, j) => (
                          <td key={j} className="p-0.5">
                            <div
                              className="w-8 h-8 rounded transition-all"
                              style={{
                                backgroundColor: selectedToken === i
                                  ? `rgba(245, 158, 11, ${val})`
                                  : `rgba(16, 185, 129, ${val})`
                              }}
                              title={`${tokens[i]} → ${tokens[j]}: ${val.toFixed(2)}`}
                            />
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {selectedToken !== null && (
                <div className="mt-4 p-3 bg-amber-500/10 border border-amber-500/20 rounded-xl">
                  <div className="text-xs font-semibold text-amber-400 mb-2">Token: "{tokens[selectedToken]}" attention profile</div>
                  <div className="flex flex-wrap gap-2">
                    {tokens.map((tok, j) => (
                      <div key={j} className="flex items-center gap-1 text-[10px]">
                        <div className="w-4 h-4 rounded" style={{ backgroundColor: `rgba(245,158,11,${attentionMatrix[selectedToken][j]})` }} />
                        <span className="text-zinc-400">{tok}: {attentionMatrix[selectedToken][j].toFixed(2)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'trace' && (
          <div className="max-w-2xl mx-auto space-y-3">
            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5">
              <div className="text-xs font-semibold text-zinc-400 uppercase tracking-widest mb-4">Decision Trace</div>
              <div className="space-y-3">
                {decisionTrace.map((step, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <div className="flex flex-col items-center">
                      <div className="w-7 h-7 rounded-full bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-xs font-bold text-amber-400">{i + 1}</div>
                      {i < decisionTrace.length - 1 && <div className="w-px h-4 bg-zinc-700 mt-1" />}
                    </div>
                    <div className="flex-1 pb-2">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-semibold text-white">{step.step}</span>
                        <span className="text-xs text-emerald-400 font-mono">{(step.confidence * 100).toFixed(0)}%</span>
                      </div>
                      <div className="h-1.5 bg-zinc-800 rounded-full overflow-hidden mb-1.5">
                        <div className="h-full bg-gradient-to-r from-amber-500 to-yellow-400 rounded-full transition-all"
                          style={{ width: `${step.confidence * 100}%` }} />
                      </div>
                      <div className="text-xs text-zinc-500">{step.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-gradient-to-br from-amber-500/10 to-yellow-500/5 border border-amber-500/20 rounded-xl p-4">
              <div className="text-xs text-amber-400 font-semibold mb-1">Counterfactual Explanation</div>
              <div className="text-sm text-zinc-300">If <span className="text-amber-300">mood_score</span> decreased by 0.5, the prediction confidence would drop from <span className="text-emerald-400">94%</span> to <span className="text-red-400">47%</span></div>
            </div>
          </div>
        )}

        {activeTab === 'quality' && (
          <div className="max-w-2xl mx-auto space-y-4">
            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5">
              <div className="text-xs font-semibold text-zinc-400 uppercase tracking-widest mb-4">Explanation Quality Radar</div>
              <div className="flex justify-center">
                <svg width="240" height="240" viewBox="0 0 240 240">
                  {[0.2, 0.4, 0.6, 0.8, 1.0].map(level => (
                    <polygon key={level}
                      points={radarAxes.map((_, i) => getPoint(i, level).join(',')).join(' ')}
                      fill="none" stroke="#27272a" strokeWidth="1" />
                  ))}
                  {radarAxes.map((_, i) => {
                    const [x, y] = getPoint(i, 1);
                    return <line key={i} x1={cx} y1={cy} x2={x} y2={y} stroke="#27272a" strokeWidth="1" />;
                  })}
                  <polygon points={polyPoints} fill="rgba(245,158,11,0.15)" stroke="#f59e0b" strokeWidth="2" />
                  {radarAxes.map((axis, i) => {
                    const [x, y] = getPoint(i, 1.18);
                    return <text key={i} x={x} y={y} textAnchor="middle" fill="#a1a1aa" fontSize="9">{axis}</text>;
                  })}
                  {radarValues.map((v, i) => {
                    const [x, y] = getPoint(i, v);
                    return <circle key={i} cx={x} cy={y} r="4" fill="#f59e0b" />;
                  })}
                </svg>
              </div>
              <div className="grid grid-cols-5 gap-2 mt-2">
                {radarAxes.map((axis, i) => (
                  <div key={axis} className="text-center">
                    <div className="text-sm font-bold text-amber-400">{(radarValues[i] * 100).toFixed(0)}%</div>
                    <div className="text-[9px] text-zinc-500">{axis}</div>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4">
              <div className="text-xs font-semibold text-zinc-400 mb-3">Anomaly Detection</div>
              {[
                { name: 'Feature Distribution Shift', severity: 'low', score: 0.12 },
                { name: 'Attention Pattern Anomaly', severity: 'medium', score: 0.34 },
                { name: 'Prediction Confidence Drop', severity: 'high', score: 0.71 },
              ].map(a => (
                <div key={a.name} className="flex items-center justify-between py-2 border-b border-zinc-800 last:border-0">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className={`w-3.5 h-3.5 ${a.severity === 'high' ? 'text-red-400' : a.severity === 'medium' ? 'text-amber-400' : 'text-green-400'}`} />
                    <span className="text-xs text-zinc-300">{a.name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-16 h-1.5 bg-zinc-700 rounded-full overflow-hidden">
                      <div className={`h-full rounded-full ${a.severity === 'high' ? 'bg-red-400' : a.severity === 'medium' ? 'bg-amber-400' : 'bg-emerald-400'}`}
                        style={{ width: `${a.score * 100}%` }} />
                    </div>
                    <span className="text-[10px] text-zinc-500 w-8">{a.score.toFixed(2)}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
