import { useState } from 'react';
import { Play, RefreshCw, CheckCircle, Clock, Zap, Network, Database, Search, Brain, FileText, ChevronRight } from 'lucide-react';

const agentDefs = [
  { id: 'retriever', name: 'Retriever Agent', role: 'Semantic search + FAISS retrieval', color: 'text-blue-400', bg: 'bg-blue-400/10 border-blue-400/20', icon: Search },
  { id: 'reranker', name: 'Reranker Agent', role: 'Cross-encoder relevance scoring', color: 'text-violet-400', bg: 'bg-violet-400/10 border-violet-400/20', icon: Brain },
  { id: 'synthesizer', name: 'Synthesizer Agent', role: 'LLM-based answer generation', color: 'text-emerald-400', bg: 'bg-emerald-400/10 border-emerald-400/20', icon: Zap },
  { id: 'verifier', name: 'Verifier Agent', role: 'Fact-checking + citation grounding', color: 'text-amber-400', bg: 'bg-amber-400/10 border-amber-400/20', icon: CheckCircle },
  { id: 'formatter', name: 'Formatter Agent', role: 'Response structuring + export', color: 'text-pink-400', bg: 'bg-pink-400/10 border-pink-400/20', icon: FileText },
];

const runHistory = [
  { query: 'What are the key methods in mood-aware GNNs?', agents: 5, chunks: 12, time: '3.2s', confidence: 0.94 },
  { query: 'Compare SHAP vs LIME for graph explanations', agents: 5, chunks: 9, time: '2.8s', confidence: 0.91 },
  { query: 'RAG evaluation benchmarks overview', agents: 4, chunks: 7, time: '2.1s', confidence: 0.87 },
];

type TraceStep = { agent: string; status: 'pending' | 'running' | 'done'; output: string; time: string };

