import { useState } from 'react';

export default function GraphViz() {
  const [nodes] = useState([
    { id: 1, label: 'Graph Neural Networks', x: 300, y: 150, size: 20, color: '#10b981' },
    { id: 2, label: 'Mood Detection', x: 100, y: 100, size: 14, color: '#6366f1' },
    { id: 3, label: 'Centrality', x: 500, y: 100, size: 16, color: '#f59e0b' },
    { id: 4, label: 'XAI', x: 200, y: 300, size: 12, color: '#ef4444' },
    { id: 5, label: 'RAG', x: 450, y: 280, size: 13, color: '#8b5cf6' },
    { id: 6, label: 'Journal', x: 50, y: 250, size: 11, color: '#06b6d4' },
  ]);

  const edges = [
    { from: 1, to: 2 }, { from: 1, to: 3 }, { from: 1, to: 4 },
    { from: 2, to: 6 }, { from: 3, to: 5 }, { from: 4, to: 5 },
  ];

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <h1 className="text-5xl font-semibold tracking-tighter mb-2">Graph Visualizer</h1>
      <p className="text-xl text-zinc-400 mb-8">Interactive knowledge graph visualization</p>

      <div className="glass rounded-3xl overflow-hidden">
        <svg width="100%" height="400" viewBox="0 0 600 400" className="bg-zinc-950">
          {edges.map((edge, i) => {
            const from = nodes.find(n => n.id === edge.from)!;
            const to = nodes.find(n => n.id === edge.to)!;
            return (
              <line
                key={i}
                x1={from.x} y1={from.y}
                x2={to.x} y2={to.y}
                stroke="#3f3f46"
                strokeWidth="1.5"
              />
            );
          })}
          {nodes.map(node => (
            <g key={node.id}>
              <circle
                cx={node.x} cy={node.y}
                r={node.size}
                fill={node.color}
                fillOpacity="0.8"
              />
              <text
                x={node.x} y={node.y + node.size + 14}
                textAnchor="middle"
                fill="#a1a1aa"
                fontSize="10"
              >
                {node.label}
              </text>
            </g>
          ))}
        </svg>
      </div>

      <div className="mt-6 grid grid-cols-3 gap-6">
        <div className="glass rounded-3xl p-7">
          <div className="text-4xl font-semibold">{nodes.length}</div>
          <div className="text-xs text-zinc-500 mt-1">NODES</div>
        </div>
        <div className="glass rounded-3xl p-7">
          <div className="text-4xl font-semibold">{edges.length}</div>
          <div className="text-xs text-zinc-500 mt-1">EDGES</div>
        </div>
        <div className="glass rounded-3xl p-7">
          <div className="text-4xl font-semibold">0.73</div>
          <div className="text-xs text-zinc-500 mt-1">AVG CENTRALITY</div>
        </div>
      </div>
    </div>
  );
}
