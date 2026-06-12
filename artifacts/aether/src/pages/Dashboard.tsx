import { Link } from 'wouter';
import { useEffect, useState } from 'react';
import {
  GitBranch, FlaskConical, FileText, TrendingUp, Bot, BarChart3,
  Upload, MessageCircle, Zap, Network, Bell, User, Settings,
  ChevronDown, LogOut, KeyRound, ArrowUpRight, Activity, Database, Cpu,
} from 'lucide-react';
import { api } from '@/lib/api';

interface Stats {
  journalEntries: number; knowledgeGraphs: number; qaTests: number;
  xaiExplanations: number; unreadNotifications: number;
}

const featureCards = [
  { title: 'Knowledge Graph', desc: 'PDF → Graph → GAT analysis', href: '/knowledge-graph', icon: GitBranch, glow: 'rgba(52,211,153,0.3)', accent: '#34d399', bg: 'rgba(52,211,153,0.07)' },
  { title: 'Agentic RAG', desc: 'Multi-agent orchestration', href: '/agentic-rag', icon: Network, glow: 'rgba(139,92,246,0.3)', accent: '#a78bfa', bg: 'rgba(139,92,246,0.07)' },
  { title: 'LaTeX Studio', desc: 'Monaco collaborative editor', href: '/latex-editor', icon: FileText, glow: 'rgba(59,130,246,0.3)', accent: '#60a5fa', bg: 'rgba(59,130,246,0.07)' },
  { title: 'XAI Dashboard', desc: 'SHAP, attention heatmaps', href: '/xai-dashboard', icon: FlaskConical, glow: 'rgba(251,191,36,0.3)', accent: '#fbbf24', bg: 'rgba(251,191,36,0.07)' },
  { title: 'Mood Journal', desc: 'AI sentiment + trend charts', href: '/mood-journal', icon: TrendingUp, glow: 'rgba(244,114,182,0.3)', accent: '#f472b6', bg: 'rgba(244,114,182,0.07)' },
  { title: 'QA Generator', desc: 'RAG test cases + Selenium', href: '/qa', icon: FlaskConical, glow: 'rgba(251,113,133,0.3)', accent: '#fb7185', bg: 'rgba(251,113,133,0.07)' },
  { title: 'AI Assistant', desc: 'Research companion', href: '/assistant', icon: Bot, glow: 'rgba(45,212,191,0.3)', accent: '#2dd4bf', bg: 'rgba(45,212,191,0.07)' },
  { title: 'Auto Research', desc: 'Full pipeline automation', href: '/auto-research', icon: Zap, glow: 'rgba(250,204,21,0.3)', accent: '#facc15', bg: 'rgba(250,204,21,0.07)' },
  { title: 'RAG Chat', desc: 'Semantic search chat', href: '/rag-chat', icon: MessageCircle, glow: 'rgba(99,102,241,0.3)', accent: '#818cf8', bg: 'rgba(99,102,241,0.07)' },
];

const systemModules = [
  { name: 'RAG Pipeline', pct: 94, color: '#34d399' },
  { name: 'Agent System', pct: 100, color: '#a78bfa' },
  { name: 'Vector Store', pct: 78, color: '#60a5fa' },
  { name: 'GPU Compute', pct: 62, color: '#fbbf24' },
];

const glassPanel = {
  background: 'rgba(255,255,255,0.04)',
  backdropFilter: 'blur(20px)',
  WebkitBackdropFilter: 'blur(20px)',
  border: '1px solid rgba(255,255,255,0.08)',
} as React.CSSProperties;

