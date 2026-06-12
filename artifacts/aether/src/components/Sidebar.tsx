import { useState } from 'react';
import { Link, useLocation } from 'wouter';
import {
  LayoutDashboard, FileText, GitBranch, FlaskConical, BarChart3, Settings,
  Upload, Search, MessageCircle, Bot, FolderOpen, Clock, Sparkles,
  GitMerge, Map, TrendingUp, BrainCircuit, Layers, Terminal, Bell,
  HelpCircle, User, ChevronDown, ChevronRight, Eye, EyeOff, Sliders, SlidersHorizontal,
  Cpu, Zap, Network, BookOpen,
} from 'lucide-react';

const sections = [
  {
    label: 'Core',
    items: [
      { href: '/', label: 'Dashboard', icon: LayoutDashboard },
      { href: '/agentic-rag', label: 'Agentic RAG', icon: Network },
      { href: '/rag-chat', label: 'RAG Chat', icon: MessageCircle },
    ],
  },
  {
    label: 'Research',
    items: [
      { href: '/knowledge-graph', label: 'Knowledge Graph', icon: GitBranch },
      { href: '/knowledge-map', label: 'Knowledge Map', icon: Map },
      { href: '/graph-viz', label: 'Graph Viz', icon: GitMerge },
      { href: '/upload', label: 'Upload PDF', icon: Upload },
      { href: '/search', label: 'Universal Search', icon: Search },
    ],
  },
  {
    label: 'Intelligence',
    items: [
      { href: '/xai-dashboard', label: 'XAI Dashboard', icon: FlaskConical },
      { href: '/mood-journal', label: 'Mood Journal', icon: TrendingUp },
      { href: '/mood-graph', label: 'Mood × Graph', icon: BarChart3 },
      { href: '/insights', label: 'Deep Insights', icon: Sparkles },
      { href: '/smart-dashboard', label: 'Smart Dashboard', icon: LayoutDashboard },
    ],
  },
  {
    label: 'Create',
    items: [
      { href: '/latex-editor', label: 'LaTeX Studio', icon: FileText },
      { href: '/generate-paper', label: 'Generate Paper', icon: BookOpen },
      { href: '/qa', label: 'QA Generator', icon: FlaskConical },
      { href: '/assistant', label: 'AI Assistant', icon: Sparkles },
    ],
  },
  {
    label: 'Workspace',
    items: [
      { href: '/agents', label: 'Agents', icon: Bot },
      { href: '/projects', label: 'Projects', icon: FolderOpen },
      { href: '/timeline', label: 'Timeline', icon: Clock },
      { href: '/collaborate', label: 'Collaborate', icon: Layers },
      { href: '/auto-research', label: 'Auto Research', icon: Zap },
    ],
  },
  {
    label: 'Platform',
    items: [
      { href: '/research-brain', label: 'Research Brain', icon: BrainCircuit },
      { href: '/research-os', label: 'Research OS', icon: Cpu },
      { href: '/aether-core', label: 'Aether Core', icon: GitBranch },
      { href: '/sandbox', label: 'Sandbox', icon: Terminal },
    ],
  },
];

const bottomItems = [
  { href: '/notifications', label: 'Notifications', icon: Bell, badge: 3 },
  { href: '/help', label: 'Help & Docs', icon: HelpCircle },
  { href: '/settings', label: 'Settings', icon: Settings },
  { href: '/account', label: 'Account', icon: User },
];

const moduleToggles = [
  { id: 'rag', label: 'Agentic RAG', enabled: true },
  { id: 'graph', label: 'Knowledge Graph', enabled: true },
  { id: 'xai', label: 'XAI Dashboard', enabled: true },
  { id: 'journal', label: 'Mood Journal', enabled: true },
  { id: 'editor', label: 'LaTeX Studio', enabled: true },
  { id: 'agents', label: 'Agent System', enabled: true },
];

