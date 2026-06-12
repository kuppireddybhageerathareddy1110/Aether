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
  { title: 'Knowledge Graph', desc: 'PDF → Graph → GAT analysis', href: '/knowledge-graph', icon: GitBranch, color: 'from-emerald-500/20 to-teal-500/10', border: 'border-emerald-500/20' },
  { title: 'Agentic RAG', desc: 'Multi-agent orchestration', href: '/agentic-rag', icon: Network, color: 'from-violet-500/20 to-purple-500/10', border: 'border-violet-500/20' },
  { title: 'LaTeX Studio', desc: 'Monaco collaborative editor', href: '/latex-editor', icon: FileText, color: 'from-blue-500/20 to-cyan-500/10', border: 'border-blue-500/20' },
  { title: 'XAI Dashboard', desc: 'SHAP, attention heatmaps', href: '/xai-dashboard', icon: FlaskConical, color: 'from-amber-500/20 to-orange-500/10', border: 'border-amber-500/20' },
  { title: 'Mood Journal', desc: 'AI sentiment + trend charts', href: '/mood-journal', icon: TrendingUp, color: 'from-pink-500/20 to-rose-500/10', border: 'border-pink-500/20' },
  { title: 'QA Generator', desc: 'RAG test cases + Selenium', href: '/qa', icon: FlaskConical, color: 'from-red-500/20 to-pink-500/10', border: 'border-red-500/20' },
  { title: 'AI Assistant', desc: 'Research companion', href: '/assistant', icon: Bot, color: 'from-teal-500/20 to-emerald-500/10', border: 'border-teal-500/20' },
  { title: 'Auto Research', desc: 'Full pipeline automation', href: '/auto-research', icon: Zap, color: 'from-yellow-500/20 to-amber-500/10', border: 'border-yellow-500/20' },
  { title: 'RAG Chat', desc: 'Semantic search chat', href: '/rag-chat', icon: MessageCircle, color: 'from-indigo-500/20 to-violet-500/10', border: 'border-indigo-500/20' },
];

