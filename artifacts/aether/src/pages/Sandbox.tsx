import { useState } from 'react';
import { Code, Play, RefreshCw, CheckCircle, Copy } from 'lucide-react';

const EXAMPLES = [
  {
    name: 'Generate Knowledge Graph',
    code: `// POST /api/graphs/generate
const res = await fetch('/api/graphs/generate', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ topic: 'Attention Mechanisms', sourceDoc: 'manual' }),
});
const graph = await res.json();
console.log(\`Generated graph with \${graph.nodeCount} nodes, \${graph.edgeCount} edges\`);
return graph;`,
  },
  {
    name: 'Run RAG Query',
    code: `// POST /api/rag/query
const res = await fetch('/api/rag/query', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ query: 'What are the key findings about GNN architectures?' }),
});
const result = await res.json();
console.log('Confidence:', result.confidence);
console.log('Answer:', result.answer.slice(0, 200) + '...');
return { confidence: result.confidence, chunks: result.chunksUsed };`,
  },
  {
    name: 'Dashboard Stats',
    code: `// GET /api/dashboard/stats
const res = await fetch('/api/dashboard/stats');
const stats = await res.json();
console.log('Platform Stats:', JSON.stringify(stats, null, 2));
return stats;`,
  },
  {
    name: 'Create Journal Entry',
    code: `// POST /api/journal
const res = await fetch('/api/journal', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    content: 'Explored new attention mechanisms today. Very productive session.',
    moodScore: 8,
    moodLabel: 'Great',
    tags: ['Focused', 'Inspired'],
  }),
});
const entry = await res.json();
console.log('Entry saved:', entry.id);
return entry;`,
  },
];

export default function Sandbox() {
  const [code, setCode] = useState(EXAMPLES[0].code);
  const [output, setOutput] = useState('');
  const [running, setRunning] = useState(false);
  const [copied, setCopied] = useState(false);

  const run = async () => {
    setRunning(true); setOutput('');
    try {
      const logs: string[] = [];
      const origConsole = console.log;
      const mockConsole = (...args: any[]) => { logs.push(args.map(String).join(' ')); origConsole(...args); };
      const AsyncFunction = Object.getPrototypeOf(async function () {}).constructor;
      const fn = new AsyncFunction('fetch', 'console', code);
      const result = await fn(window.fetch.bind(window), { log: mockConsole });
      const resultStr = result !== undefined ? '\n\n→ Return value:\n' + JSON.stringify(result, null, 2) : '';
      setOutput((logs.join('\n') || '(no console output)') + resultStr);
    } catch (e: any) {
      setOutput('Error: ' + (e.message ?? String(e)));
    } finally { setRunning(false); }
  };

  const copy = () => { navigator.clipboard.writeText(code).catch(() => {}); setCopied(true); setTimeout(() => setCopied(false), 2000); };

  return (
    <div className="h-screen flex flex-col bg-zinc-950">
      <div className="border-b border-zinc-800 bg-zinc-900/50 px-6 py-4">
        <h1 className="text-xl font-bold text-white flex items-center gap-2"><Code className="w-5 h-5 text-indigo-400" />Developer Sandbox</h1>
        <p className="text-xs text-zinc-500 mt-0.5">Test Aether API endpoints interactively with live execution</p>
      </div>

      <div className="flex flex-1 overflow-hidden gap-0">
        {/* Left: examples + editor */}
        <div className="flex-1 flex flex-col border-r border-zinc-800">
          <div className="border-b border-zinc-800 p-3 flex items-center gap-2 flex-wrap">
            {EXAMPLES.map((ex, i) => (
              <button key={i} onClick={() => { setCode(ex.code); setOutput(''); }}
                className={`px-3 py-1.5 rounded-lg text-xs transition-colors ${code === ex.code ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30' : 'text-zinc-500 hover:text-white hover:bg-zinc-800'}`}>
                {ex.name}
              </button>
            ))}
          </div>
          <div className="flex items-center justify-between px-4 py-2 border-b border-zinc-800 bg-zinc-900/30">
            <span className="text-xs text-zinc-500">JavaScript · Live execution against /api/*</span>
            <div className="flex gap-2">
              <button onClick={copy} className="flex items-center gap-1 px-2.5 py-1 text-[10px] text-zinc-500 hover:text-white hover:bg-zinc-800 rounded-md transition-colors">
                {copied ? <CheckCircle className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}{copied ? 'Copied' : 'Copy'}
              </button>
              <button onClick={run} disabled={running}
                className="flex items-center gap-1 px-3 py-1 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white text-[10px] font-medium rounded-md transition-colors">
                {running ? <RefreshCw className="w-3 h-3 animate-spin" /> : <Play className="w-3 h-3" />}
                {running ? 'Running...' : 'Run'}
              </button>
            </div>
          </div>
          <textarea value={code} onChange={e => setCode(e.target.value)}
            className="flex-1 bg-zinc-950 text-sm text-zinc-200 font-mono p-5 resize-none focus:outline-none leading-relaxed"
            spellCheck={false} />
        </div>

        {/* Right: output */}
        <div className="w-96 flex flex-col">
          <div className="border-b border-zinc-800 px-4 py-2 flex items-center gap-2">
            <span className="text-xs font-semibold text-zinc-400 uppercase tracking-widest">Output</span>
            {output && <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />}
          </div>
          <div className="flex-1 overflow-auto bg-zinc-900/30 p-4">
            {running ? (
              <div className="flex items-center gap-2 text-zinc-500 text-sm"><RefreshCw className="w-4 h-4 animate-spin" />Executing...</div>
            ) : output ? (
              <pre className="text-xs text-zinc-200 font-mono leading-relaxed whitespace-pre-wrap">{output}</pre>
            ) : (
              <div className="text-xs text-zinc-600 text-center mt-8">Run the code to see output</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
