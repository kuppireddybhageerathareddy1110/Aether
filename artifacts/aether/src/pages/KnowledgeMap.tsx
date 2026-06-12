import { useState } from 'react';

export default function KnowledgeMap() {
  const [map, setMap] = useState<any>(null);

  const buildMap = () => {
    setMap({
      totalConcepts: 142,
      connections: 387,
      clusters: ['Core Research', 'Mood & Behavior', 'XAI Methods', 'Graph ML', 'Productivity'],
      crossLinks: 29,
      suggestion: 'Strong bridge between "Mood Detection" and "Graph Centrality" — explore this connection',
    });
  };

  return (
    <div className="p-8 max-w-5xl mx-auto">
      <h1 className="text-5xl font-semibold tracking-tighter mb-2">Living Knowledge Map</h1>
      <p className="text-xl text-zinc-400 mb-8">Dynamic map combining Journal + Graphs + Documents + Agents</p>

      <button onClick={buildMap} className="px-8 py-3 bg-white text-black rounded-2xl mb-10 font-medium">Build Knowledge Map</button>

      {map && (
        <div className="space-y-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-7"><div className="text-4xl font-semibold">{map.totalConcepts}</div><div className="text-xs text-zinc-500 mt-1">CONCEPTS</div></div>
            <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-7"><div className="text-4xl font-semibold">{map.connections}</div><div className="text-xs text-zinc-500 mt-1">CONNECTIONS</div></div>
            <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-7"><div className="text-4xl font-semibold">{map.clusters.length}</div><div className="text-xs text-zinc-500 mt-1">CLUSTERS</div></div>
            <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-7"><div className="text-4xl font-semibold">{map.crossLinks}</div><div className="text-xs text-zinc-500 mt-1">CROSS LINKS</div></div>
          </div>

          <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-8">
            <div className="text-xs text-zinc-500 mb-4">MAJOR CLUSTERS</div>
            <div className="flex flex-wrap gap-3">
              {map.clusters.map((c: string, i: number) => <div key={i} className="px-5 py-2 bg-zinc-800 rounded-2xl text-sm">{c}</div>)}
            </div>
          </div>

          <div className="bg-emerald-500/5 border border-emerald-900 rounded-3xl p-8">
            <div className="text-emerald-400 text-xs mb-2">AI SUGGESTION</div>
            <div className="text-xl">{map.suggestion}</div>
          </div>
        </div>
      )}
    </div>
  );
}