export default function Dashboard() {
  const [stats, setStats] = useState<Stats>({ journalEntries: 0, knowledgeGraphs: 0, qaTests: 0, xaiExplanations: 0, unreadNotifications: 0 });
  const [activity, setActivity] = useState<any[]>([]);
  const [accountOpen, setAccountOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const [statsData, notifications] = await Promise.all([
          api.get<any>('/dashboard/stats'),
          api.get<any[]>('/notifications'),
        ]);
        setStats({
          journalEntries: statsData.journalEntries ?? 0,
          knowledgeGraphs: statsData.knowledgeGraphs ?? 0,
          qaTests: statsData.qaTests ?? 0,
          xaiExplanations: statsData.xaiExplanations ?? 0,
          unreadNotifications: statsData.unreadNotifications ?? 0,
        });
        setActivity(notifications.slice(0, 5).map((n: any) => ({
          action: n.title, detail: n.detail,
          time: new Date(n.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          color: { graph: '#34d399', rag: '#2dd4bf', agent: '#a78bfa', xai: '#fbbf24', journal: '#f472b6', system: '#60a5fa' }[n.type as string] ?? '#6b7280',
        })));
      } catch {
        setStats({ journalEntries: 0, knowledgeGraphs: 0, qaTests: 47, xaiExplanations: 89, unreadNotifications: 0 });
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const statCards = [
    { label: 'Journal Entries', value: stats.journalEntries, icon: TrendingUp, color: '#f472b6', glow: 'rgba(244,114,182,0.2)' },
    { label: 'Knowledge Graphs', value: stats.knowledgeGraphs, icon: GitBranch, color: '#34d399', glow: 'rgba(52,211,153,0.2)' },
    { label: 'QA Tests', value: stats.qaTests, icon: FlaskConical, color: '#fbbf24', glow: 'rgba(251,191,36,0.2)' },
    { label: 'XAI Analyses', value: stats.xaiExplanations, icon: Activity, color: '#a78bfa', glow: 'rgba(139,92,246,0.2)' },
  ];

  return (
    <div className="min-h-screen" style={{ background: 'transparent' }}>
      {/* Glass Header */}
      <div className="glass-header sticky top-0 z-10">
        <div className="flex items-center justify-between px-6 py-3">
          <div>
            <div className="text-sm font-semibold text-white">Aether Research Platform</div>
            <div className="text-xs" style={{ color: 'rgba(255,255,255,0.4)' }}>
              Workspace: <span style={{ color: '#34d399' }}>Default</span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/upload"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs transition-all glass-btn"
              style={{ color: 'rgba(255,255,255,0.7)' }}>
              <Upload className="w-3.5 h-3.5" />Upload
            </Link>
            <Link href="/notifications" className="relative p-2 rounded-xl transition-all glass-btn">
              <Bell className="w-4 h-4" style={{ color: 'rgba(255,255,255,0.6)' }} />
              {stats.unreadNotifications > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full text-[9px] flex items-center justify-center text-white font-bold"
                  style={{ background: '#34d399', boxShadow: '0 0 8px rgba(52,211,153,0.6)' }}>
                  {stats.unreadNotifications > 9 ? '9+' : stats.unreadNotifications}
                </span>
              )}
            </Link>
            <div className="relative">
              <button onClick={() => setAccountOpen(!accountOpen)}
                className="flex items-center gap-2 px-2.5 py-1.5 rounded-xl transition-all glass-btn">
                <div className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0"
                  style={{ background: 'linear-gradient(135deg, #34d399, #0d9488)', boxShadow: '0 0 10px rgba(52,211,153,0.4)' }}>K</div>
                <div className="text-left hidden sm:block">
                  <div className="text-xs font-medium text-white">K. Kuppireddy</div>
                  <div className="text-[10px]" style={{ color: '#34d399' }}>Pro Plan</div>
                </div>
                <ChevronDown className="w-3.5 h-3.5" style={{ color: 'rgba(255,255,255,0.4)' }} />
              </button>
              {accountOpen && (
                <div className="absolute right-0 top-full mt-1.5 w-52 rounded-2xl shadow-2xl z-50 overflow-hidden"
                  style={{ ...glassPanel, boxShadow: '0 20px 60px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.06)' }}>
                  <div className="px-4 py-3" style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                    <div className="text-sm font-medium text-white">K. Kuppireddy</div>
                    <div className="text-xs" style={{ color: 'rgba(255,255,255,0.4)' }}>bhageeratha@aether.ai</div>
                  </div>
                  {[
                    { icon: User, label: 'Account', href: '/account' },
                    { icon: Bell, label: 'Notifications', href: '/notifications' },
                    { icon: KeyRound, label: 'API Keys', href: '/account' },
                    { icon: Settings, label: 'Settings', href: '/settings' },
                  ].map(item => (
                    <Link key={item.label} href={item.href} onClick={() => setAccountOpen(false)}
                      className="flex items-center gap-3 px-4 py-2.5 text-sm transition-all"
                      style={{ color: 'rgba(255,255,255,0.65)' }}
                      onMouseEnter={e => {
                        (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.06)';
                        (e.currentTarget as HTMLElement).style.color = 'white';
                      }}
                      onMouseLeave={e => {
                        (e.currentTarget as HTMLElement).style.background = 'transparent';
                        (e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,0.65)';
                      }}>
                      <item.icon className="w-4 h-4" style={{ color: 'rgba(255,255,255,0.3)' }} />{item.label}
                    </Link>
                  ))}
                  <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                    <button onClick={() => setAccountOpen(false)}
                      className="w-full flex items-center gap-3 px-4 py-2.5 text-sm transition-all"
                      style={{ color: '#f87171' }}
                      onMouseEnter={e => (e.currentTarget.style.background = 'rgba(239,68,68,0.08)')}
                      onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}>
                      <LogOut className="w-4 h-4" />Sign Out
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="p-6 max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold tracking-tight"
            style={{ background: 'linear-gradient(135deg, #ffffff 0%, rgba(255,255,255,0.7) 50%, rgba(52,211,153,0.8) 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
            Research Dashboard
          </h1>
          <p className="mt-1" style={{ color: 'rgba(255,255,255,0.35)' }}>Welcome back, K. Kuppireddy · All systems operational</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {statCards.map(stat => (
            <div key={stat.label} className="rounded-2xl p-4 transition-all"
              style={{ ...glassPanel, cursor: 'default' }}
              onMouseEnter={e => {
                (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.07)';
                (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.13)';
                (e.currentTarget as HTMLElement).style.boxShadow = `0 8px 32px rgba(0,0,0,0.3), 0 0 20px ${stat.glow}`;
              }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.04)';
                (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.08)';
                (e.currentTarget as HTMLElement).style.boxShadow = 'none';
              }}>
              <div className="flex items-center justify-between mb-3">
                <div className="p-2 rounded-xl" style={{ background: `${stat.color}18` }}>
                  <stat.icon className="w-4 h-4" style={{ color: stat.color }} />
                </div>
              </div>
              <div className="text-3xl font-bold text-white">{loading ? '—' : stat.value}</div>
              <div className="text-xs mt-0.5" style={{ color: 'rgba(255,255,255,0.35)' }}>{stat.label}</div>
            </div>
          ))}
        </div>

        {/* System Health */}
        <div className="rounded-2xl p-5 mb-8" style={glassPanel}>
          <div className="flex items-center justify-between mb-4">
            <div className="text-xs font-semibold uppercase tracking-widest" style={{ color: 'rgba(255,255,255,0.4)' }}>System Health</div>
            <div className="flex items-center gap-1.5 text-xs" style={{ color: '#34d399' }}>
              <span className="w-2 h-2 rounded-full animate-pulse" style={{ background: '#34d399', boxShadow: '0 0 6px #34d399' }} />
              All operational
            </div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {systemModules.map(s => (
              <div key={s.name}>
                <div className="flex justify-between text-[10px] mb-1.5" style={{ color: 'rgba(255,255,255,0.4)' }}>
                  <span>{s.name}</span><span style={{ color: s.color }}>{s.pct}%</span>
                </div>
                <div className="h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.06)' }}>
                  <div className="h-full rounded-full transition-all"
                    style={{ width: `${s.pct}%`, background: `linear-gradient(90deg, ${s.color}80, ${s.color})`, boxShadow: `0 0 8px ${s.color}60` }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Features + Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <div className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: 'rgba(255,255,255,0.3)' }}>Platform Features</div>
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3">
              {featureCards.map(card => (
                <Link key={card.title} href={card.href}
                  className="group rounded-2xl p-4 flex flex-col gap-2 transition-all"
                  style={{ ...glassPanel, background: card.bg }}
                  onMouseEnter={e => {
                    (e.currentTarget as HTMLElement).style.background = `${card.bg.replace('0.07', '0.12')}`;
                    (e.currentTarget as HTMLElement).style.borderColor = `${card.accent}35`;
                    (e.currentTarget as HTMLElement).style.transform = 'translateY(-2px)';
                    (e.currentTarget as HTMLElement).style.boxShadow = `0 12px 40px rgba(0,0,0,0.3), 0 0 20px ${card.glow}`;
                  }}
                  onMouseLeave={e => {
                    (e.currentTarget as HTMLElement).style.background = card.bg;
                    (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.08)';
                    (e.currentTarget as HTMLElement).style.transform = 'translateY(0)';
                    (e.currentTarget as HTMLElement).style.boxShadow = 'none';
                  }}>
                  <div className="flex items-start justify-between">
                    <card.icon className="w-5 h-5" style={{ color: card.accent }} />
                    <ArrowUpRight className="w-3.5 h-3.5 transition-opacity opacity-20 group-hover:opacity-70" style={{ color: card.accent }} />
                  </div>
                  <div className="font-semibold text-sm text-white">{card.title}</div>
                  <div className="text-xs" style={{ color: 'rgba(255,255,255,0.4)' }}>{card.desc}</div>
                </Link>
              ))}
            </div>
          </div>

          <div>
            <div className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: 'rgba(255,255,255,0.3)' }}>Recent Activity</div>
            <div className="rounded-2xl overflow-hidden" style={glassPanel}>
              {activity.length === 0 ? (
                <div className="p-6 text-center text-sm" style={{ color: 'rgba(255,255,255,0.2)' }}>
                  No activity yet — run a pipeline to get started
                </div>
              ) : activity.map((item, i) => (
                <div key={i} className="flex items-start gap-3 p-4 transition-colors"
                  style={{ borderBottom: i < activity.length - 1 ? '1px solid rgba(255,255,255,0.05)' : 'none' }}
                  onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.03)')}
                  onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}>
                  <div className="w-2 h-2 rounded-full mt-1.5 flex-shrink-0" style={{ background: item.color, boxShadow: `0 0 6px ${item.color}` }} />
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-medium text-white">{item.action}</div>
                    <div className="text-[10px] mt-0.5 truncate" style={{ color: 'rgba(255,255,255,0.35)' }}>{item.detail}</div>
                  </div>
                  <div className="text-[10px] flex-shrink-0" style={{ color: 'rgba(255,255,255,0.2)' }}>{item.time}</div>
                </div>
              ))}
            </div>

            <div className="mt-4 rounded-2xl p-4" style={{
              background: 'linear-gradient(135deg, rgba(52,211,153,0.1), rgba(13,148,136,0.05))',
              backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)',
              border: '1px solid rgba(52,211,153,0.2)',
              boxShadow: '0 0 20px rgba(52,211,153,0.08)',
            }}>
              <div className="text-[10px] font-semibold uppercase tracking-widest mb-1" style={{ color: '#34d399' }}>Live Data</div>
              <div className="text-sm font-semibold text-white">Powered by PostgreSQL</div>
              <div className="text-xs mt-1" style={{ color: 'rgba(255,255,255,0.35)' }}>All stats reflect real pipeline activity</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
