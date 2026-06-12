import { useState } from 'react';
import { Link, useLocation } from 'wouter';
import {
  LayoutDashboard, FileText, GitBranch, FlaskConical, BarChart3, Settings,
  Upload, Search, MessageCircle, Bot, FolderOpen, Clock, Sparkles,
  GitMerge, Map, TrendingUp, BrainCircuit, Layers, Terminal, Bell,
  HelpCircle, User, ChevronDown, ChevronRight, Sliders, SlidersHorizontal,
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
    <div className="glass-sidebar w-60 flex flex-col flex-shrink-0 h-screen">
      {/* Logo */}
      <div className="p-4" style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl flex items-center justify-center relative"
            style={{ background: 'linear-gradient(135deg, #34d399, #0d9488)', boxShadow: '0 0 16px rgba(52,211,153,0.4)' }}>
            <BrainCircuit className="w-4.5 h-4.5 text-white" style={{ width: 18, height: 18 }} />
          </div>
          <div>
            <div className="text-sm font-bold tracking-tight text-white">Aether</div>
            <div className="text-[10px]" style={{ color: 'rgba(52,211,153,0.7)' }}>Research Platform</div>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto py-2 px-2 space-y-0.5">
        {sections.map(section => (
          <div key={section.label} className="mb-1">
            <button
              onClick={() => toggleSection(section.label)}
              className="w-full flex items-center justify-between px-2 py-1 text-[10px] font-semibold tracking-widest uppercase transition-colors"
              style={{ color: 'rgba(255,255,255,0.25)' }}
              onMouseEnter={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.45)')}
              onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.25)')}
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
                  className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs transition-all"
                  style={isActive ? {
                    background: 'rgba(52,211,153,0.12)',
                    color: '#34d399',
                    border: '1px solid rgba(52,211,153,0.25)',
                    boxShadow: '0 0 12px rgba(52,211,153,0.1)',
                  } : {
                    color: 'rgba(255,255,255,0.45)',
                    border: '1px solid transparent',
                  }}
                  onMouseEnter={e => {
                    if (!isActive) {
                      (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.05)';
                      (e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,0.9)';
                      (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.08)';
                    }
                  }}
                  onMouseLeave={e => {
                    if (!isActive) {
                      (e.currentTarget as HTMLElement).style.background = 'transparent';
                      (e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,0.45)';
                      (e.currentTarget as HTMLElement).style.borderColor = 'transparent';
                    }
                  }}
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
      <div className="px-2 py-2 space-y-0.5" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
        {bottomItems.map(item => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs transition-all"
              style={isActive ? {
                background: 'rgba(52,211,153,0.12)',
                color: '#34d399',
                border: '1px solid rgba(52,211,153,0.25)',
              } : {
                color: 'rgba(255,255,255,0.45)',
                border: '1px solid transparent',
              }}
              onMouseEnter={e => {
                if (!isActive) {
                  (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.05)';
                  (e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,0.9)';
                }
              }}
              onMouseLeave={e => {
                if (!isActive) {
                  (e.currentTarget as HTMLElement).style.background = 'transparent';
                  (e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,0.45)';
                }
              }}
            >
              <Icon className="w-3.5 h-3.5 flex-shrink-0" />
              <span className="flex-1">{item.label}</span>
              {'badge' in item && item.badge ? (
                <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full"
                  style={{ background: 'rgba(52,211,153,0.9)', color: 'white' }}>
                  {item.badge}
                </span>
              ) : null}
            </Link>
          );
        })}

        {/* Quick Settings toggle */}
        <button
          onClick={() => setSettingsOpen(!settingsOpen)}
          className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs transition-all"
          style={settingsOpen ? {
            background: 'rgba(255,255,255,0.07)',
            color: 'white',
            border: '1px solid rgba(255,255,255,0.1)',
          } : {
            color: 'rgba(255,255,255,0.45)',
            border: '1px solid transparent',
          }}
        >
          <SlidersHorizontal className="w-3.5 h-3.5" />
          <span className="flex-1 text-left">Quick Settings</span>
          <ChevronDown className={`w-3 h-3 transition-transform ${settingsOpen ? 'rotate-180' : ''}`} />
        </button>

        {settingsOpen && (
          <div className="rounded-xl p-3 mt-1" style={{
            background: 'rgba(255,255,255,0.04)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            border: '1px solid rgba(255,255,255,0.08)',
          }}>
            <div className="flex gap-1 mb-3">
              {(['modules', 'processing', 'notifications'] as const).map(tab => (
                <button
                  key={tab}
                  onClick={() => setSettingsTab(tab)}
                  className="flex-1 text-[9px] py-1 rounded-lg font-medium transition-all"
                  style={settingsTab === tab ? {
                    background: 'rgba(52,211,153,0.18)',
                    color: '#34d399',
                    border: '1px solid rgba(52,211,153,0.3)',
                  } : {
                    color: 'rgba(255,255,255,0.3)',
                    border: '1px solid transparent',
                  }}
                >
                  {tab === 'modules' ? 'Modules' : tab === 'processing' ? 'Process' : 'Notifs'}
                </button>
              ))}
            </div>

            {settingsTab === 'modules' && (
              <div className="space-y-2">
                {modules.map(m => (
                  <div key={m.id} className="flex items-center justify-between">
                    <span className="text-[10px]" style={{ color: 'rgba(255,255,255,0.5)' }}>{m.label}</span>
                    <button
                      onClick={() => toggleModule(m.id)}
                      className="w-7 h-4 rounded-full relative transition-all"
                      style={{ background: m.enabled ? 'rgba(52,211,153,0.8)' : 'rgba(255,255,255,0.1)', boxShadow: m.enabled ? '0 0 8px rgba(52,211,153,0.4)' : 'none' }}
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
                  <div className="flex justify-between text-[10px] mb-1" style={{ color: 'rgba(255,255,255,0.4)' }}>
                    <span>RAG Chunk Size</span><span style={{ color: '#34d399' }}>{ragChunkSize}</span>
                  </div>
                  <input type="range" min={128} max={2048} step={128} value={ragChunkSize}
                    onChange={e => setRagChunkSize(+e.target.value)}
                    className="w-full h-1 accent-emerald-400" />
                </div>
                <div>
                  <div className="flex justify-between text-[10px] mb-1" style={{ color: 'rgba(255,255,255,0.4)' }}>
                    <span>XAI Threshold</span><span style={{ color: '#34d399' }}>{xaiThreshold.toFixed(1)}</span>
                  </div>
                  <input type="range" min={0.1} max={1.0} step={0.1} value={xaiThreshold}
                    onChange={e => setXaiThreshold(+e.target.value)}
                    className="w-full h-1 accent-emerald-400" />
                </div>
              </div>
            )}

            {settingsTab === 'notifications' && (
              <div className="space-y-2">
                {['Graph complete', 'RAG responses', 'Agent updates', 'System alerts'].map(pref => (
                  <div key={pref} className="flex items-center justify-between">
                    <span className="text-[10px]" style={{ color: 'rgba(255,255,255,0.5)' }}>{pref}</span>
                    <button className="w-7 h-4 rounded-full relative" style={{ background: 'rgba(52,211,153,0.8)', boxShadow: '0 0 8px rgba(52,211,153,0.4)' }}>
                      <div className="absolute top-0.5 left-3.5 w-3 h-3 bg-white rounded-full shadow" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* User row */}
        <div className="flex items-center gap-2.5 px-3 py-2 mt-1 rounded-xl" style={{ border: '1px solid rgba(255,255,255,0.05)' }}>
          <div className="w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold text-white flex-shrink-0"
            style={{ background: 'linear-gradient(135deg, #34d399, #0d9488)', boxShadow: '0 0 8px rgba(52,211,153,0.4)' }}>K</div>
          <div className="flex-1 min-w-0">
            <div className="text-[10px] font-medium truncate" style={{ color: 'rgba(255,255,255,0.8)' }}>K. Kuppireddy</div>
            <div className="text-[9px]" style={{ color: '#34d399' }}>● Online</div>
          </div>
        </div>
      </div>
    </div>
  );
}
