import { useState } from 'react';
import { Settings as SettingsIcon, Palette, Brain, Database, Bell, Shield, Monitor, Sun, Moon } from 'lucide-react';

export default function Settings() {
  const [activeTab, setActiveTab] = useState<'appearance' | 'models' | 'rag' | 'notifications' | 'security'>('appearance');
  const [theme, setTheme] = useState<'dark' | 'light' | 'system'>('dark');
  const [ragChunkSize, setRagChunkSize] = useState(512);
  const [ragTopK, setRagTopK] = useState(12);
  const [xaiThreshold, setXaiThreshold] = useState(0.7);
  const [model, setModel] = useState('gpt-4o');
  const [saved, setSaved] = useState(false);

  const save = () => { setSaved(true); setTimeout(() => setSaved(false), 2000); };

  const tabs = [
    { key: 'appearance', label: 'Appearance', icon: Palette },
    { key: 'models', label: 'Models & AI', icon: Brain },
    { key: 'rag', label: 'RAG Pipeline', icon: Database },
    { key: 'notifications', label: 'Notifications', icon: Bell },
    { key: 'security', label: 'Security', icon: Shield },
  ] as const;

  return (
    <div className="h-screen flex flex-col bg-zinc-950">
      <div className="border-b border-zinc-800 bg-zinc-900/50 px-6 py-4">
        <h1 className="text-xl font-bold text-white flex items-center gap-2">
          <SettingsIcon className="w-5 h-5 text-zinc-400" />Settings
        </h1>
        <p className="text-xs text-zinc-500 mt-0.5">Configure platform preferences and defaults</p>
      </div>

      <div className="flex flex-1 overflow-hidden">
        <div className="w-44 border-r border-zinc-800 bg-zinc-900/30 p-3 space-y-1">
          {tabs.map(tab => (
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
                    <button key={t.k} onClick={() => setTheme(t.k as any)}
                      className={`flex flex-col items-center gap-2 p-4 rounded-xl border transition-all ${theme === t.k ? 'border-emerald-500/40 bg-emerald-500/10' : 'border-zinc-700 bg-zinc-800 hover:border-zinc-600'}`}>
                      <t.icon className={`w-5 h-5 ${theme === t.k ? 'text-emerald-400' : 'text-zinc-500'}`} />
                      <span className={`text-xs font-medium ${theme === t.k ? 'text-white' : 'text-zinc-500'}`}>{t.label}</span>
                    </button>
                  ))}
                </div>
              </div>
              <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5">
                <div className="text-sm font-semibold text-white mb-4">Accent Color</div>
                <div className="flex gap-3">
                  {['#10b981', '#6366f1', '#f59e0b', '#ec4899', '#3b82f6', '#ef4444'].map(color => (
                    <button key={color} className="w-8 h-8 rounded-full ring-2 ring-transparent hover:ring-white/30 transition-all" style={{ backgroundColor: color }} />
                  ))}
                </div>
              </div>
              <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5">
                <div className="text-sm font-semibold text-white mb-4">Interface Density</div>
                <div className="grid grid-cols-3 gap-3">
                  {['Compact', 'Default', 'Comfortable'].map(d => (
                    <button key={d} className={`py-2 rounded-xl text-xs border transition-all ${d === 'Default' ? 'border-emerald-500/40 bg-emerald-500/10 text-white' : 'border-zinc-700 text-zinc-500 hover:border-zinc-600'}`}>{d}</button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'models' && (
            <div className="max-w-lg space-y-5">
              <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5">
                <div className="text-sm font-semibold text-white mb-4">Primary LLM</div>
                {[{ value: 'gpt-4o', label: 'GPT-4o', desc: 'Latest OpenAI model, best quality', badge: 'Recommended' }, { value: 'gpt-4-turbo', label: 'GPT-4 Turbo', desc: 'Fast and cost-effective', badge: '' }, { value: 'claude-3-5-sonnet', label: 'Claude 3.5 Sonnet', desc: 'Excellent for long documents', badge: '' }, { value: 'llama-3-70b', label: 'Llama 3.1 70B', desc: 'Open-source, self-hosted', badge: 'Free' }].map(m => (
                  <label key={m.value} className={`flex items-center gap-3 p-3 rounded-xl border mb-2 cursor-pointer transition-all ${model === m.value ? 'border-emerald-500/40 bg-emerald-500/5' : 'border-zinc-800 hover:border-zinc-700'}`}>
                    <input type="radio" name="model" value={m.value} checked={model === m.value} onChange={e => setModel(e.target.value)} className="accent-emerald-500" />
                    <div className="flex-1">
                      <div className="text-sm font-medium text-white flex items-center gap-2">{m.label} {m.badge && <span className="px-1.5 py-0.5 bg-zinc-700 text-zinc-400 text-[9px] rounded-full">{m.badge}</span>}</div>
                      <div className="text-xs text-zinc-500">{m.desc}</div>
                    </div>
                  </label>
                ))}
              </div>
              <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5">
                <div className="text-sm font-semibold text-white mb-3">Custom API Keys</div>
                {[{ label: 'OpenAI API Key', placeholder: 'sk-...' }, { label: 'Anthropic API Key', placeholder: 'sk-ant-...' }, { label: 'Hugging Face Token', placeholder: 'hf_...' }].map(f => (
                  <div key={f.label} className="mb-3">
                    <label className="text-xs text-zinc-500 block mb-1">{f.label}</label>
                    <input type="password" placeholder={f.placeholder} className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-2 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:border-emerald-500/50" />
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'rag' && (
            <div className="max-w-lg space-y-5">
              <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5">
                <div className="text-sm font-semibold text-white mb-4">Retrieval Settings</div>
                {[{ label: 'Chunk Size (tokens)', key: 'chunk', value: ragChunkSize, min: 128, max: 2048, step: 128, set: setRagChunkSize }, { label: 'Top-K Retrieval', key: 'topk', value: ragTopK, min: 1, max: 50, step: 1, set: setRagTopK }].map(s => (
                  <div key={s.key} className="mb-4">
                    <div className="flex justify-between text-xs text-zinc-400 mb-1.5"><span>{s.label}</span><span className="text-emerald-400">{s.value}</span></div>
                    <input type="range" min={s.min} max={s.max} step={s.step} value={s.value} onChange={e => s.set(+e.target.value)} className="w-full accent-emerald-500 h-1.5" />
                  </div>
                ))}
                <div className="mb-3">
                  <label className="text-xs text-zinc-400 block mb-1.5">Embedding Model</label>
                  <select className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-3 py-2 text-sm text-zinc-300">
                    <option>text-embedding-3-large</option>
                    <option>text-embedding-ada-002</option>
                    <option>BAAI/bge-large-en</option>
                  </select>
                </div>
              </div>
              <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5">
                <div className="text-sm font-semibold text-white mb-4">XAI Threshold</div>
                <div className="mb-4">
                  <div className="flex justify-between text-xs text-zinc-400 mb-1.5"><span>Explanation Confidence Threshold</span><span className="text-emerald-400">{xaiThreshold.toFixed(1)}</span></div>
                  <input type="range" min={0.1} max={1.0} step={0.1} value={xaiThreshold} onChange={e => setXaiThreshold(+e.target.value)} className="w-full accent-amber-500 h-1.5" />
                </div>
              </div>
            </div>
          )}

          {activeTab === 'notifications' && (
            <div className="max-w-lg space-y-4">
              <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5">
                <div className="text-sm font-semibold text-white mb-4">Notification Preferences</div>
                {[
                  { label: 'Knowledge Graph Complete', desc: 'When a graph finishes generating', enabled: true },
                  { label: 'RAG Query Results', desc: 'Pipeline completion alerts', enabled: true },
                  { label: 'Agent Task Updates', desc: 'Individual agent status changes', enabled: false },
                  { label: 'Journal AI Analysis', desc: 'Mood detection results', enabled: true },
                  { label: 'System Updates', desc: 'Platform updates and releases', enabled: true },
                  { label: 'Weekly Digest', desc: 'Weekly research summary email', enabled: false },
                ].map(pref => (
                  <div key={pref.label} className="flex items-center justify-between py-3 border-b border-zinc-800 last:border-0">
                    <div>
                      <div className="text-sm text-white">{pref.label}</div>
                      <div className="text-xs text-zinc-500">{pref.desc}</div>
                    </div>
                    <button className={`w-10 h-5 rounded-full relative transition-colors ${pref.enabled ? 'bg-emerald-500' : 'bg-zinc-700'}`}>
                      <div className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${pref.enabled ? 'left-5' : 'left-0.5'}`} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'security' && (
            <div className="max-w-lg space-y-4">
              <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5">
                <div className="text-sm font-semibold text-white mb-4">Security Settings</div>
                {[{ label: 'Two-Factor Authentication', desc: 'Add an extra layer of security', enabled: false }, { label: 'Session Timeout', desc: 'Auto-logout after 30 minutes of inactivity', enabled: true }, { label: 'Login Notifications', desc: 'Email alert on new device login', enabled: true }].map(s => (
                  <div key={s.label} className="flex items-center justify-between py-3 border-b border-zinc-800 last:border-0">
                    <div>
                      <div className="text-sm text-white">{s.label}</div>
                      <div className="text-xs text-zinc-500">{s.desc}</div>
                    </div>
                    <button className={`w-10 h-5 rounded-full relative transition-colors ${s.enabled ? 'bg-emerald-500' : 'bg-zinc-700'}`}>
                      <div className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${s.enabled ? 'left-5' : 'left-0.5'}`} />
                    </button>
                  </div>
                ))}
              </div>
              <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5">
                <div className="text-sm font-semibold text-white mb-3">Change Password</div>
                {['Current Password', 'New Password', 'Confirm New Password'].map(f => (
                  <div key={f} className="mb-3">
                    <label className="text-xs text-zinc-500 block mb-1">{f}</label>
                    <input type="password" className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-2 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:border-emerald-500/50" />
                  </div>
                ))}
                <button className="px-6 py-2.5 bg-zinc-700 hover:bg-zinc-600 text-white rounded-xl text-sm font-medium transition-colors">Update Password</button>
              </div>
            </div>
          )}

          <div className="mt-6">
            <button onClick={save} className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-sm font-medium transition-colors">
              {saved ? '✓ Saved!' : 'Save Changes'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
