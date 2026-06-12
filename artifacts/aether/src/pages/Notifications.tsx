import { useState, useEffect } from 'react';
import { Bell, CheckCheck, Trash2, GitBranch, Bot, FlaskConical, TrendingUp, Zap, CheckCircle, RefreshCw } from 'lucide-react';
import { api } from '@/lib/api';

type NotifType = 'graph' | 'agent' | 'xai' | 'journal' | 'system' | 'rag';
interface Notif { id: number; type: NotifType; title: string; detail: string; createdAt: string; read: boolean; }

const iconMap: Record<string, any> = { graph: GitBranch, agent: Bot, xai: FlaskConical, journal: TrendingUp, system: Zap, rag: Bell };
const colorMap: Record<string, string> = { graph: 'text-emerald-400 bg-emerald-400/10', agent: 'text-violet-400 bg-violet-400/10', xai: 'text-amber-400 bg-amber-400/10', journal: 'text-pink-400 bg-pink-400/10', system: 'text-blue-400 bg-blue-400/10', rag: 'text-teal-400 bg-teal-400/10' };

export default function Notifications() {
  const [notifs, setNotifs] = useState<Notif[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'unread' | NotifType>('all');

  const load = async () => {
    setLoading(true);
    try { const data = await api.get<Notif[]>('/notifications'); setNotifs(data); }
    catch { } finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  const markAllRead = async () => {
    try {
      await api.patch('/notifications/read-all');
      setNotifs(prev => prev.map(n => ({ ...n, read: true })));
    } catch { }
  };

  const markRead = async (id: number) => {
    try {
      await api.patch(`/notifications/${id}/read`);
      setNotifs(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
    } catch { }
  };

  const remove = async (id: number) => {
    try {
      await api.delete(`/notifications/${id}`);
      setNotifs(prev => prev.filter(n => n.id !== id));
    } catch { }
  };

  const filtered = notifs.filter(n => filter === 'all' ? true : filter === 'unread' ? !n.read : n.type === filter);
  const unreadCount = notifs.filter(n => !n.read).length;

  return (
    <div className="h-screen flex flex-col bg-zinc-950">
      <div className="border-b border-zinc-800 bg-zinc-900/50 px-6 py-4 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-white flex items-center gap-2">
            <Bell className="w-5 h-5 text-blue-400" />Notifications
            {unreadCount > 0 && <span className="px-2 py-0.5 bg-blue-500 text-white text-xs font-bold rounded-full">{unreadCount}</span>}
          </h1>
          <p className="text-xs text-zinc-500 mt-0.5">Platform alerts and pipeline status updates</p>
        </div>
        <div className="flex gap-2">
          <button onClick={load} className="p-2 text-zinc-500 hover:text-white hover:bg-zinc-800 rounded-lg transition-colors">
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
          <button onClick={markAllRead} className="flex items-center gap-1.5 px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded-xl text-xs transition-colors">
            <CheckCheck className="w-3.5 h-3.5" />Mark all read
          </button>
        </div>
      </div>

      <div className="border-b border-zinc-800 px-6">
        <div className="flex gap-1 py-2 flex-wrap">
          {[['all', 'All'], ['unread', `Unread (${unreadCount})`], ['graph', 'Graph'], ['rag', 'RAG'], ['agent', 'Agents'], ['xai', 'XAI'], ['journal', 'Journal'], ['system', 'System']].map(([k, label]) => (
            <button key={k} onClick={() => setFilter(k as any)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${filter === k ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30' : 'text-zinc-500 hover:text-white hover:bg-zinc-800'}`}>
              {label}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-auto p-6">
        <div className="max-w-2xl mx-auto space-y-2">
          {loading ? (
            <div className="text-center py-16 text-zinc-500 text-sm">Loading notifications...</div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-16 text-zinc-600">
              <CheckCircle className="w-10 h-10 mx-auto mb-3 text-zinc-700" />
              <div className="text-sm">{filter === 'all' ? 'No notifications yet — run pipelines to generate alerts' : 'No notifications in this category'}</div>
            </div>
          ) : filtered.map(notif => {
            const Icon = iconMap[notif.type] ?? Bell;
            const colorClass = colorMap[notif.type] ?? 'text-zinc-400 bg-zinc-400/10';
            const timeAgo = (() => {
              const diff = Date.now() - new Date(notif.createdAt).getTime();
              if (diff < 60000) return 'just now';
              if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
              if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`;
              return `${Math.floor(diff / 86400000)}d ago`;
            })();
            return (
              <div key={notif.id} className={`flex items-start gap-4 p-4 rounded-2xl border transition-all ${!notif.read ? 'bg-zinc-900 border-zinc-700' : 'bg-zinc-900/40 border-zinc-800/50'}`}>
                <div className={`p-2.5 rounded-xl flex-shrink-0 ${colorClass}`}><Icon className="w-4 h-4" /></div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="text-sm font-semibold text-white">{notif.title}</span>
                    {!notif.read && <span className="w-2 h-2 rounded-full bg-blue-400 flex-shrink-0" />}
                  </div>
                  <div className="text-xs text-zinc-400 leading-relaxed">{notif.detail}</div>
                  <div className="text-[10px] text-zinc-600 mt-1">{timeAgo}</div>
                </div>
                <div className="flex gap-1 flex-shrink-0">
                  {!notif.read && (
                    <button onClick={() => markRead(notif.id)} title="Mark read"
                      className="p-1.5 rounded-lg text-zinc-600 hover:text-emerald-400 hover:bg-zinc-800 transition-colors">
                      <CheckCircle className="w-3.5 h-3.5" />
                    </button>
                  )}
                  <button onClick={() => remove(notif.id)} title="Delete"
                    className="p-1.5 rounded-lg text-zinc-600 hover:text-red-400 hover:bg-zinc-800 transition-colors">
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
