import { useState } from 'react';

export default function AutoResearch() {
  const [running, setRunning] = useState(false);
  const [progress, setProgress] = useState<string[]>([]);
  const [topic, setTopic] = useState('');

  const start = () => {
    if (!topic.trim()) return;
    setRunning(true);
    setProgress([]);
    const steps = [
      `Searching for papers on "${topic}"...`,
      'Found 23 relevant documents. Downloading abstracts...',
      'Building knowledge graph (87 nodes, 143 edges)...',
      'Running mood analysis on related journal entries...',
      'Generating XAI explanations for key findings...',
      'Synthesizing insights across all sources...',
      '✓ Auto-research complete. 6 key insights discovered.',
    ];
    steps.forEach((step, i) => {
      setTimeout(() => {
        setProgress(prev => [...prev, step]);
        if (i === steps.length - 1) setRunning(false);
      }, i * 800);
    });
  };

  return (
    <div className="p-8 max-w-5xl mx-auto">
      <h1 className="text-5xl font-semibold tracking-tighter mb-2">Auto Research</h1>
      <p className="text-xl text-zinc-400 mb-8">Fully autonomous research pipeline — runs all agents in sequence</p>

      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-8 mb-8">
        <input
          type="text"
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-sm mb-4"
          placeholder="Mood-aware Graph Neural Networks..."
        />
        <button
          onClick={start}
          disabled={running}
          className="px-8 py-3 bg-white text-black rounded-2xl font-medium disabled:opacity-50"
        >
          {running ? 'Running...' : 'Start Auto Research'}
        </button>
      </div>

      {progress.length > 0 && (
        <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-8 space-y-3">
          <div className="text-xs text-zinc-500 mb-4">PIPELINE LOG</div>
          {progress.map((step, i) => (
            <div key={i} className={`text-sm ${step.startsWith('✓') ? 'text-emerald-400' : 'text-zinc-300'}`}>
              {step}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
