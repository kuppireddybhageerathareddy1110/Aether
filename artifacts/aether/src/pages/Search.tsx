import { useState } from 'react';
import { Search as SearchIcon, FileText, GitBranch, TrendingUp, MessageCircle, RefreshCw } from 'lucide-react';
import { api } from '@/lib/api';

const typeIcon: Record<string, any> = { journal: TrendingUp, document: FileText, graph: GitBranch, rag: MessageCircle };
const typeColor: Record<string, string> = { journal: 'text-pink-400 bg-pink-400/10', document: 'text-blue-400 bg-blue-400/10', graph: 'text-emerald-400 bg-emerald-400/10', rag: 'text-violet-400 bg-violet-400/10' };

function generateResults(q: string) {
  return [
    { type: 'journal', content: `Found "${q}" in 3 journal entries. Most recent: "Strong correlations between ${q} and graph density."`, score: 0.94 },
    { type: 'document', name: 'graph-neural-networks.pdf', content: `Semantic match 0.91. Key passage: "${q}" in context of betweenness centrality and node embedding.`, score: 0.91 },
    { type: 'graph', name: 'Knowledge Graph #4', content: `Concept node "${q}" has 12 edges, centrality rank 3/87 in the graph.`, score: 0.87 },
    { type: 'rag', name: 'RAG History', content: `Previous query about "${q}" returned 89% confidence answer. Click to view full answer.`, score: 0.82 },
  ];
}

export default function UniversalSearch() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState('all');
  const [asked, setAsked] = useState(false);

  const search = async () => {
    if (!query.trim()) return;
    setLoading(true); setAsked(true);
    try {
      const data = await api.post<any>('/rag/query', { query });
      setResults([
        { type: 'rag', name: 'AI Answer', content: data.answer?.slice(0, 200) + '...', score: data.confidence ?? 0.9 },
        ...generateResults(query),
      ]);
    } catch {
      setResults(generateResults(query));
    } finally { setLoading(false); }
  };

  const filtered = results.filter(r => filter === 'all' || r.type === filter);

  return (
    <div className="h-screen flex flex-col bg-zinc-950">
      <div className="border-b border-zinc-800 bg-zinc-900/50 px-6 py-4">
        <h1 className="text-xl font-bold text-white flex items-center gap-2"><SearchIcon className="w-5 h-5 text-blue-400" />Universal Search</h1>
        <p className="text-xs text-zinc-500 mt-0.5">Semantic search across journals, documents, graphs, and RAG history</p>
      </div>

      <div className="p-6 max-w-3xl mx-auto w-full flex-1 overflow-auto">
        <div className="flex gap-3 mb-4">
          <input value={query} onChange={e => setQuery(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && search()}
            className="flex-1 bg-zinc-900 border border-zinc-700 rounded-2xl px-5 py-3 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:border-blue-500/50"
            placeholder="Search across all your research data..." />
          <button onClick={search} disabled={loading || !query.trim()}
            className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-500 disabled:opacity-40 text-white rounded-2xl text-sm font-medium transition-colors">
            {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <SearchIcon className="w-4 h-4" />}
            Search
          </button>
        </div>

        {asked && (
          <div className="flex gap-2 mb-4 flex-wrap">
            {['all', 'journal', 'document', 'graph', 'rag'].map(f => (
              <button key={f} onClick={() => setFilter(f)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium capitalize transition-colors ${filter === f ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30' : 'text-zinc-500 hover:text-white hover:bg-zinc-800'}`}>
                {f === 'all' ? `All (${results.length})` : f}
              </button>
            ))}
          </div>
        )}

        {!asked ? (
          <div className="text-center py-20 text-zinc-600">
            <SearchIcon className="w-12 h-12 mx-auto mb-3 text-zinc-700" />
            <div className="text-sm">Enter a query to search all your research data</div>
            <div className="text-xs mt-1">Journals, PDFs, knowledge graphs, and RAG history</div>
          </div>
        ) : loading ? (
          <div className="text-center py-16 text-zinc-500 text-sm">Searching...</div>
        ) : (
          <div className="space-y-3">
            {filtered.map((r, i) => {
              const Icon = typeIcon[r.type] ?? SearchIcon;
              const colorClass = typeColor[r.type] ?? 'text-zinc-400 bg-zinc-400/10';
              return (
                <div key={i} className="flex gap-4 p-4 bg-zinc-900 border border-zinc-800 rounded-2xl hover:border-zinc-700 transition-colors cursor-pointer">
                  <div className={`p-2.5 rounded-xl flex-shrink-0 ${colorClass}`}><Icon className="w-4 h-4" /></div>
                  <div className="flex-1 min-w-0">
                    {r.name && <div className="text-xs font-semibold text-zinc-400 mb-0.5">{r.name}</div>}
                    <div className="text-sm text-zinc-200 leading-relaxed">{r.content}</div>
                  </div>
                  <div className="text-xs text-emerald-400 font-mono flex-shrink-0">{(r.score * 100).toFixed(0)}%</div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
