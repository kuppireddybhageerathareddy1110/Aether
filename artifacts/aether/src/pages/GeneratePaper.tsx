import { useState } from 'react';

export default function GeneratePaper() {
  const [topic, setTopic] = useState('');
  const [paper, setPaper] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const generate = async () => {
    if (!topic.trim()) return;
    setLoading(true);
    setTimeout(() => {
      setPaper({
        title: `On the Intersection of ${topic} and Graph Neural Networks`,
        abstract: `This paper presents a novel framework combining ${topic} with graph-attention mechanisms. We demonstrate a 31% improvement in centrality prediction accuracy when mood features are incorporated into the GNN architecture. Our approach achieves state-of-the-art results on three benchmark datasets.`,
        sections: ['Introduction', 'Related Work', 'Methodology', 'Experiments', 'Results', 'Conclusion'],
        references: 24,
        wordCount: 4821,
      });
      setLoading(false);
    }, 1500);
  };

  return (
    <div className="p-8 max-w-5xl mx-auto">
      <h1 className="text-5xl font-semibold tracking-tighter mb-2">Generate Research Paper</h1>
      <p className="text-xl text-zinc-400 mb-8">AI-powered paper generation from your knowledge base</p>

      <div className="glass rounded-2xl p-8 mb-8">
        <input
          type="text"
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          className="w-full bg-transparent border border-white/[0.07] rounded-xl px-4 py-3 text-sm mb-4"
          placeholder="Mood-aware Graph Neural Networks for Research Analytics..."
        />
        <button
          onClick={generate}
          disabled={loading}
          className="px-8 py-3 bg-white text-black rounded-2xl font-medium disabled:opacity-50"
        >
          {loading ? 'Generating...' : 'Generate Paper'}
        </button>
      </div>

      {paper && (
        <div className="space-y-6">
          <div className="glass rounded-3xl p-8">
            <div className="text-xs text-zinc-500 mb-2">TITLE</div>
            <div className="text-2xl font-semibold">{paper.title}</div>
          </div>
          <div className="glass rounded-3xl p-8">
            <div className="text-xs text-zinc-500 mb-2">ABSTRACT</div>
            <div className="text-sm leading-relaxed text-zinc-300">{paper.abstract}</div>
          </div>
          <div className="grid grid-cols-2 gap-6">
            <div className="glass rounded-3xl p-8">
              <div className="text-xs text-zinc-500 mb-4">SECTIONS</div>
              <div className="space-y-2">
                {paper.sections.map((s: string, i: number) => (
                  <div key={i} className="text-sm">{i + 1}. {s}</div>
                ))}
              </div>
            </div>
            <div className="glass rounded-3xl p-8">
              <div className="text-4xl font-semibold">{paper.wordCount}</div>
              <div className="text-xs text-zinc-500 mt-1">WORDS</div>
              <div className="text-4xl font-semibold mt-6">{paper.references}</div>
              <div className="text-xs text-zinc-500 mt-1">REFERENCES</div>
            </div>
          </div>
          <button className="px-8 py-3 bg-white text-black rounded-2xl font-medium">Export as LaTeX</button>
        </div>
      )}
    </div>
  );
}
