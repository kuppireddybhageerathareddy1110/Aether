'use client';

import { useState } from 'react';

const templates = [
  { name: "Graph Analysis", code: `import networkx as nx\nG = nx.karate_club_graph()\nprint("Nodes:", G.number_of_nodes())\nprint("Edges:", G.number_of_edges())\nprint("Avg Degree:", sum(dict(G.degree()).values()) / G.number_of_nodes())` },
  { name: "Mood Trend", code: `moods = ["Curious", "Inspired", "Tired"]\nprint("Recent mood distribution:")\nfor m in moods:\n    print(f"  {m}: {round(100 * (moods.index(m)+1) / 10)}%")` },
  { name: "Simple RAG", code: `docs = ["Graph Neural Networks", "Mood Detection", "XAI"]\nquery = "mood"\nresults = [d for d in docs if query.lower() in d.lower()]\nprint("Results:", results)` },
];

export default function CodeSandbox() {
  const [code, setCode] = useState(templates[0].code);
  const [output, setOutput] = useState('');
  const [running, setRunning] = useState(false);

  const runCode = () => {
    setRunning(true);
    setTimeout(() => {
      // Simulated execution
      let result = '';
      if (code.includes('networkx')) {
        result = 'Nodes: 34\nEdges: 78\nAvg Degree: 4.59';
      } else if (code.includes('moods')) {
        result = 'Recent mood distribution:\n  Curious: 30%\n  Inspired: 40%\n  Tired: 20%';
      } else if (code.includes('RAG')) {
        result = 'Results: ["Mood Detection"]';
      } else {
        result = 'Code executed successfully.\n(Real Python execution would run here)';
      }
      setOutput(result);
      setRunning(false);
    }, 800);
  };

  const loadTemplate = (template: any) => {
    setCode(template.code);
    setOutput('');
  };

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <div className="flex justify-between items-end mb-8">
        <div>
          <h1 className="text-5xl font-semibold tracking-tighter">Code Sandbox</h1>
          <p className="text-zinc-400 mt-2">Run Python code against your research data, graphs, and journal</p>
        </div>
        <button onClick={runCode} disabled={running} className="px-8 py-3 bg-white text-black rounded-2xl font-medium disabled:opacity-50">
          {running ? "Running..." : "Run Code"}
        </button>
      </div>

      <div className="flex gap-3 mb-6">
        {templates.map((t, i) => (
          <button key={i} onClick={() => loadTemplate(t)} className="px-5 py-2 text-sm border border-zinc-700 rounded-xl hover:bg-zinc-800">
            {t.name}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <div className="text-xs text-zinc-500 mb-2 px-2">PYTHON EDITOR</div>
          <textarea
            value={code}
            onChange={(e) => setCode(e.target.value)}
            className="w-full h-[420px] bg-zinc-900 border border-zinc-800 rounded-3xl p-8 font-mono text-sm resize-none"
            spellCheck={false}
          />
        </div>

        <div>
          <div className="text-xs text-zinc-500 mb-2 px-2">OUTPUT</div>
          <div className="h-[420px] bg-zinc-950 border border-zinc-800 rounded-3xl p-8 font-mono text-sm overflow-auto whitespace-pre-wrap">
            {output || "Run code to see output..."}
          </div>
        </div>
      </div>

      <div className="mt-6 text-xs text-zinc-500 px-2">
        This sandbox can access your uploaded documents, graphs, journal entries, and XAI results in a real implementation.
      </div>
    </div>
  );
}