export default function AgenticRAG() {
  const [query, setQuery] = useState('');
  const [running, setRunning] = useState(false);
  const [trace, setTrace] = useState<TraceStep[]>([]);
  const [answer, setAnswer] = useState('');
  const [activeTab, setActiveTab] = useState<'run' | 'config' | 'history'>('run');

  const run = async () => {
    if (!query.trim()) return;
    setRunning(true);
    setTrace([]);
    setAnswer('');

    const steps: Omit<TraceStep, 'status'>[] = [
      { agent: 'Retriever Agent', output: `Found 12 relevant chunks (top-k=12, cosine sim>0.72)`, time: '0.4s' },
      { agent: 'Reranker Agent', output: `Re-ranked to 6 chunks (cross-encoder, threshold=0.65)`, time: '0.8s' },
      { agent: 'Synthesizer Agent', output: `Generated 3-paragraph answer using GPT-4o`, time: '1.6s' },
      { agent: 'Verifier Agent', output: `Verified 3/3 claims with source citations`, time: '0.9s' },
      { agent: 'Formatter Agent', output: `Structured output with 4 citations, markdown formatted`, time: '0.3s' },
    ];

    for (let i = 0; i < steps.length; i++) {
      await new Promise(r => setTimeout(r, 700));
      setTrace(prev => [...prev, { ...steps[i], status: 'running' }]);
      await new Promise(r => setTimeout(r, 400));
      setTrace(prev => prev.map((s, idx) => idx === i ? { ...s, status: 'done' } : s));
    }

    setAnswer(`Based on ${query}, here is what I found:\n\nThe literature identifies three primary approaches: (1) graph attention networks with mood-conditional gating, (2) temporal GNNs with affective state embeddings, and (3) multi-modal fusion architectures combining text sentiment with graph topology.\n\n**Key Finding**: Mood-conditional graph attention achieves 31% higher centrality prediction accuracy compared to standard GAT baselines (Chen et al., 2024).\n\n**Confidence**: 94% | **Sources**: 6 chunks from 3 documents`);
    setRunning(false);
  };

  return (
    <div className="h-screen flex flex-col bg-zinc-950">
      {/* Header */}
      <div className="border-b border-zinc-800 bg-zinc-900/50 px-6 py-4 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-white flex items-center gap-2">
            <Network className="w-5 h-5 text-violet-400" />Agentic RAG
          </h1>
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
          <div className="max-w-5xl mx-auto space-y-6">
            {/* Agent pipeline visualization */}
            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5">
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

            {/* Query input */}
            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5">
              <div className="text-xs font-semibold text-zinc-400 uppercase tracking-widest mb-3">Query</div>
              <textarea
                value={query}
                onChange={e => setQuery(e.target.value)}
                className="w-full h-20 bg-zinc-950 border border-zinc-700 rounded-xl p-4 text-sm text-white placeholder:text-zinc-600 resize-none focus:outline-none focus:border-violet-500/50"
                placeholder="What are the key findings about mood-aware graph neural networks?"
              />
              <button onClick={run} disabled={running || !query.trim()}
                className="mt-3 flex items-center gap-2 px-6 py-2.5 bg-violet-600 hover:bg-violet-500 disabled:opacity-40 text-white rounded-xl text-sm font-medium transition-colors">
                {running ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4" />}
                {running ? 'Running Pipeline...' : 'Run Agentic RAG'}
              </button>
            </div>

            {/* Execution trace */}
            {trace.length > 0 && (
              <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5">
                <div className="text-xs font-semibold text-zinc-400 uppercase tracking-widest mb-4">Execution Trace</div>
                <div className="space-y-2">
                  {trace.map((step, i) => (
                    <div key={i} className={`flex items-start gap-3 p-3 rounded-xl border transition-all ${
                      step.status === 'running' ? 'border-violet-500/40 bg-violet-500/5' :
                      step.status === 'done' ? 'border-zinc-700 bg-zinc-800/40' :
                      'border-zinc-800'
                    }`}>
                      <div className={`mt-0.5 flex-shrink-0 ${step.status === 'running' ? 'text-violet-400' : step.status === 'done' ? 'text-emerald-400' : 'text-zinc-600'}`}>
                        {step.status === 'running' ? <RefreshCw className="w-4 h-4 animate-spin" /> :
                         step.status === 'done' ? <CheckCircle className="w-4 h-4" /> : <Clock className="w-4 h-4" />}
                      </div>
                      <div className="flex-1">
                        <div className="text-xs font-semibold text-white">{step.agent}</div>
                        <div className="text-xs text-zinc-400 mt-0.5">{step.output}</div>
                      </div>
                      {step.status === 'done' && <span className="text-[10px] text-zinc-500">{step.time}</span>}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Answer */}
            {answer && (
              <div className="bg-gradient-to-br from-emerald-500/10 to-teal-500/5 border border-emerald-500/20 rounded-2xl p-5">
                <div className="text-xs font-semibold text-emerald-400 uppercase tracking-widest mb-3">Generated Answer</div>
                <div className="text-sm text-zinc-200 leading-relaxed whitespace-pre-wrap">{answer}</div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'config' && (
          <div className="max-w-2xl mx-auto space-y-4">
            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5">
              <div className="text-sm font-semibold text-white mb-4">Pipeline Configuration</div>
              {[
                { label: 'Top-K Retrieval', key: 'topk', value: 12, min: 1, max: 50 },
                { label: 'Similarity Threshold', key: 'sim', value: 0.72, min: 0.1, max: 1.0, step: 0.01 },
                { label: 'Rerank Threshold', key: 'rerank', value: 0.65, min: 0.1, max: 1.0, step: 0.01 },
                { label: 'Max Tokens', key: 'tokens', value: 1024, min: 256, max: 4096, step: 256 },
              ].map(cfg => (
                <div key={cfg.key} className="mb-4">
                  <div className="flex justify-between text-xs text-zinc-400 mb-1.5">
                    <span>{cfg.label}</span><span className="text-emerald-400">{cfg.value}</span>
                  </div>
                  <input type="range" min={cfg.min} max={cfg.max} step={cfg.step || 1} defaultValue={cfg.value}
                    className="w-full accent-violet-500 h-1.5" />
                </div>
              ))}
              <div className="mt-2">
                <div className="text-xs text-zinc-400 mb-1.5">LLM Model</div>
                <select className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-zinc-300">
                  <option>GPT-4o</option><option>GPT-4 Turbo</option><option>Claude 3.5 Sonnet</option><option>Llama 3.1 70B</option>
                </select>
              </div>
            </div>
            {agentDefs.map(agent => (
              <div key={agent.id} className={`border rounded-xl p-4 ${agent.bg}`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <agent.icon className={`w-4 h-4 ${agent.color}`} />
                    <span className={`text-sm font-semibold ${agent.color}`}>{agent.name}</span>
                  </div>
                  <button className={`w-10 h-5 rounded-full bg-emerald-500 relative`}>
                    <div className="absolute top-0.5 left-5 w-4 h-4 bg-white rounded-full shadow" />
                  </button>
                </div>
                <div className="text-xs text-zinc-500 mt-1">{agent.role}</div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'history' && (
          <div className="max-w-3xl mx-auto space-y-3">
            {runHistory.map((run, i) => (
              <div key={i} className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 hover:border-zinc-700 transition-colors">
                <div className="font-medium text-sm text-white mb-2">{run.query}</div>
                <div className="flex gap-4 text-xs text-zinc-500">
                  <span><span className="text-zinc-300">{run.agents}</span> agents</span>
                  <span><span className="text-zinc-300">{run.chunks}</span> chunks</span>
                  <span><span className="text-zinc-300">{run.time}</span> elapsed</span>
                  <span>Confidence: <span className="text-emerald-400">{(run.confidence * 100).toFixed(0)}%</span></span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
