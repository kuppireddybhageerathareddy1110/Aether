import { Link } from 'wouter';

const features = [
  { name: 'Knowledge Graph', desc: 'PDF → Graph → GAT', href: '/graph', color: 'emerald' },
  { name: 'Mood Journal', desc: 'AI mood detection', href: '/journal', color: 'indigo' },
  { name: 'XAI Layer', desc: 'Counterfactuals & explanations', href: '/xai', color: 'amber' },
  { name: 'LaTeX Editor', desc: 'Real-time collaboration', href: '/editor', color: 'rose' },
  { name: 'QA Generator', desc: 'RAG test cases + Selenium', href: '/qa', color: 'purple' },
  { name: 'Agent System', desc: '8 autonomous agents', href: '/agents', color: 'cyan' },
  { name: 'Auto Research', desc: 'Full pipeline automation', href: '/auto-research', color: 'emerald' },
  { name: 'Research Brain', desc: 'Central nervous system', href: '/research-brain', color: 'indigo' },
];

export default function ResearchOS() {
  return (
    <div className="p-8 max-w-6xl mx-auto">
      <h1 className="text-6xl font-semibold tracking-tighter mb-3">Research OS</h1>
      <p className="text-2xl text-zinc-400 mb-12">Your complete operating system for research</p>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
        {features.map(f => (
          <Link
            key={f.name}
            href={f.href}
            className="bg-zinc-900 border border-zinc-800 hover:border-zinc-700 rounded-3xl p-6 transition-all group"
          >
            <div className="font-semibold mb-1 group-hover:text-white">{f.name}</div>
            <div className="text-xs text-zinc-500">{f.desc}</div>
          </Link>
        ))}
      </div>

      <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-8">
        <div className="text-emerald-400 text-xs mb-2">SYSTEM STATUS</div>
        <div className="text-3xl font-semibold mb-6">All systems operational</div>
        <div className="grid grid-cols-4 gap-6 text-center">
          <div><div className="text-2xl font-semibold">99.9%</div><div className="text-xs text-zinc-500 mt-1">UPTIME</div></div>
          <div><div className="text-2xl font-semibold">8</div><div className="text-xs text-zinc-500 mt-1">ACTIVE AGENTS</div></div>
          <div><div className="text-2xl font-semibold">142</div><div className="text-xs text-zinc-500 mt-1">CONCEPTS</div></div>
          <div><div className="text-2xl font-semibold">7</div><div className="text-xs text-zinc-500 mt-1">INTEGRATED REPOS</div></div>
        </div>
      </div>
    </div>
  );
}