export function Sidebar() {
  const [pathname] = useLocation();
  const [collapsed, setCollapsed] = useState<Record<string, boolean>>({});
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [settingsTab, setSettingsTab] = useState<'modules' | 'processing' | 'notifications'>('modules');
  const [modules, setModules] = useState(moduleToggles);
  const [ragChunkSize, setRagChunkSize] = useState(512);
  const [xaiThreshold, setXaiThreshold] = useState(0.7);

  const toggleSection = (label: string) => {
    setCollapsed(prev => ({ ...prev, [label]: !prev[label] }));
  };

  const toggleModule = (id: string) => {
    setModules(prev => prev.map(m => m.id === id ? { ...m, enabled: !m.enabled } : m));
  };

  return (
    <div className="w-60 bg-zinc-900 border-r border-zinc-800 flex flex-col flex-shrink-0 h-screen">
      {/* Logo */}
      <div className="p-4 border-b border-zinc-800">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-emerald-400 to-teal-600 flex items-center justify-center">
            <BrainCircuit className="w-4 h-4 text-white" />
          </div>
          <div>
            <div className="text-sm font-bold tracking-tight">Aether</div>
            <div className="text-[10px] text-zinc-500">Research Platform</div>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto py-2 px-2 space-y-0.5">
        {sections.map(section => (
          <div key={section.label} className="mb-1">
            <button
              onClick={() => toggleSection(section.label)}
              className="w-full flex items-center justify-between px-2 py-1 text-[10px] font-semibold tracking-widest text-zinc-500 hover:text-zinc-400 uppercase"
            >
              {section.label}
              {collapsed[section.label] ? <ChevronRight className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
            </button>
            {!collapsed[section.label] && section.items.map(item => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs transition-all ${
                    isActive
                      ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                      : 'text-zinc-400 hover:text-white hover:bg-zinc-800/70'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5 flex-shrink-0" />
                  {item.label}
                </Link>
              );
            })}
          </div>
        ))}
      </nav>

      {/* Bottom items */}
      <div className="border-t border-zinc-800 px-2 py-2 space-y-0.5">
        {bottomItems.map(item => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs transition-all ${
                isActive
                  ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                  : 'text-zinc-400 hover:text-white hover:bg-zinc-800/70'
              }`}
            >
              <Icon className="w-3.5 h-3.5 flex-shrink-0" />
              <span className="flex-1">{item.label}</span>
              {'badge' in item && item.badge ? (
                <span className="bg-emerald-500 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full">{item.badge}</span>
              ) : null}
            </Link>
          );
        })}

        {/* Settings drawer toggle */}
        <button
          onClick={() => setSettingsOpen(!settingsOpen)}
          className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs transition-all ${
            settingsOpen ? 'bg-zinc-800 text-white' : 'text-zinc-400 hover:text-white hover:bg-zinc-800/70'
          }`}
        >
          <SlidersHorizontal className="w-3.5 h-3.5" />
          <span className="flex-1 text-left">Quick Settings</span>
          <ChevronDown className={`w-3 h-3 transition-transform ${settingsOpen ? 'rotate-180' : ''}`} />
        </button>

        {settingsOpen && (
          <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-3 mt-1">
            <div className="flex gap-1 mb-3">
              {(['modules', 'processing', 'notifications'] as const).map(tab => (
                <button
                  key={tab}
                  onClick={() => setSettingsTab(tab)}
                  className={`flex-1 text-[9px] py-1 rounded-md font-medium transition-colors ${
                    settingsTab === tab ? 'bg-emerald-500/20 text-emerald-400' : 'text-zinc-500 hover:text-zinc-300'
                  }`}
                >
                  {tab === 'modules' ? 'Modules' : tab === 'processing' ? 'Process' : 'Notifs'}
                </button>
              ))}
            </div>

            {settingsTab === 'modules' && (
              <div className="space-y-2">
                {modules.map(m => (
                  <div key={m.id} className="flex items-center justify-between">
                    <span className="text-[10px] text-zinc-400">{m.label}</span>
                    <button
                      onClick={() => toggleModule(m.id)}
                      className={`w-7 h-4 rounded-full transition-colors relative ${m.enabled ? 'bg-emerald-500' : 'bg-zinc-700'}`}
                    >
                      <div className={`absolute top-0.5 w-3 h-3 bg-white rounded-full shadow transition-transform ${m.enabled ? 'left-3.5' : 'left-0.5'}`} />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {settingsTab === 'processing' && (
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between text-[10px] text-zinc-400 mb-1">
                    <span>RAG Chunk Size</span><span className="text-emerald-400">{ragChunkSize}</span>
                  </div>
                  <input type="range" min={128} max={2048} step={128} value={ragChunkSize}
                    onChange={e => setRagChunkSize(+e.target.value)}
                    className="w-full accent-emerald-500 h-1" />
                </div>
                <div>
                  <div className="flex justify-between text-[10px] text-zinc-400 mb-1">
                    <span>XAI Threshold</span><span className="text-emerald-400">{xaiThreshold.toFixed(1)}</span>
                  </div>
                  <input type="range" min={0.1} max={1.0} step={0.1} value={xaiThreshold}
                    onChange={e => setXaiThreshold(+e.target.value)}
                    className="w-full accent-emerald-500 h-1" />
                </div>
              </div>
            )}

            {settingsTab === 'notifications' && (
              <div className="space-y-2">
                {['Graph complete', 'RAG responses', 'Agent updates', 'System alerts'].map(pref => (
                  <div key={pref} className="flex items-center justify-between">
                    <span className="text-[10px] text-zinc-400">{pref}</span>
                    <button className="w-7 h-4 rounded-full bg-emerald-500 relative">
                      <div className="absolute top-0.5 left-3.5 w-3 h-3 bg-white rounded-full shadow" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* User row */}
        <div className="flex items-center gap-2 px-3 py-2 mt-1">
          <div className="w-6 h-6 rounded-full bg-gradient-to-br from-emerald-400 to-teal-600 flex items-center justify-center text-[10px] font-bold text-white">K</div>
          <div className="flex-1 min-w-0">
            <div className="text-[10px] font-medium text-zinc-300 truncate">K. Kuppireddy</div>
            <div className="text-[9px] text-emerald-400">● Online</div>
          </div>
        </div>
      </div>
    </div>
  );
}
