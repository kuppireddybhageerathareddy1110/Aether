import { useState } from 'react';
import { User, KeyRound, Monitor, CreditCard, Database, Eye, EyeOff, Copy, Trash2, RefreshCw, CheckCircle } from 'lucide-react';

const apiKeys = [
  { id: 1, name: 'Production Key', prefix: 'aether-prod-', key: 'aether-prod-xK9mP2vQ8rT5nL1w', created: 'Jun 1, 2026', lastUsed: '2 min ago' },
  { id: 2, name: 'Development Key', prefix: 'aether-dev-', key: 'aether-dev-yH4jN7uB6sR3kM9p', created: 'May 15, 2026', lastUsed: '1 day ago' },
];

const sessions = [
  { device: 'Chrome on macOS', location: 'Hyderabad, India', ip: '103.xx.xx.xx', current: true, time: 'Active now' },
  { device: 'Firefox on Ubuntu', location: 'Bangalore, India', ip: '117.xx.xx.xx', current: false, time: '3 days ago' },
];

export default function Account() {
  const [activeTab, setActiveTab] = useState<'profile' | 'apikeys' | 'sessions' | 'plan' | 'quota'>('profile');
  const [revealed, setRevealed] = useState<Record<number, boolean>>({});
  const [copied, setCopied] = useState<number | null>(null);

  const copyKey = (id: number, key: string) => {
    navigator.clipboard.writeText(key).catch(() => {});
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  };

  const tabs = [
    { key: 'profile', label: 'Profile', icon: User },
    { key: 'apikeys', label: 'API Keys', icon: KeyRound },
    { key: 'sessions', label: 'Sessions', icon: Monitor },
    { key: 'plan', label: 'Plan', icon: CreditCard },
    { key: 'quota', label: 'Quota', icon: Database },
  ] as const;

  return (
    <div className="h-screen flex flex-col bg-zinc-950">
      <div className="border-b border-zinc-800 bg-zinc-900/50 px-6 py-4">
        <h1 className="text-xl font-bold text-white flex items-center gap-2">
          <User className="w-5 h-5 text-zinc-400" />Account
        </h1>
        <p className="text-xs text-zinc-500 mt-0.5">Manage your profile, API keys, and workspace settings</p>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Tab nav */}
        <div className="w-44 border-r border-zinc-800 bg-zinc-900/30 p-3 space-y-1">
          {tabs.map(tab => (
            <button key={tab.key} onClick={() => setActiveTab(tab.key)}
              className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-medium transition-all text-left ${activeTab === tab.key ? 'bg-zinc-800 text-white' : 'text-zinc-500 hover:text-white hover:bg-zinc-800/50'}`}>
              <tab.icon className="w-3.5 h-3.5" />{tab.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-auto p-6">
          {activeTab === 'profile' && (
            <div className="max-w-lg space-y-4">
              <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-400 to-teal-600 flex items-center justify-center text-2xl font-bold text-white">K</div>
                  <div>
                    <div className="text-lg font-bold text-white">K. Kuppireddy</div>
                    <div className="text-sm text-zinc-500">bhageeratha@aether.ai</div>
                    <div className="text-xs text-emerald-400 mt-0.5">● Online · Pro Plan</div>
                  </div>
                </div>
                {[{ label: 'Full Name', value: 'K. Bhogendranath Reddy Kuppireddy' }, { label: 'Email', value: 'bhageeratha@aether.ai' }, { label: 'Workspace', value: 'Aether Research Labs' }, { label: 'Timezone', value: 'Asia/Kolkata (UTC+5:30)' }].map(f => (
                  <div key={f.label} className="mb-4">
                    <label className="text-xs text-zinc-500 mb-1 block">{f.label}</label>
                    <input defaultValue={f.value} className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500/50" />
                  </div>
                ))}
                <button className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-sm font-medium transition-colors">Save Changes</button>
              </div>
            </div>
          )}

          {activeTab === 'apikeys' && (
            <div className="max-w-lg space-y-4">
              {apiKeys.map(k => (
                <div key={k.id} className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <div className="text-sm font-semibold text-white">{k.name}</div>
                      <div className="text-xs text-zinc-500 mt-0.5">Created {k.created} · Used {k.lastUsed}</div>
                    </div>
                    <button className="p-1.5 rounded-lg text-zinc-600 hover:text-red-400 hover:bg-zinc-800 transition-colors"><Trash2 className="w-3.5 h-3.5" /></button>
                  </div>
                  <div className="flex items-center gap-2 bg-zinc-950 border border-zinc-700 rounded-xl px-4 py-2.5">
                    <code className="text-xs text-zinc-300 flex-1 font-mono">
                      {revealed[k.id] ? k.key : k.prefix + '••••••••••••••••'}
                    </code>
                    <button onClick={() => setRevealed(p => ({ ...p, [k.id]: !p[k.id] }))} className="text-zinc-500 hover:text-zinc-300">
                      {revealed[k.id] ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                    </button>
                    <button onClick={() => copyKey(k.id, k.key)} className="text-zinc-500 hover:text-emerald-400">
                      {copied === k.id ? <CheckCircle className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>
              ))}
              <button className="flex items-center gap-2 px-5 py-2.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded-xl text-sm transition-colors">
                <RefreshCw className="w-3.5 h-3.5" />Generate New Key
              </button>
            </div>
          )}

          {activeTab === 'sessions' && (
            <div className="max-w-lg space-y-3">
              {sessions.map((s, i) => (
                <div key={i} className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 flex items-center justify-between">
                  <div className="flex items-start gap-3">
                    <Monitor className="w-4 h-4 text-zinc-500 mt-0.5" />
                    <div>
                      <div className="text-sm font-semibold text-white flex items-center gap-2">{s.device} {s.current && <span className="px-1.5 py-0.5 bg-emerald-500/20 text-emerald-400 text-[9px] rounded-full">Current</span>}</div>
                      <div className="text-xs text-zinc-500 mt-0.5">{s.location} · {s.ip}</div>
                      <div className="text-[10px] text-zinc-600 mt-0.5">{s.time}</div>
                    </div>
                  </div>
                  {!s.current && <button className="px-3 py-1.5 bg-red-500/10 text-red-400 border border-red-500/20 rounded-lg text-xs hover:bg-red-500/20 transition-colors">Revoke</button>}
                </div>
              ))}
            </div>
          )}

          {activeTab === 'plan' && (
            <div className="max-w-lg space-y-4">
              <div className="bg-gradient-to-br from-emerald-500/10 to-teal-500/5 border border-emerald-500/20 rounded-2xl p-6">
                <div className="text-xs text-emerald-400 font-semibold uppercase tracking-widest mb-1">Current Plan</div>
                <div className="text-3xl font-bold text-white mb-1">Pro</div>
                <div className="text-sm text-zinc-400 mb-4">$29/month · Renews Jul 1, 2026</div>
                {['Unlimited knowledge graphs', 'All 7 platform modules', 'GPT-4o access', 'Priority GPU compute', '50GB document storage', 'API access + webhooks'].map(f => (
                  <div key={f} className="flex items-center gap-2 mb-2 text-sm text-zinc-300">
                    <CheckCircle className="w-4 h-4 text-emerald-400 flex-shrink-0" />{f}
                  </div>
                ))}
              </div>
              <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5">
                <div className="text-sm font-semibold text-white mb-3">Upgrade to Enterprise</div>
                <div className="text-xs text-zinc-500 mb-4">Custom models, SSO, dedicated infrastructure, SLA guarantees</div>
                <button className="px-5 py-2.5 bg-white text-black rounded-xl text-sm font-medium">Contact Sales</button>
              </div>
            </div>
          )}

          {activeTab === 'quota' && (
            <div className="max-w-lg space-y-4">
              {[
                { label: 'Document Storage', used: 12.4, total: 50, unit: 'GB', color: 'bg-blue-500' },
                { label: 'Knowledge Graphs', used: 12, total: 100, unit: 'graphs', color: 'bg-emerald-500' },
                { label: 'RAG Queries', used: 847, total: 5000, unit: 'queries/mo', color: 'bg-violet-500' },
                { label: 'XAI Explanations', used: 89, total: 1000, unit: 'queries/mo', color: 'bg-amber-500' },
                { label: 'Agent Runs', used: 23, total: 200, unit: 'runs/mo', color: 'bg-pink-500' },
              ].map(q => (
                <div key={q.label} className="bg-zinc-900 border border-zinc-800 rounded-xl p-4">
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-white font-medium">{q.label}</span>
                    <span className="text-zinc-500">{q.used} / {q.total} {q.unit}</span>
                  </div>
                  <div className="h-2 bg-zinc-800 rounded-full overflow-hidden">
                    <div className={`h-full ${q.color} rounded-full transition-all`} style={{ width: `${(q.used / q.total) * 100}%` }} />
                  </div>
                  <div className="text-[10px] text-zinc-500 mt-1">{((q.used / q.total) * 100).toFixed(0)}% used</div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
