import { useState, useEffect } from 'react';
import { GitBranch, Play, Trash2, RefreshCw, Eye } from 'lucide-react';
import { api } from '@/lib/api';

interface GraphRecord { id: number; name: string; sourceDoc: string; nodeCount: number; edgeCount: number; nodes: any[]; edges: any[]; status: string; createdAt: string; }

export default function KnowledgeGraph() {
  const [topic, setTopic] = useState('');
  const [generating, setGenerating] = useState(false);
  const [graphs, setGraphs] = useState<GraphRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<GraphRecord | null>(null);
  const [error, setError] = useState('');

  const loadGraphs = async () => {
    setLoading(true);
    try { const data = await api.get<GraphRecord[]>('/graphs'); setGraphs(data); }
    catch { } finally { setLoading(false); }
  };

  useEffect(() => { loadGraphs(); }, []);

  const generate = async () => {
    if (!topic.trim()) { setError('Please enter a topic'); return; }
    setGenerating(true); setError('');
    try {
      const graph = await api.post<GraphRecord>('/graphs/generate', { topic, sourceDoc: 'manual' });
      setGraphs(prev => [graph, ...prev]);
      setSelected(graph);
      setTopic('');
    } catch (e: any) { setError(e.message ?? 'Failed to generate graph'); }
    finally { setGenerating(false); }
  };

  const deleteGraph = async (id: number) => {
    try { await api.delete(`/graphs/${id}`); setGraphs(prev => prev.filter(g => g.id !== id)); if (selected?.id === id) setSelected(null); }
    catch { }
  };

  return (
    <div className="h-screen flex flex-col bg-transparent">
      <div className="border-b border-white/[0.07] bg-zinc-900/50 px-6 py-4">
        <h1 className="text-xl font-bold text-white flex items-center gap-2"><GitBranch className="w-5 h-5 text-emerald-400" />Knowledge Graph</h1>
        <p className="text-xs text-zinc-500 mt-0.5">Generate and explore knowledge graphs from topics and documents</p>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Left: generate + list */}
        <div className="w-72 border-r border-white/[0.07] flex flex-col bg-zinc-900/20">
          <div className="p-4 border-b border-white/[0.07]">
            <div className="text-xs font-semibold text-zinc-400 uppercase tracking-widest mb-3">Generate Graph</div>
            <input value={topic} onChange={e => setTopic(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && generate()}
              className="w-full glass border border-zinc-700 rounded-xl px-3 py-2 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:border-emerald-500/50 mb-2"
              placeholder="Topic (e.g. 'Attention Mechanisms')" />
            {error && <div className="text-xs text-red-400 mb-2">{error}</div>}
            <button onClick={generate} disabled={generating || !topic.trim()}
              className="w-full flex items-center justify-center gap-2 py-2 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 text-white rounded-xl text-xs font-medium transition-colors">
              {generating ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Play className="w-3.5 h-3.5" />}
              {generating ? 'Generating...' : 'Generate Graph'}
            </button>
          </div>

          <div className="flex-1 overflow-auto p-3">
            <div className="flex items-center justify-between mb-2">
              <div className="text-xs text-zinc-500">{graphs.length} graphs</div>
              <button onClick={loadGraphs} className="text-zinc-600 hover:text-zinc-400">
                <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
              </button>
            </div>
            {loading ? <div className="text-center py-4 text-zinc-600 text-xs">Loading...</div>
              : graphs.length === 0 ? <div className="text-center py-8 text-zinc-600 text-xs">No graphs yet — generate one above</div>
              : graphs.map(g => (
                <div key={g.id}
                  className={`p-3 rounded-xl mb-2 cursor-pointer transition-all border ${selected?.id === g.id ? 'border-emerald-500/40 bg-emerald-500/5' : 'border-white/[0.07] hover:border-zinc-700 bg-zinc-900/50'}`}
                  onClick={() => setSelected(g)}>
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <div className="text-xs font-semibold text-white truncate">{g.name}</div>
                      <div className="text-[10px] text-zinc-500 mt-0.5">{g.nodeCount} nodes · {g.edgeCount} edges</div>
                    </div>
                    <button onClick={e => { e.stopPropagation(); deleteGraph(g.id); }}
                      className="p-1 text-zinc-600 hover:text-red-400 transition-colors flex-shrink-0">
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              ))}
          </div>
        </div>

        {/* Right: graph canvas */}
        <div className="flex-1 flex flex-col">
          {selected ? (
            <>
              <div className="border-b border-white/[0.07] px-5 py-3 flex items-center justify-between">
                <div>
                  <div className="text-sm font-semibold text-white">{selected.name}</div>
                  <div className="text-xs text-zinc-500">{selected.nodeCount} nodes · {selected.edgeCount} edges · {new Date(selected.createdAt).toLocaleDateString()}</div>
                </div>
                <div className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-emerald-400" /><span className="text-xs text-emerald-400">Complete</span></div>
              </div>
              <div className="flex-1 relative bg-transparent overflow-hidden">
                <svg width="100%" height="100%" viewBox="0 0 500 400">
                  {selected.edges.map((edge: any) => {
                    const source = selected.nodes.find((n: any) => n.id === edge.source);
                    const target = selected.nodes.find((n: any) => n.id === edge.target);
                    if (!source || !target) return null;
                    return <line key={edge.id} x1={source.x} y1={source.y} x2={target.x} y2={target.y} stroke="#27272a" strokeWidth="1.5" strokeOpacity={edge.weight ?? 0.5} />;
                  })}
                  {selected.nodes.map((node: any, i: number) => (
                    <g key={node.id}>
                      <circle cx={node.x} cy={node.y} r={node.size ?? 10} fill={i === 0 ? '#10b981' : '#3f3f46'} stroke={i === 0 ? '#34d399' : '#52525b'} strokeWidth="1.5" />
                      <text x={node.x} y={node.y + (node.size ?? 10) + 12} textAnchor="middle" fill="#a1a1aa" fontSize="9">{node.label?.split(' ').slice(0, 2).join(' ')}</text>
                    </g>
                  ))}
                </svg>
              </div>
              <div className="border-t border-white/[0.07] px-5 py-3 flex gap-6">
                {[
                  { label: 'Nodes', value: selected.nodeCount },
                  { label: 'Edges', value: selected.edgeCount },
                  { label: 'Density', value: (selected.edgeCount / Math.max(selected.nodeCount, 1)).toFixed(2) },
                  { label: 'Avg Degree', value: ((2 * selected.edgeCount) / Math.max(selected.nodeCount, 1)).toFixed(1) },
                ].map(s => (
                  <div key={s.label}><div className="text-lg font-bold text-white">{s.value}</div><div className="text-[10px] text-zinc-500">{s.label}</div></div>
                ))}
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-zinc-600">
              <div className="text-center">
                <Eye className="w-12 h-12 mx-auto mb-3 text-zinc-700" />
                <div className="text-sm">Generate a graph or select one from the list</div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
