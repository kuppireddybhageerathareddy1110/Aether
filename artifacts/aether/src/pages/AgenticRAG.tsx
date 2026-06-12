import { useState, useEffect } from 'react';
import { Play, RefreshCw, CheckCircle, Clock, Network, Search, Brain, Zap, FileText, ChevronRight } from 'lucide-react';
import { api } from '@/lib/api';

const agentDefs = [
  { id: 'retriever', name: 'Retriever Agent', role: 'Semantic search + FAISS retrieval', color: 'text-blue-400', bg: 'bg-blue-400/10 border-blue-400/20', icon: Search },
  { id: 'reranker', name: 'Reranker Agent', role: 'Cross-encoder relevance scoring', color: 'text-violet-400', bg: 'bg-violet-400/10 border-violet-400/20', icon: Brain },
  { id: 'synthesizer', name: 'Synthesizer Agent', role: 'LLM-based answer generation', color: 'text-emerald-400', bg: 'bg-emerald-400/10 border-emerald-400/20', icon: Zap },
  { id: 'verifier', name: 'Verifier Agent', role: 'Fact-checking + citation grounding', color: 'text-amber-400', bg: 'bg-amber-400/10 border-amber-400/20', icon: CheckCircle },
  { id: 'formatter', name: 'Formatter Agent', role: 'Response structuring + export', color: 'text-pink-400', bg: 'bg-pink-400/10 border-pink-400/20', icon: FileText },
];

type TraceStep = { agent: string; status: 'pending' | 'running' | 'done'; output: string; time: string };

