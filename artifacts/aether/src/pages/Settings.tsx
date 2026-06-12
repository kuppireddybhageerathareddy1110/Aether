import { useState, useEffect } from 'react';
import { Settings as SettingsIcon, Palette, Brain, Database, Bell, Shield, Monitor, Sun, Moon, RefreshCw, CheckCircle } from 'lucide-react';
import { api } from '@/lib/api';

const TABS = [
  { key: 'appearance', label: 'Appearance', icon: Palette },
  { key: 'models', label: 'Models & AI', icon: Brain },
  { key: 'rag', label: 'RAG Pipeline', icon: Database },
  { key: 'notifications', label: 'Notifications', icon: Bell },
  { key: 'security', label: 'Security', icon: Shield },
] as const;

type Tab = typeof TABS[number]['key'];

export default function Settings() {
  const [activeTab, setActiveTab] = useState<Tab>('appearance');
  const [settings, setSettings] = useState<Record<string, any>>({
    theme: 'dark', accentColor: '#10b981', density: 'default', model: 'gpt-4o',
    ragChunkSize: 512, ragTopK: 12, xaiThreshold: 0.7,
    notifGraph: true, notifRag: true, notifAgent: false, notifJournal: true, notifSystem: true, notifDigest: false,
    twoFactor: false, sessionTimeout: true, loginNotifications: true,
  });
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get<Record<string, any>>('/settings')
      .then(data => setSettings(prev => ({ ...prev, ...data })))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const set = (key: string, value: any) => setSettings(prev => ({ ...prev, [key]: value }));

  const save = async () => {
    setSaving(true);
    try {
      const updated = await api.put<Record<string, any>>('/settings', settings);
      setSettings(prev => ({ ...prev, ...updated }));
      setSaved(true); setTimeout(() => setSaved(false), 2000);
    } catch { } finally { setSaving(false); }
  };

  const Toggle = ({ k }: { k: string }) => (
    <button onClick={() => set(k, !settings[k])}
      className={`w-10 h-5 rounded-full relative transition-colors ${settings[k] ? 'bg-emerald-500' : 'bg-zinc-700'}`}>
      <div className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${settings[k] ? 'left-5' : 'left-0.5'}`} />
    </button>
  );

  if (loading) return <div className="flex items-center justify-center h-screen text-zinc-500">Loading settings...</div>;

  return (
    <div className="h-screen flex flex-col bg-zinc-950">
      <div className="border-b border-zinc-800 bg-zinc-900/50 px-6 py-4">
        <h1 className="text-xl font-bold text-white flex items-center gap-2"><SettingsIcon className="w-5 h-5 text-zinc-400" />Settings</h1>
        <p className="text-xs text-zinc-500 mt-0.5">Configure platform preferences and defaults</p>
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
          {activeTab === 'appearance' && (
            <div className="max-w-lg space-y-5">
              <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5">
                <div className="text-sm font-semibold text-white mb-4">Theme</div>
                <div className="grid grid-cols-3 gap-3">
                  {[{ k: 'dark', label: 'Dark', icon: Moon }, { k: 'light', label: 'Light', icon: Sun }, { k: 'system', label: 'System', icon: Monitor }].map(t => (
                    <button key={t.k} onClick={() => set('theme', t.k)}
                      className={`flex flex-col items-center gap-2 p-4 rounded-xl border transition-all ${settings.theme === t.k ? 'border-emerald-500/40 bg-emerald-500/10' : 'border-zinc-700 bg-zinc-800 hover:border-zinc-600'}`}>
                      <t.icon className={`w-5 h-5 ${settings.theme === t.k ? 'text-emerald-400' : 'text-zinc-500'}`} />
                      <span className={`text-xs font-medium ${settings.theme === t.k ? 'text-white' : 'text-zinc-500'}`}>{t.label}</span>
                    </button>
                  ))}
                </div>
              </div>
              <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5">
                <div className="text-sm font-semibold text-white mb-4">Accent Color</div>
                <div className="flex gap-3">
                  {['#10b981', '#6366f1', '#f59e0b', '#ec4899', '#3b82f6', '#ef4444'].map(color => (
                    <button key={color} onClick={() => set('accentColor', color)}
                      className={`w-8 h-8 rounded-full ring-2 transition-all ${settings.accentColor === color ? 'ring-white' : 'ring-transparent hover:ring-white/30'}`}
                      style={{ backgroundColor: color }} />
                  ))}
                </div>
              </div>
              <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5">
                <div className="text-sm font-semibold text-white mb-4">Interface Density</div>
                <div className="grid grid-cols-3 gap-3">
                  {['Compact', 'Default', 'Comfortable'].map(d => (
                    <button key={d} onClick={() => set('density', d.toLowerCase())}
                      className={`py-2 rounded-xl text-xs border transition-all ${settings.density === d.toLowerCase() ? 'border-emerald-500/40 bg-emerald-500/10 text-white' : 'border-zinc-700 text-zinc-500 hover:border-zinc-600'}`}>{d}</button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'models' && (
            <div className="max-w-lg space-y-5">
              <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5">
                <div className="text-sm font-semibold text-white mb-4">Primary LLM</div>
                {[{ value: 'gpt-4o', label: 'GPT-4o', desc: 'Latest OpenAI model, best quality', badge: 'Recommended' },
                  { value: 'gpt-4-turbo', label: 'GPT-4 Turbo', desc: 'Fast and cost-effective' },
                  { value: 'claude-3-5-sonnet', label: 'Claude 3.5 Sonnet', desc: 'Excellent for long documents' },
                  { value: 'llama-3-70b', label: 'Llama 3.1 70B', desc: 'Open-source, self-hosted', badge: 'Free' }].map(m => (
                  <label key={m.value} className={`flex items-center gap-3 p-3 rounded-xl border mb-2 cursor-pointer transition-all ${settings.model === m.value ? 'border-emerald-500/40 bg-emerald-500/5' : 'border-zinc-800 hover:border-zinc-700'}`}>
                    <input type="radio" name="model" value={m.value} checked={settings.model === m.value} onChange={e => set('model', e.target.value)} className="accent-emerald-500" />
                    <div className="flex-1">
                      <div className="text-sm font-medium text-white flex items-center gap-2">{m.label} {m.badge && <span className="px-1.5 py-0.5 bg-zinc-700 text-zinc-400 text-[9px] rounded-full">{m.badge}</span>}</div>
                      <div className="text-xs text-zinc-500">{m.desc}</div>
                    </div>
                  </label>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'rag' && (
            <div className="max-w-lg space-y-5">
              <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5">
                <div className="text-sm font-semibold text-white mb-4">Retrieval Settings</div>
                {[
                  { label: 'Chunk Size (tokens)', key: 'ragChunkSize', min: 128, max: 2048, step: 128 },
                  { label: 'Top-K Retrieval', key: 'ragTopK', min: 1, max: 50, step: 1 },
                  { label: 'XAI Threshold', key: 'xaiThreshold', min: 0.1, max: 1.0, step: 0.1 },
                ].map(s => (
                  <div key={s.key} className="mb-4">
                    <div className="flex justify-between text-xs text-zinc-400 mb-1.5"><span>{s.label}</span><span className="text-emerald-400">{Number(settings[s.key] ?? 0).toFixed(s.step < 1 ? 1 : 0)}</span></div>
                    <input type="range" min={s.min} max={s.max} step={s.step} value={Number(settings[s.key] ?? 0)}
                      onChange={e => set(s.key, Number(e.target.value))} className="w-full accent-emerald-500 h-1.5" />
                  </div>
                ))}
                <div>
                  <label className="text-xs text-zinc-400 block mb-1.5">Embedding Model</label>
                  <select className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-3 py-2 text-sm text-zinc-300">
                    <option>text-embedding-3-large</option><option>text-embedding-ada-002</option><option>BAAI/bge-large-en</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'notifications' && (
            <div className="max-w-lg space-y-4">
              <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5">
                <div className="text-sm font-semibold text-white mb-4">Notification Preferences</div>
                {[
                  { key: 'notifGraph', label: 'Knowledge Graph Complete', desc: 'When a graph finishes generating' },
                  { key: 'notifRag', label: 'RAG Query Results', desc: 'Pipeline completion alerts' },
                  { key: 'notifAgent', label: 'Agent Task Updates', desc: 'Individual agent status changes' },
                  { key: 'notifJournal', label: 'Journal AI Analysis', desc: 'Mood detection results' },
                  { key: 'notifSystem', label: 'System Updates', desc: 'Platform updates and releases' },
                  { key: 'notifDigest', label: 'Weekly Digest', desc: 'Weekly research summary email' },
                ].map(p => (
                  <div key={p.key} className="flex items-center justify-between py-3 border-b border-zinc-800 last:border-0">
                    <div><div className="text-sm text-white">{p.label}</div><div className="text-xs text-zinc-500">{p.desc}</div></div>
                    <Toggle k={p.key} />
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'security' && (
            <div className="max-w-lg space-y-4">
              <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5">
                <div className="text-sm font-semibold text-white mb-4">Security Settings</div>
                {[
                  { key: 'twoFactor', label: 'Two-Factor Authentication', desc: 'Add an extra layer of security' },
                  { key: 'sessionTimeout', label: 'Session Timeout', desc: 'Auto-logout after 30 minutes of inactivity' },
                  { key: 'loginNotifications', label: 'Login Notifications', desc: 'Email alert on new device login' },
                ].map(s => (
                  <div key={s.key} className="flex items-center justify-between py-3 border-b border-zinc-800 last:border-0">
                    <div><div className="text-sm text-white">{s.label}</div><div className="text-xs text-zinc-500">{s.desc}</div></div>
                    <Toggle k={s.key} />
                  </div>
                ))}
              </div>
              <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5">
                <div className="text-sm font-semibold text-white mb-3">Change Password</div>
                {['Current Password', 'New Password', 'Confirm New Password'].map(f => (
                  <div key={f} className="mb-3">
                    <label className="text-xs text-zinc-500 block mb-1">{f}</label>
                    <input type="password" className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-2 text-sm text-white focus:outline-none focus:border-emerald-500/50" />
                  </div>
                ))}
                <button className="px-6 py-2.5 bg-zinc-700 hover:bg-zinc-600 text-white rounded-xl text-sm font-medium transition-colors">Update Password</button>
              </div>
            </div>
          )}

          <div className="mt-6">
            <button onClick={save} disabled={saving}
              className="flex items-center gap-2 px-6 py-2.5 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white rounded-xl text-sm font-medium transition-colors">
              {saving ? <RefreshCw className="w-4 h-4 animate-spin" /> : saved ? <CheckCircle className="w-4 h-4" /> : null}
              {saved ? 'Saved!' : saving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
