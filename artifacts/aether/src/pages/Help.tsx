import { useState } from 'react';
import { HelpCircle, Search, BookOpen, ChevronRight, ChevronDown, ExternalLink, MessageCircle, Video } from 'lucide-react';

const categories = [
  {
    name: 'Getting Started', icon: '🚀',
    articles: [
      { title: 'Platform Overview', desc: 'Introduction to Aether and its 7 integrated modules' },
      { title: 'Uploading Your First PDF', desc: 'How to upload documents and trigger graph generation' },
      { title: 'Running Your First RAG Query', desc: 'Query your knowledge base with Agentic RAG' },
    ],
  },
  {
    name: 'Knowledge Graph', icon: '🕸️',
    articles: [
      { title: 'PDF to Graph Pipeline', desc: 'How Aether converts PDFs to knowledge graphs' },
      { title: 'Graph Attention Networks', desc: 'Understanding GAT analysis and centrality scores' },
      { title: 'Graph Visualization', desc: 'Interacting with the graph canvas' },
    ],
  },
  {
    name: 'Agentic RAG', icon: '🤖',
    articles: [
      { title: 'Pipeline Architecture', desc: 'Retriever → Reranker → Synthesizer → Verifier → Formatter' },
      { title: 'Configuring Agents', desc: 'Adjusting top-k, thresholds, and LLM models' },
      { title: 'Interpreting Results', desc: 'Understanding confidence scores and citations' },
    ],
  },
  {
    name: 'XAI & Explainability', icon: '🔬',
    articles: [
      { title: 'SHAP Feature Importance', desc: 'Understanding positive and negative feature contributions' },
      { title: 'Attention Heatmaps', desc: 'Visualizing self-attention patterns in the model' },
      { title: 'Decision Trace', desc: 'Step-by-step model reasoning with confidence bars' },
    ],
  },
  {
    name: 'API & Integration', icon: '⚙️',
    articles: [
      { title: 'API Reference', desc: 'Complete REST API documentation with examples' },
      { title: 'Authentication', desc: 'API key management and authentication flow' },
      { title: 'Webhooks', desc: 'Setting up event webhooks for pipeline completion' },
    ],
  },
];

const faqs = [
  { q: 'What file formats does Aether support?', a: 'Aether supports PDF, DOCX, TXT, and Markdown files for document ingestion.' },
  { q: 'How long does knowledge graph generation take?', a: 'Graph generation typically takes 10–60 seconds depending on document length (1–50 pages).' },
  { q: 'Can I use my own LLM API key?', a: 'Yes — in Settings → Models & AI, you can provide your own OpenAI, Anthropic, or Hugging Face keys.' },
  { q: 'Is my data stored securely?', a: 'All documents are encrypted at rest (AES-256) and in transit (TLS 1.3). We never use your data for training.' },
];

