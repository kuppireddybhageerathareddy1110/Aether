'use client';

import { useState } from 'react';

export default function GraphVisualization() {
  const [graphData, setGraphData] = useState<any>(null);

  const generateGraph = () => {
    setGraphData({
      nodes: 64,
      edges: 189,
      communities: 6,
      topConcepts: ["Knowledge Graph", "Mood Detection", "XAI", "RAG", "GAT"],
      visualization: "Interactive graph would render here using React Flow"
    });
  };

  return (
    <div className="p-8 max-w-5xl mx-auto">
      <div className="flex justify-between items-end mb-8">
        <div>
          <h1 className="text-5xl font-semibold tracking-tighter">Interactive Graph Viz</h1>
          <p className="text-zinc-400 mt-2">React Flow + NetworkX + PyTorch Geometric</p>
        </div>
        <button onClick={generateGraph} className="px-6 py-3 bg-white text-black rounded-2xl text-sm font-medium">Generate Visualization</button>
      </div>

      {!graphData ? (
        <div className="h-[420px] flex items-center justify-center border border-dashed border-zinc-700 rounded-3xl">
          <div className="text-center">
            <div className="text-6xl mb-4">🕸️</div>
            <p className="text-zinc-400">Click the button to generate an interactive knowledge graph</p>
          </div>
        </div>
      ) : (
        <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-10">
            <div><div className="text-4xl font-semibold">{graphData.nodes}</div><div className="text-xs text-zinc-500">NODES</div></div>
            <div><div className="text-4xl font-semibold">{graphData.edges}</div><div className="text-xs text-zinc-500">EDGES</div></div>
            <div><div className="text-4xl font-semibold">{graphData.communities}</div><div className="text-xs text-zinc-500">COMMUNITIES</div></div>
            <div><div className="text-4xl font-semibold">0.87</div><div className="text-xs text-zinc-500">AVG CENTRALITY</div></div>
          </div>

          <div className="bg-zinc-950 rounded-2xl p-8 text-center text-sm text-zinc-400">
            {graphData.visualization}
          </div>

          <div className="mt-8">
            <div className="text-xs text-zinc-500 mb-3">TOP CONCEPTS</div>
            <div className="flex flex-wrap gap-2">
              {graphData.topConcepts.map((c: string, i: number) => (
                <div key={i} className="px-4 py-1 bg-zinc-800 rounded-full text-xs">{c}</div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}