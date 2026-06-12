import { useState } from 'react';
import { User, KeyRound, Shield, Activity, ExternalLink, Copy, CheckCircle, RefreshCw, Plus, Trash2 } from 'lucide-react';

const TABS = [
  { key: 'profile', label: 'Profile', icon: User },
  { key: 'api', label: 'API Keys', icon: KeyRound },
  { key: 'billing', label: 'Billing', icon: Shield },
  { key: 'activity', label: 'Activity', icon: Activity },
] as const;
type Tab = typeof TABS[number]['key'];

const mockKeys = [
  { id: 1, name: 'Production API', key: 'sk-aether-prod-x9k2m...', created: '2025-03-12', lastUsed: '2 hours ago', perms: 'Full Access' },
  { id: 2, name: 'Read-only Key', key: 'sk-aether-ro-7f3v...', created: '2025-05-01', lastUsed: '5 days ago', perms: 'Read Only' },
];

const mockActivity = [
  { action: 'Knowledge graph generated', time: '2h ago', type: 'graph', detail: 'Attention Mechanisms — 16 nodes' },
  { action: 'RAG query executed', time: '4h ago', type: 'rag', detail: 'Confidence: 89%' },
  { action: 'Journal entry saved', time: '8h ago', type: 'journal', detail: 'Mood: Happy (0.84)' },
  { action: 'XAI analysis completed', time: '1d ago', type: 'xai', detail: 'Feature importance computed' },
  { action: 'Settings updated', time: '2d ago', type: 'system', detail: 'Theme and model changed' },
];

const typeColor: Record<string, string> = { graph: 'bg-emerald-400', rag: 'bg-teal-400', journal: 'bg-pink-400', xai: 'bg-amber-400', system: 'bg-blue-400' };