export default function Help() {
  const [searchQuery, setSearchQuery] = useState('');
  const [expanded, setExpanded] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState<'docs' | 'faq' | 'contact'>('docs');

  return (
    <div className="h-screen flex flex-col bg-transparent">
      <div className="border-b border-white/[0.07] bg-zinc-900/50 px-6 py-4">
        <h1 className="text-xl font-bold text-white flex items-center gap-2">
          <HelpCircle className="w-5 h-5 text-teal-400" />Help & Docs
        </h1>
        <p className="text-xs text-zinc-500 mt-0.5">Documentation, guides, and platform support</p>
      </div>

      {/* Search */}
      <div className="border-b border-white/[0.07] bg-zinc-900/30 px-6 py-4">
        <div className="max-w-xl relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
          <input value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
            className="w-full bg-white/[0.06] border border-zinc-700 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder:text-zinc-500 focus:outline-none focus:border-teal-500/50"
            placeholder="Search docs, FAQs, guides..." />
        </div>
      </div>

      <div className="border-b border-white/[0.07] px-6">
        <div className="flex gap-1 py-2">
          {[['docs', 'Documentation'], ['faq', 'FAQ'], ['contact', 'Contact Support']].map(([k, label]) => (
            <button key={k} onClick={() => setActiveTab(k as any)}
              className={`px-4 py-1.5 rounded-lg text-xs font-medium transition-colors ${activeTab === k ? 'bg-teal-500/20 text-teal-300 border border-teal-500/30' : 'text-zinc-500 hover:text-white hover:bg-zinc-800'}`}>
              {label}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-auto p-6">
        {activeTab === 'docs' && (
          <div className="max-w-3xl mx-auto space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              {[{ icon: '📖', title: 'Quick Start Guide', desc: '5-minute setup and your first graph', badge: 'Recommended' }, { icon: '🎥', title: 'Video Tutorials', desc: '12 walkthrough videos', badge: '' }, { icon: '📡', title: 'API Reference', desc: 'Full REST API docs', badge: '' }, { icon: '💡', title: 'Best Practices', desc: 'Tips for optimal results', badge: '' }].map(c => (
                <div key={c.title} className="glass rounded-xl p-4 hover:border-zinc-700 cursor-pointer transition-colors flex items-center gap-3">
                  <span className="text-2xl">{c.icon}</span>
                  <div className="flex-1">
                    <div className="text-sm font-semibold text-white flex items-center gap-2">{c.title} {c.badge && <span className="px-1.5 py-0.5 bg-teal-500/20 text-teal-400 text-[9px] rounded-full">{c.badge}</span>}</div>
                    <div className="text-xs text-zinc-500">{c.desc}</div>
                  </div>
                  <ExternalLink className="w-3.5 h-3.5 text-zinc-600" />
                </div>
              ))}
            </div>

            {categories.filter(c => !searchQuery || c.name.toLowerCase().includes(searchQuery.toLowerCase()) || c.articles.some(a => a.title.toLowerCase().includes(searchQuery.toLowerCase()))).map(cat => (
              <div key={cat.name} className="glass rounded-2xl overflow-hidden">
                <div className="flex items-center gap-3 p-4 border-b border-white/[0.07]">
                  <span className="text-xl">{cat.icon}</span>
                  <span className="font-semibold text-white">{cat.name}</span>
                  <span className="text-xs text-zinc-500 ml-auto">{cat.articles.length} articles</span>
                </div>
                {cat.articles.map((article, i) => (
                  <div key={i} className="flex items-center gap-3 px-4 py-3 hover:bg-zinc-800/50 cursor-pointer transition-colors border-b border-white/[0.07]/50 last:border-0">
                    <BookOpen className="w-3.5 h-3.5 text-zinc-500 flex-shrink-0" />
                    <div className="flex-1">
                      <div className="text-sm text-white">{article.title}</div>
                      <div className="text-xs text-zinc-500">{article.desc}</div>
                    </div>
                    <ChevronRight className="w-3.5 h-3.5 text-zinc-600" />
                  </div>
                ))}
              </div>
            ))}
          </div>
        )}

        {activeTab === 'faq' && (
          <div className="max-w-2xl mx-auto space-y-2">
            {faqs.map((faq, i) => (
              <div key={i} className="glass rounded-2xl overflow-hidden">
                <button onClick={() => setExpanded(expanded === i ? null : i)}
                  className="w-full flex items-center justify-between p-5 text-left">
                  <span className="text-sm font-semibold text-white">{faq.q}</span>
                  {expanded === i ? <ChevronDown className="w-4 h-4 text-zinc-500 flex-shrink-0" /> : <ChevronRight className="w-4 h-4 text-zinc-500 flex-shrink-0" />}
                </button>
                {expanded === i && (
                  <div className="px-5 pb-5 text-sm text-zinc-400 leading-relaxed border-t border-white/[0.07] pt-3">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {activeTab === 'contact' && (
          <div className="max-w-lg mx-auto space-y-4">
            <div className="grid grid-cols-2 gap-4">
              {[{ icon: MessageCircle, title: 'Live Chat', desc: 'Get help from our team', badge: 'Available', color: 'text-emerald-400 bg-emerald-400/10' }, { icon: Video, title: 'Video Call', desc: 'Schedule a 30-min demo', badge: 'Book slot', color: 'text-blue-400 bg-blue-400/10' }].map(c => (
                <div key={c.title} className="glass rounded-2xl p-5 hover:border-zinc-700 cursor-pointer transition-colors">
                  <div className={`p-2.5 rounded-xl w-fit mb-3 ${c.color}`}><c.icon className="w-5 h-5" /></div>
                  <div className="font-semibold text-white mb-1">{c.title}</div>
                  <div className="text-xs text-zinc-500 mb-3">{c.desc}</div>
                  <span className="px-3 py-1 bg-white/[0.06] text-zinc-300 text-xs rounded-lg">{c.badge}</span>
                </div>
              ))}
            </div>
            <div className="glass rounded-2xl p-5">
              <div className="text-sm font-semibold text-white mb-4">Send a message</div>
              <div className="space-y-3">
                <input className="w-full bg-white/[0.06] border border-zinc-700 rounded-xl px-4 py-2.5 text-sm text-white placeholder:text-zinc-500 focus:outline-none focus:border-teal-500/50" placeholder="Subject" />
                <textarea className="w-full bg-white/[0.06] border border-zinc-700 rounded-xl px-4 py-2.5 text-sm text-white placeholder:text-zinc-500 focus:outline-none focus:border-teal-500/50 h-28 resize-none" placeholder="Describe your issue..." />
                <button className="px-6 py-2.5 bg-teal-600 hover:bg-teal-500 text-white rounded-xl text-sm font-medium transition-colors">Send Message</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