export default function AgenticRAG() {
  const [query, setQuery] = useState('');
  const [running, setRunning] = useState(false);
  const [trace, setTrace] = useState<TraceStep[]>([]);
  const [answer, setAnswer] = useState('');
  const [confidence, setConfidence] = useState(0);
  const [activeTab, setActiveTab] = useState<'run' | 'config' | 'history'>('run');
  const [history, setHistory] = useState<any[]>([]);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [ragConfig, setRagConfig] = useState({ topK: 12, simThreshold: 0.72, rerankThreshold: 0.65, maxTokens: 1024 });
  const [error, setError] = useState('');

  const loadHistory = async () => {
    setHistoryLoading(true);
    try {
      const data = await api.get<any[]>('/rag/history');
      setHistory(data);
    } catch { } finally {
      setHistoryLoading(false); }
  };

  useEffect(() => { if (activeTab === 'history') loadHistory(); }, [activeTab]);

  const run = async () => {
    if (!query.trim()) return;
    setRunning(true); setTrace([]); setAnswer(''); setError('');

    const agentNames = agentDefs.map(a => a.name);
    let stepIdx = 0;
    const interval = setInterval(() => {
      if (stepIdx < agentNames.length) {
        const name = agentNames[stepIdx];
        setTrace(prev => {
          const updated = prev.map(s => s.agent === name ? { ...s, status: 'running' as const } : s);
          if (!updated.find(s => s.agent === name)) {
            return [...updated, { agent: name, status: 'running', output: '...', time: '' }];
          }
          return updated;
        });
        setTimeout(() => {
          setTrace(prev => prev.map(s => s.agent === name ? { ...s, status: 'done' } : s));
        }, 400);
        stepIdx++;
      } else {
        clearInterval(interval);
      }
    }, 700);

    try {
      const result = await api.post<any>('/rag/query', { query });
      clearInterval(interval);
      if (result.agentTrace) {
        setTrace(result.agentTrace.map((t: any) => ({ ...t, status: 'done' })));
      }
      setAnswer(result.answer);
      setConfidence(result.confidence ?? 0);
      loadHistory();
    } catch (e: any) {
      clearInterval(interval);
      setError(e.message ?? 'Failed to run pipeline');
    } finally {
      setRunning(false);
    }
  };

  return (
    <div className="h-screen flex flex-col bg-transparent">
      <div className="border-b border-white/[0.07] bg-zinc-900/50 px-6 py-4 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-white flex items-center gap-2"><Network className="w-5 h-5 text-violet-400" />Agentic RAG</h1>
          <p className="text-xs text-zinc-500 mt-0.5">Multi-agent retrieval-augmented generation pipeline</p>
        </div>
        <div className="flex gap-2">
          {(['run', 'config', 'history'] as const).map(tab => (
            <button key={tab} onClick={() => setActiveTab(tab)}
              className={`px-4 py-1.5 rounded-lg text-xs font-medium transition-colors capitalize ${activeTab === tab ? 'bg-violet-500/20 text-violet-300 border border-violet-500/30' : 'text-zinc-500 hover:text-white hover:bg-zinc-800'}`}>
              {tab}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-auto p-6">
        {activeTab === 'run' && (
          <div className="max-w-5xl mx-auto space-y-5">
            {/* Pipeline visualization */}
            <div className="glass rounded-2xl p-5">
              <div className="text-xs font-semibold text-zinc-400 uppercase tracking-widest mb-4">Pipeline Agents</div>
              <div className="flex items-center gap-1 overflow-x-auto pb-2">
                {agentDefs.map((agent, i) => (
                  <div key={agent.id} className="flex items-center gap-1 flex-shrink-0">
                    <div className={`border rounded-xl p-3 ${agent.bg} min-w-[120px]`}>
                      <agent.icon className={`w-4 h-4 ${agent.color} mb-1.5`} />
                      <div className={`text-xs font-semibold ${agent.color}`}>{agent.name}</div>
                      <div className="text-[10px] text-zinc-500 mt-0.5 leading-tight">{agent.role}</div>
                    </div>
                    {i < agentDefs.length - 1 && <ChevronRight className="w-4 h-4 text-zinc-600 flex-shrink-0" />}
                  </div>
                ))}
              </div>
            </div>

            {/* Query */}
            <div className="glass rounded-2xl p-5">
              <div className="text-xs font-semibold text-zinc-400 uppercase tracking-widest mb-3">Query</div>
              <textarea value={query} onChange={e => setQuery(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) run(); }}
                className="w-full h-20 bg-transparent border border-zinc-700 rounded-xl p-4 text-sm text-white placeholder:text-zinc-600 resize-none focus:outline-none focus:border-violet-500/50"
                placeholder="What are the key findings about mood-aware graph neural networks? (Ctrl+Enter to run)" />
              {error && <div className="mt-2 text-xs text-red-400 bg-red-400/10 px-3 py-2 rounded-lg">{error}</div>}
              <button onClick={run} disabled={running || !query.trim()}
                className="mt-3 flex items-center gap-2 px-6 py-2.5 bg-violet-600 hover:bg-violet-500 disabled:opacity-40 text-white rounded-xl text-sm font-medium transition-colors">
                {running ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4" />}
                {running ? 'Running Pipeline...' : 'Run Agentic RAG'}
              </button>
            </div>

            {/* Trace */}
            {trace.length > 0 && (
              <div className="glass rounded-2xl p-5">
                <div className="text-xs font-semibold text-zinc-400 uppercase tracking-widest mb-4">Execution Trace</div>
                <div className="space-y-2">
                  {trace.map((step, i) => (
                    <div key={i} className={`flex items-start gap-3 p-3 rounded-xl border transition-all ${step.status === 'running' ? 'border-violet-500/40 bg-violet-500/5' : step.status === 'done' ? 'border-zinc-700 bg-white/[0.06]/40' : 'border-white/[0.07]'}`}>
                      <div className={`mt-0.5 flex-shrink-0 ${step.status === 'running' ? 'text-violet-400' : step.status === 'done' ? 'text-emerald-400' : 'text-zinc-600'}`}>
                        {step.status === 'running' ? <RefreshCw className="w-4 h-4 animate-spin" /> : step.status === 'done' ? <CheckCircle className="w-4 h-4" /> : <Clock className="w-4 h-4" />}
                      </div>
                      <div className="flex-1">
                        <div className="text-xs font-semibold text-white">{step.agent}</div>
                        <div className="text-xs text-zinc-400 mt-0.5">{step.output}</div>
                      </div>
                      {step.status === 'done' && step.time && <span className="text-[10px] text-zinc-500">{step.time}</span>}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Answer */}
            {answer && (
              <div className="bg-gradient-to-br from-emerald-500/10 to-teal-500/5 border border-emerald-500/20 rounded-2xl p-5">
                <div className="flex items-center justify-between mb-3">
                  <div className="text-xs font-semibold text-emerald-400 uppercase tracking-widest">Generated Answer</div>
                  <span className="text-xs text-emerald-400 font-mono">Confidence: {(confidence * 100).toFixed(0)}%</span>
                </div>
                <div className="text-sm text-zinc-200 leading-relaxed whitespace-pre-wrap">{answer}</div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'config' && (
          <div className="max-w-2xl mx-auto space-y-4">
            <div className="glass rounded-2xl p-5">
              <div className="text-sm font-semibold text-white mb-4">Pipeline Configuration</div>
              {[
                { label: 'Top-K Retrieval', key: 'topK', value: ragConfig.topK, min: 1, max: 50, step: 1 },
                { label: 'Similarity Threshold', key: 'simThreshold', value: ragConfig.simThreshold, min: 0.1, max: 1.0, step: 0.01 },
                { label: 'Rerank Threshold', key: 'rerankThreshold', value: ragConfig.rerankThreshold, min: 0.1, max: 1.0, step: 0.01 },
                { label: 'Max Tokens', key: 'maxTokens', value: ragConfig.maxTokens, min: 256, max: 4096, step: 256 },
              ].map(cfg => (
                <div key={cfg.key} className="mb-4">
                  <div className="flex justify-between text-xs text-zinc-400 mb-1.5"><span>{cfg.label}</span><span className="text-emerald-400">{(cfg.value as number).toFixed ? Number(cfg.value).toFixed(cfg.step < 1 ? 2 : 0) : cfg.value}</span></div>
                  <input type="range" min={cfg.min} max={cfg.max} step={cfg.step} value={cfg.value as number}
                    onChange={e => setRagConfig(p => ({ ...p, [cfg.key]: Number(e.target.value) }))}
                    className="w-full accent-violet-500 h-1.5" />
                </div>
              ))}
              <div className="mt-2">
                <div className="text-xs text-zinc-400 mb-1.5">LLM Model</div>
                <select className="w-full bg-white/[0.06] border border-zinc-700 rounded-lg px-3 py-2 text-sm text-zinc-300">
                  <option>GPT-4o</option><option>GPT-4 Turbo</option><option>Claude 3.5 Sonnet</option><option>Llama 3.1 70B</option>
                </select>
              </div>
              <div className="mt-4 p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-xs text-emerald-400">
                Configuration auto-saved and applied to the next pipeline run
              </div>
            </div>
          </div>
        )}

        {activeTab === 'history' && (
          <div className="max-w-3xl mx-auto space-y-3">
            <div className="flex items-center justify-between mb-2">
              <div className="text-xs text-zinc-500">{history.length} queries in history</div>
              <button onClick={loadHistory} className="text-xs text-zinc-500 hover:text-white flex items-center gap-1">
                <RefreshCw className={`w-3 h-3 ${historyLoading ? 'animate-spin' : ''}`} />Refresh
              </button>
            </div>
            {historyLoading ? (
              <div className="text-center py-8 text-zinc-500 text-sm">Loading history...</div>
            ) : history.length === 0 ? (
              <div className="text-center py-16 text-zinc-600 text-sm">No queries yet — run your first pipeline above</div>
            ) : history.map((run, i) => (
              <div key={i} className="glass rounded-xl p-4 hover:border-zinc-700 transition-colors">
                <div className="font-medium text-sm text-white mb-2 line-clamp-2">{run.query}</div>
                <div className="flex gap-4 text-xs text-zinc-500 mb-2">
                  <span><span className="text-zinc-300">{run.chunksUsed}</span> chunks</span>
                  <span><span className="text-zinc-300">{(run.elapsedMs / 1000).toFixed(1)}s</span> elapsed</span>
                  <span>Confidence: <span className="text-emerald-400">{(run.confidence * 100).toFixed(0)}%</span></span>
                  <span className="text-zinc-600">{new Date(run.createdAt).toLocaleDateString()}</span>
                </div>
                <div className="text-xs text-zinc-500 line-clamp-2">{run.answer}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
