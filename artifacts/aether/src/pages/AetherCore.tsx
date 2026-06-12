export default function AetherCore() {
  const modules = [
    { name: 'Graph Attention Network', version: '2.1.0', status: 'healthy', source: 'pdf-graph' },
    { name: 'RAG Pipeline', version: '1.4.2', status: 'healthy', source: 'new' },
    { name: 'Mood Detection (Gemini)', version: '1.0.0', status: 'healthy', source: 'myjournal' },
    { name: 'XAI Engine', version: '3.0.1', status: 'healthy', source: 'aizenx' },
    { name: 'LaTeX/Pandoc Service', version: '2.0.0', status: 'healthy', source: 'TexFlow' },
    { name: 'QA/Selenium Generator', version: '1.2.0', status: 'healthy', source: 'sel-gen' },
    { name: 'NEXUS Orchestrator', version: '1.0.0', status: 'healthy', source: 'NEXUS' },
  ];

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <h1 className="text-5xl font-semibold tracking-tighter mb-2">Aether Core</h1>
      <p className="text-xl text-zinc-400 mb-8">Platform internals — all 7 integrated repositories</p>

      <div className="space-y-3">
        {modules.map((m, i) => (
          <div key={i} className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 flex items-center justify-between">
            <div>
              <div className="font-semibold">{m.name}</div>
              <div className="text-xs text-zinc-500 mt-1">Source: {m.source} • v{m.version}</div>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-emerald-400" />
              <div className="text-xs text-emerald-400">{m.status}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 bg-emerald-500/5 border border-emerald-900 rounded-3xl p-8">
        <div className="text-emerald-400 text-xs mb-2">INTEGRATION COMPLETE</div>
        <div className="text-2xl">All 7 repositories unified into one platform</div>
      </div>
    </div>
  );
}