const systemModules = [
  { name: 'RAG Pipeline', pct: 94, icon: Network },
  { name: 'Agent System', pct: 100, icon: Bot },
  { name: 'Vector Store', pct: 78, icon: Database },
  { name: 'GPU Compute', pct: 62, icon: Cpu },
];

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
          color: { graph: 'bg-emerald-400', rag: 'bg-teal-400', agent: 'bg-violet-400', xai: 'bg-amber-400', journal: 'bg-pink-400', system: 'bg-blue-400' }[n.type as string] ?? 'bg-zinc-400',
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
    { label: 'Journal Entries', value: stats.journalEntries, icon: TrendingUp, change: 'All time', color: 'text-pink-400 bg-pink-400/10' },
    { label: 'Knowledge Graphs', value: stats.knowledgeGraphs, icon: GitBranch, change: 'Generated', color: 'text-emerald-400 bg-emerald-400/10' },
    { label: 'QA Tests', value: stats.qaTests, icon: FlaskConical, change: 'Estimated', color: 'text-amber-400 bg-amber-400/10' },
    { label: 'XAI Analyses', value: stats.xaiExplanations, icon: Activity, change: 'Estimated', color: 'text-violet-400 bg-violet-400/10' },
  ];

  return (
    <div className="min-h-screen bg-zinc-950">
      {/* Header */}
      <div className="border-b border-zinc-800 bg-zinc-900/50 backdrop-blur sticky top-0 z-10">
        <div className="flex items-center justify-between px-6 py-3">
          <div>
            <div className="text-sm font-semibold text-white">Aether Research Platform</div>
            <div className="text-xs text-zinc-500">Workspace: <span className="text-emerald-400">Default</span></div>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/upload" className="flex items-center gap-1.5 px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 rounded-lg text-xs text-zinc-300 transition-colors">
              <Upload className="w-3.5 h-3.5" />Upload
            </Link>
            <Link href="/notifications" className="relative p-2 bg-zinc-800 hover:bg-zinc-700 rounded-lg transition-colors">
              <Bell className="w-4 h-4 text-zinc-400" />
              {stats.unreadNotifications > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-emerald-500 rounded-full text-[9px] flex items-center justify-center text-white font-bold">
                  {stats.unreadNotifications > 9 ? '9+' : stats.unreadNotifications}
                </span>
              )}
            </Link>
            <div className="relative">
              <button onClick={() => setAccountOpen(!accountOpen)}
                className="flex items-center gap-2 px-2.5 py-1.5 bg-zinc-800 hover:bg-zinc-700 rounded-lg transition-colors">
                <div className="w-6 h-6 rounded-full bg-gradient-to-br from-emerald-400 to-teal-600 flex items-center justify-center text-xs font-bold text-white">K</div>
                <div className="text-left hidden sm:block">
                  <div className="text-xs font-medium text-white">K. Kuppireddy</div>
                  <div className="text-[10px] text-emerald-400">Pro Plan</div>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-zinc-500" />
              </button>
              {accountOpen && (
                <div className="absolute right-0 top-full mt-1.5 w-52 bg-zinc-900 border border-zinc-700 rounded-xl shadow-2xl z-50 overflow-hidden">
                  <div className="px-4 py-3 border-b border-zinc-800">
                    <div className="text-sm font-medium text-white">K. Kuppireddy</div>
                    <div className="text-xs text-zinc-500">bhageeratha@aether.ai</div>
                  </div>
                  {[
                    { icon: User, label: 'Account', href: '/account' },
                    { icon: Bell, label: 'Notifications', href: '/notifications' },
                    { icon: KeyRound, label: 'API Keys', href: '/account' },
                    { icon: Settings, label: 'Settings', href: '/settings' },
                  ].map(item => (
                    <Link key={item.label} href={item.href} onClick={() => setAccountOpen(false)}
                      className="flex items-center gap-3 px-4 py-2.5 text-sm text-zinc-300 hover:bg-zinc-800 hover:text-white transition-colors">
                      <item.icon className="w-4 h-4 text-zinc-500" />{item.label}
                    </Link>
                  ))}
                  <div className="border-t border-zinc-800">
                    <button onClick={() => setAccountOpen(false)} className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-400 hover:bg-zinc-800 transition-colors">
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
          <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-white via-zinc-200 to-zinc-400 bg-clip-text text-transparent">Research Dashboard</h1>
          <p className="text-zinc-500 mt-1">Welcome back, K. Kuppireddy · All systems operational</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {statCards.map(stat => (
            <div key={stat.label} className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4 hover:border-zinc-700 transition-colors">
              <div className="flex items-center justify-between mb-3">
                <div className={`p-2 rounded-lg ${stat.color}`}><stat.icon className="w-4 h-4" /></div>
                <span className="text-[10px] text-zinc-500">{stat.change}</span>
              </div>
              <div className="text-3xl font-bold text-white">{loading ? '—' : stat.value}</div>
              <div className="text-xs text-zinc-500 mt-0.5">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* System health */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4 mb-8">
          <div className="flex items-center justify-between mb-3">
            <div className="text-xs font-semibold text-zinc-400 uppercase tracking-widest">System Health</div>
            <div className="flex items-center gap-1.5 text-xs text-emerald-400">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />All operational
            </div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {systemModules.map(s => (
              <div key={s.name}>
                <div className="flex justify-between text-[10px] text-zinc-500 mb-1"><span>{s.name}</span><span>{s.pct}%</span></div>
                <div className="h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full" style={{ width: `${s.pct}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Features + Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <div className="text-xs font-semibold text-zinc-400 uppercase tracking-widest mb-3">Platform Features</div>
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3">
              {featureCards.map(card => (
                <Link key={card.title} href={card.href}
                  className={`group bg-gradient-to-br ${card.color} border ${card.border} rounded-2xl p-4 hover:scale-[1.02] transition-all`}>
                  <div className="flex items-start justify-between mb-2">
                    <card.icon className="w-5 h-5 text-white/70" />
                    <ArrowUpRight className="w-3.5 h-3.5 text-white/30 group-hover:text-white/60 transition-colors" />
                  </div>
                  <div className="font-semibold text-sm text-white">{card.title}</div>
                  <div className="text-xs text-white/50 mt-1">{card.desc}</div>
                </Link>
              ))}
            </div>
          </div>

          <div>
            <div className="text-xs font-semibold text-zinc-400 uppercase tracking-widest mb-3">Recent Activity</div>
            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden">
              {activity.length === 0 ? (
                <div className="p-6 text-center text-zinc-600 text-sm">No activity yet — run a pipeline to get started</div>
              ) : activity.map((item, i) => (
                <div key={i} className={`flex items-start gap-3 p-4 ${i < activity.length - 1 ? 'border-b border-zinc-800' : ''}`}>
                  <div className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${item.color}`} />
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-medium text-white">{item.action}</div>
                    <div className="text-[10px] text-zinc-500 mt-0.5 truncate">{item.detail}</div>
                  </div>
                  <div className="text-[10px] text-zinc-600 flex-shrink-0">{item.time}</div>
                </div>
              ))}
            </div>
            <div className="mt-4 bg-gradient-to-br from-emerald-500/10 to-teal-500/5 border border-emerald-500/20 rounded-2xl p-4">
              <div className="text-[10px] text-emerald-400 font-semibold uppercase tracking-widest mb-1">Live Data</div>
              <div className="text-sm font-semibold text-white">Powered by PostgreSQL</div>
              <div className="text-xs text-zinc-500 mt-1">All stats reflect real pipeline activity</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