export default function Account() {
  const [activeTab, setActiveTab] = useState<Tab>('profile');
  const [copied, setCopied] = useState<number | null>(null);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [profile, setProfile] = useState({
    name: 'K. Kuppireddy', email: 'bhageeratha@aether.ai',
    bio: 'AI researcher focused on knowledge graphs and explainable ML.', role: 'Lead Researcher',
    institution: 'Aether Research Lab', timezone: 'UTC-8 (PST)',
  });

  const copy = (id: number, key: string) => {
    navigator.clipboard.writeText(key).catch(() => {});
    setCopied(id); setTimeout(() => setCopied(null), 2000);
  };

  const save = () => {
    setSaving(true); setTimeout(() => { setSaving(false); setSaved(true); setTimeout(() => setSaved(false), 2000); }, 800);
  };

  return (
    <div className="h-screen flex flex-col bg-zinc-950">
      <div className="border-b border-zinc-800 bg-zinc-900/50 px-6 py-4">
        <h1 className="text-xl font-bold text-white flex items-center gap-2"><User className="w-5 h-5 text-zinc-400" />Account</h1>
        <p className="text-xs text-zinc-500 mt-0.5">Manage your profile, API keys, and usage</p>
      </div>

      <div className="flex flex-1 overflow-hidden">
        <div className="w-44 border-r border-zinc-800 bg-zinc-900/30 p-3 space-y-1">
          {TABS.map(tab => (
            <button key={tab.key} onClick={() => setActiveTab(tab.key)}
              className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-medium transition-all text-left ${activeTab === tab.key ? 'bg-zinc-800 text-white' : 'text-zinc-500 hover:text-white hover:bg-zinc-800/50'}`}>
              <tab.icon className="w-3.5 h-3.5" />{tab.label}
            </button>
          ))}
        </div>

        <div className="flex-1 overflow-auto p-6">
          {activeTab === 'profile' && (
            <div className="max-w-lg space-y-5">
              <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 flex items-center gap-5">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-emerald-400 to-teal-600 flex items-center justify-center text-2xl font-bold text-white flex-shrink-0">K</div>
                <div className="flex-1">
                  <div className="text-base font-bold text-white">{profile.name}</div>
                  <div className="text-xs text-zinc-500">{profile.email}</div>
                  <div className="mt-2 flex gap-2">
                    <span className="px-2 py-0.5 bg-emerald-500/10 text-emerald-400 text-[10px] rounded-full border border-emerald-500/20">Pro Plan</span>
                    <span className="px-2 py-0.5 bg-zinc-700 text-zinc-400 text-[10px] rounded-full">{profile.role}</span>
                  </div>
                </div>
                <button className="px-3 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded-xl text-xs transition-colors">Change Photo</button>
              </div>
              <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 space-y-4">
                {[{ label: 'Full Name', key: 'name' }, { label: 'Email', key: 'email' }, { label: 'Role', key: 'role' }, { label: 'Institution', key: 'institution' }].map(f => (
                  <div key={f.key}>
                    <label className="text-xs text-zinc-500 block mb-1">{f.label}</label>
                    <input value={profile[f.key as keyof typeof profile]} onChange={e => setProfile(p => ({ ...p, [f.key]: e.target.value }))}
                      className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500/50 transition-colors" />
                  </div>
                ))}
                <div>
                  <label className="text-xs text-zinc-500 block mb-1">Bio</label>
                  <textarea value={profile.bio} onChange={e => setProfile(p => ({ ...p, bio: e.target.value }))}
                    className="w-full h-20 bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-2.5 text-sm text-white resize-none focus:outline-none focus:border-emerald-500/50" />
                </div>
                <button onClick={save} disabled={saving}
                  className="flex items-center gap-2 px-6 py-2.5 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white rounded-xl text-sm font-medium transition-colors">
                  {saving ? <RefreshCw className="w-4 h-4 animate-spin" /> : saved ? <CheckCircle className="w-4 h-4" /> : null}
                  {saved ? 'Saved!' : saving ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </div>
          )}

          {activeTab === 'api' && (
            <div className="max-w-2xl space-y-4">
              <div className="flex items-center justify-between mb-2">
                <div className="text-xs text-zinc-500">{mockKeys.length} active keys</div>
                <button className="flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-medium transition-colors">
                  <Plus className="w-3.5 h-3.5" />New Key
                </button>
              </div>
              {mockKeys.map(k => (
                <div key={k.id} className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 hover:border-zinc-700 transition-colors">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <div className="font-semibold text-sm text-white">{k.name}</div>
                      <div className="text-[10px] text-zinc-500 mt-0.5">Created {k.created} · Last used {k.lastUsed}</div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 bg-zinc-800 text-zinc-400 text-[10px] rounded-full">{k.perms}</span>
                      <button className="p-1.5 text-zinc-600 hover:text-red-400 transition-colors"><Trash2 className="w-3.5 h-3.5" /></button>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 bg-zinc-800 rounded-xl px-3 py-2">
                    <code className="text-xs text-zinc-300 font-mono flex-1">{k.key}</code>
                    <button onClick={() => copy(k.id, k.key)} className="text-zinc-500 hover:text-white transition-colors">
                      {copied === k.id ? <CheckCircle className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'billing' && (
            <div className="max-w-lg space-y-4">
              <div className="bg-gradient-to-br from-emerald-500/15 to-teal-500/5 border border-emerald-500/25 rounded-2xl p-5">
                <div className="flex items-center justify-between mb-4">
                  <div><div className="text-lg font-bold text-white">Pro Plan</div><div className="text-sm text-zinc-400">$29/month · Unlimited queries</div></div>
                  <span className="px-3 py-1 bg-emerald-500/20 text-emerald-400 text-xs font-semibold rounded-full border border-emerald-500/30">Active</span>
                </div>
                <div className="grid grid-cols-3 gap-3 mb-4">
                  {[{ label: 'RAG Queries', value: '∞', sub: 'Unlimited' }, { label: 'Graphs', value: '∞', sub: 'Unlimited' }, { label: 'Storage', value: '50 GB', sub: '12.3 used' }].map(s => (
                    <div key={s.label} className="bg-zinc-900/50 rounded-xl p-3 text-center">
                      <div className="text-base font-bold text-white">{s.value}</div>
                      <div className="text-[9px] text-zinc-500">{s.label}</div>
                      <div className="text-[9px] text-emerald-400">{s.sub}</div>
                    </div>
                  ))}
                </div>
                <div className="flex gap-2">
                  <button className="flex-1 flex items-center justify-center gap-1.5 px-4 py-2 bg-zinc-700 hover:bg-zinc-600 text-white rounded-xl text-xs transition-colors"><ExternalLink className="w-3.5 h-3.5" />Manage Billing</button>
                  <button className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs transition-colors">Upgrade to Teams</button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'activity' && (
            <div className="max-w-lg space-y-2">
              <div className="text-xs text-zinc-500 mb-3">Recent activity across all platform features</div>
              {mockActivity.map((a, i) => (
                <div key={i} className="flex items-start gap-3 p-4 bg-zinc-900 border border-zinc-800 rounded-xl hover:border-zinc-700 transition-colors">
                  <div className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${typeColor[a.type] ?? 'bg-zinc-400'}`} />
                  <div className="flex-1"><div className="text-sm text-white">{a.action}</div><div className="text-xs text-zinc-500 mt-0.5">{a.detail}</div></div>
                  <div className="text-xs text-zinc-600 flex-shrink-0">{a.time}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
