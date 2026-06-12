import { useState, useEffect } from 'react';
import {
  Settings as SettingsIcon, Palette, Brain, Database, Bell, Shield,
  Monitor, Sun, Moon, RefreshCw, CheckCircle, User, Key, Zap, HardDrive,
  Copy, Eye, EyeOff, Trash2, Download, AlertTriangle, BarChart3,
  Globe, Clock, Sliders, Lock, Unlock, ChevronRight,
} from 'lucide-react';
import { api } from '@/lib/api';

const TABS = [
  { key: 'appearance', label: 'Appearance', icon: Palette },
  { key: 'profile', label: 'Profile', icon: User },
  { key: 'models', label: 'Models & AI', icon: Brain },
  { key: 'rag', label: 'RAG Pipeline', icon: Database },
  { key: 'performance', label: 'Performance', icon: Zap },
  { key: 'notifications', label: 'Notifications', icon: Bell },
  { key: 'security', label: 'Security', icon: Shield },
  { key: 'data', label: 'Data & Storage', icon: HardDrive },
] as const;

type Tab = typeof TABS[number]['key'];

interface StorageStats { documents: number; graphs: number; chunks: number; journalEntries: number; }

const ACCENT_COLORS = [
  { hex: '#10b981', name: 'Emerald' },
  { hex: '#6366f1', name: 'Indigo' },
  { hex: '#f59e0b', name: 'Amber' },
  { hex: '#ec4899', name: 'Pink' },
  { hex: '#3b82f6', name: 'Blue' },
  { hex: '#ef4444', name: 'Red' },
  { hex: '#14b8a6', name: 'Teal' },
  { hex: '#8b5cf6', name: 'Violet' },
];

export default function Settings() {
  const [activeTab, setActiveTab] = useState<Tab>('appearance');
  const [settings, setSettings] = useState<Record<string, any>>({
    theme: 'dark', accentColor: '#10b981', density: 'default',
    model: 'gpt-4o', embeddingModel: 'text-embedding-3-large',
    ragChunkSize: 512, ragTopK: 12, xaiThreshold: 0.7,
    notifGraph: true, notifRag: true, notifAgent: false, notifJournal: true, notifSystem: true, notifDigest: false,
    twoFactor: false, sessionTimeout: true, loginNotifications: true,
    displayName: 'K. Kuppireddy', email: 'research@aether.ai', bio: 'AI Research Platform User',
    enableCaching: true, maxConcurrent: 4, responseQuality: 'balanced',
    autoSave: true, telemetry: false, betaFeatures: false,
    language: 'en', timezone: 'UTC', dateFormat: 'MM/DD/YYYY',
  });
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showApiKey, setShowApiKey] = useState(false);
  const [apiKey] = useState('ak_' + Array.from({ length: 32 }, () => Math.random().toString(36)[2]).join(''));
  const [copiedKey, setCopiedKey] = useState(false);
  const [stats, setStats] = useState<StorageStats>({ documents: 0, graphs: 0, chunks: 0, journalEntries: 0 });
  const [clearing, setClearing] = useState(false);
  const [pwFields, setPwFields] = useState({ current: '', next: '', confirm: '' });
  const [pwError, setPwError] = useState('');
  const [pwSaved, setPwSaved] = useState(false);

  useEffect(() => {
    Promise.all([
      api.get<Record<string, any>>('/settings').catch(() => ({})),
      api.get<StorageStats>('/settings/stats').catch(() => ({ documents: 0, graphs: 0, chunks: 0, journalEntries: 0 })),
    ]).then(([s, st]) => {
      setSettings(prev => ({ ...prev, ...s }));
      setStats(st);
    }).finally(() => setLoading(false));
  }, []);

  const set = (key: string, value: any) => setSettings(prev => ({ ...prev, [key]: value }));

  const save = async () => {
    setSaving(true);
    try {
      const updated = await api.put<Record<string, any>>('/settings', settings);
      setSettings(prev => ({ ...prev, ...updated }));
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
      // Apply accent color to CSS variable
      document.documentElement.style.setProperty('--accent', settings.accentColor);
    } catch { } finally { setSaving(false); }
  };

  const copyKey = () => {
    navigator.clipboard.writeText(apiKey);
    setCopiedKey(true);
    setTimeout(() => setCopiedKey(false), 2000);
  };

  const handlePasswordChange = () => {
    if (!pwFields.current) { setPwError('Enter current password'); return; }
    if (pwFields.next.length < 8) { setPwError('Password must be at least 8 characters'); return; }
    if (pwFields.next !== pwFields.confirm) { setPwError('Passwords do not match'); return; }
    setPwError('');
    setPwSaved(true);
    setPwFields({ current: '', next: '', confirm: '' });
    setTimeout(() => setPwSaved(false), 3000);
  };

  const clearCache = async () => {
    setClearing(true);
    await new Promise(r => setTimeout(r, 1200));
    setClearing(false);
  };

  const exportData = () => {
    const blob = new Blob([JSON.stringify({ settings, exportedAt: new Date().toISOString() }, null, 2)], { type: 'application/json' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'aether_settings_export.json';
    a.click();
  };

  const Toggle = ({ k, disabled }: { k: string; disabled?: boolean }) => (
    <button onClick={() => !disabled && set(k, !settings[k])} disabled={disabled}
      className={`w-10 h-5 rounded-full relative transition-colors flex-shrink-0 ${settings[k] ? 'bg-emerald-500' : 'bg-zinc-700'} ${disabled ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer'}`}>
      <div className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${settings[k] ? 'translate-x-5' : 'translate-x-0.5'}`} />
    </button>
  );

  const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
    <div className="rounded-2xl p-5 border border-white/[0.07] bg-white/[0.02] backdrop-blur-sm">
      <div className="text-sm font-semibold text-white mb-4">{title}</div>
      {children}
    </div>
  );

  if (loading) return (
    <div className="flex items-center justify-center h-screen">
      <div className="flex items-center gap-3 text-zinc-500">
        <RefreshCw className="w-4 h-4 animate-spin" />
        <span className="text-sm">Loading settings…</span>
      </div>
    </div>
  );

  return (
    <div className="h-screen flex flex-col bg-transparent">
      <div className="border-b border-white/[0.07] bg-zinc-900/50 px-6 py-4 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-white flex items-center gap-2">
            <SettingsIcon className="w-5 h-5 text-zinc-400" />Settings
          </h1>
          <p className="text-xs text-zinc-500 mt-0.5">Configure platform preferences and system defaults</p>
        </div>
        <button onClick={save} disabled={saving}
          className="flex items-center gap-2 px-5 py-2 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white rounded-xl text-sm font-medium transition-colors">
          {saving ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : saved ? <CheckCircle className="w-3.5 h-3.5" /> : null}
          {saved ? 'Saved!' : saving ? 'Saving…' : 'Save Changes'}
        </button>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar nav */}
        <div className="w-44 border-r border-white/[0.07] bg-zinc-900/30 p-3 space-y-0.5 flex-shrink-0">
          {TABS.map(tab => (
            <button key={tab.key} onClick={() => setActiveTab(tab.key)}
              className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-medium transition-all text-left ${activeTab === tab.key ? 'bg-zinc-800 text-white' : 'text-zinc-500 hover:text-white hover:bg-zinc-800/50'}`}>
              <tab.icon className="w-3.5 h-3.5 flex-shrink-0" />{tab.label}
              {activeTab === tab.key && <ChevronRight className="w-3 h-3 ml-auto opacity-50" />}
            </button>
          ))}
        </div>

        <div className="flex-1 overflow-auto p-6">
          <div className="max-w-xl space-y-5">

            {/* APPEARANCE */}
            {activeTab === 'appearance' && (<>
              <Section title="Theme">
                <div className="grid grid-cols-3 gap-3">
                  {[{ k: 'dark', label: 'Dark', icon: Moon }, { k: 'light', label: 'Light', icon: Sun }, { k: 'system', label: 'System', icon: Monitor }].map(t => (
                    <button key={t.k} onClick={() => set('theme', t.k)}
                      className={`flex flex-col items-center gap-2 p-4 rounded-xl border transition-all ${settings.theme === t.k ? 'border-emerald-500/40 bg-emerald-500/10' : 'border-zinc-700 bg-white/[0.03] hover:border-zinc-600'}`}>
                      <t.icon className={`w-5 h-5 ${settings.theme === t.k ? 'text-emerald-400' : 'text-zinc-500'}`} />
                      <span className={`text-xs font-medium ${settings.theme === t.k ? 'text-white' : 'text-zinc-500'}`}>{t.label}</span>
                    </button>
                  ))}
                </div>
              </Section>

              <Section title="Accent Color">
                <div className="flex flex-wrap gap-3 mb-3">
                  {ACCENT_COLORS.map(c => (
                    <button key={c.hex} onClick={() => set('accentColor', c.hex)} title={c.name}
                      className={`w-9 h-9 rounded-full ring-2 transition-all ${settings.accentColor === c.hex ? 'ring-white scale-110' : 'ring-transparent hover:ring-white/30 hover:scale-105'}`}
                      style={{ backgroundColor: c.hex }} />
                  ))}
                </div>
                <div className="flex items-center gap-3 p-3 rounded-xl bg-white/[0.03] border border-white/[0.07]">
                  <div className="w-8 h-8 rounded-lg" style={{ backgroundColor: settings.accentColor }} />
                  <div>
                    <div className="text-xs text-white font-medium">
                      {ACCENT_COLORS.find(c => c.hex === settings.accentColor)?.name ?? 'Custom'}
                    </div>
                    <div className="text-[10px] text-zinc-500">{settings.accentColor}</div>
                  </div>
                  <input type="color" value={settings.accentColor} onChange={e => set('accentColor', e.target.value)}
                    className="ml-auto w-8 h-8 rounded cursor-pointer border-0 bg-transparent" title="Custom color" />
                </div>
              </Section>

              <Section title="Interface Density">
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { k: 'compact', label: 'Compact', desc: 'Tight spacing' },
                    { k: 'default', label: 'Default', desc: 'Balanced' },
                    { k: 'comfortable', label: 'Comfortable', desc: 'Spacious' },
                  ].map(d => (
                    <button key={d.k} onClick={() => set('density', d.k)}
                      className={`flex flex-col items-center gap-1 py-3 rounded-xl text-xs border transition-all ${settings.density === d.k ? 'border-emerald-500/40 bg-emerald-500/10 text-white' : 'border-zinc-700 text-zinc-500 hover:border-zinc-600'}`}>
                      <span className="font-medium">{d.label}</span>
                      <span className="text-[9px] opacity-60">{d.desc}</span>
                    </button>
                  ))}
                </div>
              </Section>

              <Section title="Localization">
                {[
                  { label: 'Language', key: 'language', options: [{ v: 'en', l: 'English' }, { v: 'es', l: 'Español' }, { v: 'fr', l: 'Français' }, { v: 'de', l: 'Deutsch' }, { v: 'zh', l: '中文' }] },
                  { label: 'Date Format', key: 'dateFormat', options: [{ v: 'MM/DD/YYYY', l: 'MM/DD/YYYY' }, { v: 'DD/MM/YYYY', l: 'DD/MM/YYYY' }, { v: 'YYYY-MM-DD', l: 'YYYY-MM-DD' }] },
                  { label: 'Timezone', key: 'timezone', options: [{ v: 'UTC', l: 'UTC' }, { v: 'America/New_York', l: 'Eastern' }, { v: 'America/Los_Angeles', l: 'Pacific' }, { v: 'Europe/London', l: 'London' }, { v: 'Asia/Kolkata', l: 'IST' }] },
                ].map(s => (
                  <div key={s.key} className="mb-3 last:mb-0">
                    <label className="text-xs text-zinc-400 block mb-1.5 flex items-center gap-1.5">
                      {s.key === 'language' ? <Globe className="w-3 h-3" /> : s.key === 'timezone' ? <Clock className="w-3 h-3" /> : null}
                      {s.label}
                    </label>
                    <select value={settings[s.key]} onChange={e => set(s.key, e.target.value)}
                      className="w-full bg-white/[0.04] border border-zinc-700 rounded-xl px-3 py-2 text-sm text-zinc-300 focus:outline-none focus:border-emerald-500/50">
                      {s.options.map(o => <option key={o.v} value={o.v}>{o.l}</option>)}
                    </select>
                  </div>
                ))}
              </Section>
            </>)}

            {/* PROFILE */}
            {activeTab === 'profile' && (<>
              <Section title="Personal Information">
                <div className="flex items-center gap-4 mb-5 pb-5 border-b border-white/[0.07]">
                  <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-2xl font-bold text-white flex-shrink-0"
                    style={{ background: `linear-gradient(135deg, ${settings.accentColor}cc, ${settings.accentColor}44)` }}>
                    {(settings.displayName ?? 'K').charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-white">{settings.displayName || 'Researcher'}</div>
                    <div className="text-xs text-zinc-500">{settings.email}</div>
                    <div className="text-[10px] text-emerald-400 mt-1 flex items-center gap-1">
                      <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" />Online
                    </div>
                  </div>
                </div>
                {[
                  { label: 'Display Name', key: 'displayName', type: 'text', placeholder: 'Your name' },
                  { label: 'Email Address', key: 'email', type: 'email', placeholder: 'your@email.com' },
                ].map(f => (
                  <div key={f.key} className="mb-3">
                    <label className="text-xs text-zinc-400 block mb-1.5">{f.label}</label>
                    <input type={f.type} value={settings[f.key] ?? ''} onChange={e => set(f.key, e.target.value)}
                      placeholder={f.placeholder}
                      className="w-full bg-white/[0.04] border border-zinc-700 rounded-xl px-3 py-2 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:border-emerald-500/50" />
                  </div>
                ))}
                <div>
                  <label className="text-xs text-zinc-400 block mb-1.5">Bio</label>
                  <textarea value={settings.bio ?? ''} onChange={e => set('bio', e.target.value)}
                    rows={3} placeholder="Short bio about your research…"
                    className="w-full bg-white/[0.04] border border-zinc-700 rounded-xl px-3 py-2 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:border-emerald-500/50 resize-none" />
                </div>
              </Section>

              <Section title="API Access">
                <div className="text-xs text-zinc-500 mb-3">Use this key to access the Aether API programmatically.</div>
                <div className="flex items-center gap-2 p-3 rounded-xl bg-white/[0.03] border border-white/[0.07] mb-3">
                  <code className="flex-1 text-[11px] text-emerald-400 font-mono truncate">
                    {showApiKey ? apiKey : 'ak_' + '•'.repeat(32)}
                  </code>
                  <button onClick={() => setShowApiKey(s => !s)} className="text-zinc-600 hover:text-zinc-400 p-1">
                    {showApiKey ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  </button>
                  <button onClick={copyKey} className="text-zinc-600 hover:text-emerald-400 p-1">
                    {copiedKey ? <CheckCircle className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-[10px] text-zinc-500">
                    <Key className="w-3 h-3" />Created June 2026 · Read/Write access
                  </div>
                  <button className="text-[10px] text-red-400 hover:text-red-300 transition-colors">Revoke</button>
                </div>
              </Section>
            </>)}

            {/* MODELS */}
            {activeTab === 'models' && (<>
              <Section title="Primary LLM">
                {[
                  { value: 'gpt-4o', label: 'GPT-4o', desc: 'Latest OpenAI flagship model', badge: 'Recommended', color: '#10a37f' },
                  { value: 'gpt-4-turbo', label: 'GPT-4 Turbo', desc: 'Fast and cost-effective', color: '#10a37f' },
                  { value: 'claude-3-5-sonnet', label: 'Claude 3.5 Sonnet', desc: 'Best for long documents', color: '#d97706' },
                  { value: 'llama-3-70b', label: 'Llama 3.1 70B', desc: 'Open-source, self-hosted', badge: 'Free', color: '#6366f1' },
                  { value: 'gemini-1.5-pro', label: 'Gemini 1.5 Pro', desc: '1M context window', badge: 'New', color: '#4285f4' },
                ].map(m => (
                  <label key={m.value}
                    className={`flex items-center gap-3 p-3 rounded-xl border mb-2 cursor-pointer transition-all ${settings.model === m.value ? 'border-emerald-500/40 bg-emerald-500/5' : 'border-white/[0.07] hover:border-zinc-700'}`}>
                    <input type="radio" name="model" value={m.value} checked={settings.model === m.value}
                      onChange={e => set('model', e.target.value)} className="accent-emerald-500" />
                    <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: m.color }} />
                    <div className="flex-1">
                      <div className="text-sm font-medium text-white flex items-center gap-2">
                        {m.label}
                        {m.badge && <span className="px-1.5 py-0.5 bg-zinc-700/80 text-zinc-400 text-[9px] rounded-full">{m.badge}</span>}
                      </div>
                      <div className="text-xs text-zinc-500">{m.desc}</div>
                    </div>
                    {settings.model === m.value && <CheckCircle className="w-4 h-4 text-emerald-400 flex-shrink-0" />}
                  </label>
                ))}
              </Section>

              <Section title="Embedding Model">
                <div className="space-y-2">
                  {[
                    { value: 'text-embedding-3-large', label: 'text-embedding-3-large', desc: '3072 dims · Best quality' },
                    { value: 'text-embedding-ada-002', label: 'text-embedding-ada-002', desc: '1536 dims · Legacy' },
                    { value: 'BAAI/bge-large-en', label: 'BGE Large EN', desc: '1024 dims · Open-source' },
                  ].map(m => (
                    <label key={m.value}
                      className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all ${settings.embeddingModel === m.value ? 'border-emerald-500/40 bg-emerald-500/5' : 'border-white/[0.07] hover:border-zinc-700'}`}>
                      <input type="radio" name="embedding" value={m.value} checked={settings.embeddingModel === m.value}
                        onChange={e => set('embeddingModel', e.target.value)} className="accent-emerald-500" />
                      <div className="flex-1">
                        <div className="text-xs font-medium text-white font-mono">{m.label}</div>
                        <div className="text-[10px] text-zinc-500">{m.desc}</div>
                      </div>
                    </label>
                  ))}
                </div>
              </Section>

              <Section title="Generation Parameters">
                {[
                  { label: 'Temperature', key: 'temperature', min: 0, max: 2, step: 0.1, def: 0.7 },
                  { label: 'Max Tokens', key: 'maxTokens', min: 256, max: 8192, step: 256, def: 2048 },
                  { label: 'Top-P', key: 'topP', min: 0.1, max: 1, step: 0.05, def: 0.9 },
                ].map(s => (
                  <div key={s.key} className="mb-4 last:mb-0">
                    <div className="flex justify-between text-xs text-zinc-400 mb-1.5">
                      <span>{s.label}</span>
                      <span className="text-emerald-400 font-mono">{Number(settings[s.key] ?? s.def).toFixed(s.step < 1 ? 2 : 0)}</span>
                    </div>
                    <input type="range" min={s.min} max={s.max} step={s.step}
                      value={Number(settings[s.key] ?? s.def)}
                      onChange={e => set(s.key, Number(e.target.value))}
                      className="w-full accent-emerald-500 h-1.5" />
                    <div className="flex justify-between text-[9px] text-zinc-700 mt-1">
                      <span>{s.min}</span><span>{s.max}</span>
                    </div>
                  </div>
                ))}
              </Section>
            </>)}

            {/* RAG PIPELINE */}
            {activeTab === 'rag' && (<>
              <Section title="Chunking & Retrieval">
                {[
                  { label: 'Chunk Size (tokens)', key: 'ragChunkSize', min: 128, max: 2048, step: 128 },
                  { label: 'Top-K Retrieval', key: 'ragTopK', min: 1, max: 50, step: 1 },
                  { label: 'Min Relevance Score', key: 'xaiThreshold', min: 0.1, max: 1.0, step: 0.05 },
                  { label: 'Context Window Overlap', key: 'chunkOverlap', min: 0, max: 512, step: 32 },
                ].map(s => (
                  <div key={s.key} className="mb-4 last:mb-0">
                    <div className="flex justify-between text-xs text-zinc-400 mb-1.5">
                      <span>{s.label}</span>
                      <span className="text-emerald-400 font-mono">{Number(settings[s.key] ?? 0).toFixed(s.step < 1 ? 2 : 0)}</span>
                    </div>
                    <input type="range" min={s.min} max={s.max} step={s.step}
                      value={Number(settings[s.key] ?? 0)}
                      onChange={e => set(s.key, Number(e.target.value))}
                      className="w-full accent-emerald-500 h-1.5" />
                  </div>
                ))}
              </Section>

              <Section title="Pipeline Options">
                {[
                  { key: 'hybridSearch', label: 'Hybrid Search', desc: 'Combine dense + sparse retrieval (BM25 + vectors)' },
                  { key: 'reranking', label: 'Re-ranking', desc: 'Apply cross-encoder re-ranking after retrieval' },
                  { key: 'queryExpansion', label: 'Query Expansion', desc: 'Automatically expand queries for better recall' },
                  { key: 'parentDocRetrieval', label: 'Parent Document Retrieval', desc: 'Fetch parent chunks for additional context' },
                  { key: 'autoGraph', label: 'Auto-generate Graph', desc: 'Build knowledge graph on every document upload' },
                ].map(opt => (
                  <div key={opt.key} className="flex items-center justify-between py-3 border-b border-white/[0.05] last:border-0">
                    <div>
                      <div className="text-sm text-white">{opt.label}</div>
                      <div className="text-xs text-zinc-500">{opt.desc}</div>
                    </div>
                    <Toggle k={opt.key} />
                  </div>
                ))}
              </Section>

              <Section title="Vector Store">
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { label: 'Backend', value: 'PostgreSQL + pgvector' },
                    { label: 'Dimensions', value: '1536' },
                    { label: 'Index Type', value: 'HNSW' },
                    { label: 'Distance', value: 'Cosine' },
                  ].map(s => (
                    <div key={s.label} className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.05]">
                      <div className="text-[9px] text-zinc-500 uppercase tracking-wider">{s.label}</div>
                      <div className="text-xs text-white font-medium mt-1">{s.value}</div>
                    </div>
                  ))}
                </div>
              </Section>
            </>)}

            {/* PERFORMANCE */}
            {activeTab === 'performance' && (<>
              <Section title="Processing">
                {[
                  { key: 'enableCaching', label: 'Enable Response Caching', desc: 'Cache LLM responses for identical queries' },
                  { key: 'autoSave', label: 'Auto-Save', desc: 'Automatically save work every 2 minutes' },
                  { key: 'betaFeatures', label: 'Beta Features', desc: 'Access experimental features (may be unstable)' },
                  { key: 'telemetry', label: 'Analytics & Telemetry', desc: 'Share anonymized usage data to improve Aether' },
                ].map(opt => (
                  <div key={opt.key} className="flex items-center justify-between py-3 border-b border-white/[0.05] last:border-0">
                    <div>
                      <div className="text-sm text-white">{opt.label}</div>
                      <div className="text-xs text-zinc-500">{opt.desc}</div>
                    </div>
                    <Toggle k={opt.key} />
                  </div>
                ))}
              </Section>

              <Section title="Concurrency & Quality">
                <div className="mb-4">
                  <div className="flex justify-between text-xs text-zinc-400 mb-1.5">
                    <span className="flex items-center gap-1.5"><Sliders className="w-3 h-3" />Max Concurrent Requests</span>
                    <span className="text-emerald-400 font-mono">{settings.maxConcurrent}</span>
                  </div>
                  <input type="range" min={1} max={16} step={1} value={settings.maxConcurrent}
                    onChange={e => set('maxConcurrent', Number(e.target.value))}
                    className="w-full accent-emerald-500 h-1.5" />
                  <div className="flex justify-between text-[9px] text-zinc-700 mt-1"><span>1</span><span>16</span></div>
                </div>

                <div>
                  <div className="text-xs text-zinc-400 mb-2 flex items-center gap-1.5">
                    <BarChart3 className="w-3 h-3" />Response Quality
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { k: 'fast', label: 'Fast', desc: 'Lower latency' },
                      { k: 'balanced', label: 'Balanced', desc: 'Default' },
                      { k: 'thorough', label: 'Thorough', desc: 'Best quality' },
                    ].map(q => (
                      <button key={q.k} onClick={() => set('responseQuality', q.k)}
                        className={`flex flex-col items-center gap-0.5 py-2.5 rounded-xl text-[10px] border transition-all ${settings.responseQuality === q.k ? 'border-emerald-500/40 bg-emerald-500/10 text-white' : 'border-zinc-700 text-zinc-500 hover:border-zinc-600'}`}>
                        <span className="font-medium">{q.label}</span>
                        <span className="opacity-60 text-[9px]">{q.desc}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </Section>
            </>)}

            {/* NOTIFICATIONS */}
            {activeTab === 'notifications' && (
              <Section title="Notification Preferences">
                {[
                  { key: 'notifGraph', label: 'Knowledge Graph Complete', desc: 'When a graph finishes generating', icon: '🔗' },
                  { key: 'notifRag', label: 'RAG Query Results', desc: 'Pipeline completion alerts', icon: '🔍' },
                  { key: 'notifAgent', label: 'Agent Task Updates', desc: 'Individual agent status changes', icon: '🤖' },
                  { key: 'notifJournal', label: 'Journal AI Analysis', desc: 'Mood detection results ready', icon: '📔' },
                  { key: 'notifSystem', label: 'System Updates', desc: 'Platform updates and releases', icon: '⚙️' },
                  { key: 'notifDigest', label: 'Weekly Digest', desc: 'Weekly research summary email', icon: '📧' },
                ].map(p => (
                  <div key={p.key} className="flex items-center justify-between py-3.5 border-b border-white/[0.05] last:border-0">
                    <div className="flex items-start gap-3">
                      <span className="text-base mt-0.5">{p.icon}</span>
                      <div>
                        <div className="text-sm text-white">{p.label}</div>
                        <div className="text-xs text-zinc-500">{p.desc}</div>
                      </div>
                    </div>
                    <Toggle k={p.key} />
                  </div>
                ))}
              </Section>
            )}

            {/* SECURITY */}
            {activeTab === 'security' && (<>
              <Section title="Account Security">
                {[
                  { key: 'twoFactor', label: 'Two-Factor Authentication', desc: 'Require TOTP code on login', icon: Lock },
                  { key: 'sessionTimeout', label: 'Session Timeout', desc: 'Auto-logout after 30 min inactivity', icon: Clock },
                  { key: 'loginNotifications', label: 'Login Notifications', desc: 'Email alert on new device login', icon: Bell },
                ].map(s => (
                  <div key={s.key} className="flex items-center justify-between py-3.5 border-b border-white/[0.05] last:border-0">
                    <div className="flex items-center gap-3">
                      <div className={`p-1.5 rounded-lg ${settings[s.key] ? 'bg-emerald-500/10 text-emerald-400' : 'bg-zinc-800 text-zinc-500'}`}>
                        <s.icon className="w-3.5 h-3.5" />
                      </div>
                      <div>
                        <div className="text-sm text-white">{s.label}</div>
                        <div className="text-xs text-zinc-500">{s.desc}</div>
                      </div>
                    </div>
                    <Toggle k={s.key} />
                  </div>
                ))}
              </Section>

              <Section title="Change Password">
                {pwSaved && (
                  <div className="flex items-center gap-2 text-emerald-400 text-xs mb-3 p-2.5 bg-emerald-500/10 rounded-xl border border-emerald-500/20">
                    <CheckCircle className="w-3.5 h-3.5" />Password updated successfully
                  </div>
                )}
                {pwError && (
                  <div className="flex items-center gap-2 text-red-400 text-xs mb-3 p-2.5 bg-red-500/10 rounded-xl border border-red-500/20">
                    <AlertTriangle className="w-3.5 h-3.5" />{pwError}
                  </div>
                )}
                {[
                  { key: 'current' as const, label: 'Current Password' },
                  { key: 'next' as const, label: 'New Password' },
                  { key: 'confirm' as const, label: 'Confirm New Password' },
                ].map(f => (
                  <div key={f.key} className="mb-3">
                    <label className="text-xs text-zinc-500 block mb-1">{f.label}</label>
                    <input type="password" value={pwFields[f.key]}
                      onChange={e => setPwFields(p => ({ ...p, [f.key]: e.target.value }))}
                      className="w-full bg-white/[0.04] border border-zinc-700 rounded-xl px-4 py-2 text-sm text-white focus:outline-none focus:border-emerald-500/50" />
                  </div>
                ))}
                <button onClick={handlePasswordChange}
                  className="px-5 py-2 bg-zinc-700 hover:bg-zinc-600 text-white rounded-xl text-sm font-medium transition-colors flex items-center gap-2">
                  <Lock className="w-3.5 h-3.5" />Update Password
                </button>
              </Section>

              <Section title="Active Sessions">
                {[
                  { device: 'Chrome on macOS', location: 'Hyderabad, IN', time: 'Now', current: true },
                  { device: 'Safari on iPhone', location: 'Hyderabad, IN', time: '2h ago', current: false },
                ].map((s, i) => (
                  <div key={i} className="flex items-center justify-between py-3 border-b border-white/[0.05] last:border-0">
                    <div className="flex items-center gap-3">
                      <div className={`p-1.5 rounded-lg ${s.current ? 'bg-emerald-500/10 text-emerald-400' : 'bg-zinc-800 text-zinc-500'}`}>
                        <Globe className="w-3.5 h-3.5" />
                      </div>
                      <div>
                        <div className="text-xs text-white">{s.device}</div>
                        <div className="text-[10px] text-zinc-500">{s.location} · {s.time}</div>
                      </div>
                    </div>
                    {s.current ? (
                      <span className="text-[10px] text-emerald-400 border border-emerald-500/30 px-2 py-0.5 rounded-full">Current</span>
                    ) : (
                      <button className="text-[10px] text-red-400 hover:text-red-300 flex items-center gap-1">
                        <Unlock className="w-3 h-3" />Revoke
                      </button>
                    )}
                  </div>
                ))}
              </Section>
            </>)}

            {/* DATA */}
            {activeTab === 'data' && (<>
              <Section title="Storage Usage">
                <div className="grid grid-cols-2 gap-3 mb-4">
                  {[
                    { label: 'Documents', value: stats.documents, icon: '📄', color: '#60a5fa' },
                    { label: 'Knowledge Graphs', value: stats.graphs, icon: '🔗', color: '#34d399' },
                    { label: 'Text Chunks', value: stats.chunks, icon: '🧩', color: '#a78bfa' },
                    { label: 'Journal Entries', value: stats.journalEntries, icon: '📔', color: '#f472b6' },
                  ].map(s => (
                    <div key={s.label} className="p-3.5 rounded-xl bg-white/[0.02] border border-white/[0.05]">
                      <div className="text-lg mb-0.5">{s.icon}</div>
                      <div className="text-xl font-bold" style={{ color: s.color }}>{s.value}</div>
                      <div className="text-[10px] text-zinc-500">{s.label}</div>
                    </div>
                  ))}
                </div>
                <div className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.05]">
                  <div className="flex items-center justify-between text-xs mb-1.5">
                    <span className="text-zinc-400">Total Storage Used</span>
                    <span className="text-white font-medium">
                      ~{((stats.documents * 2.1 + stats.chunks * 0.5) / 1024).toFixed(1)} MB / 10 GB
                    </span>
                  </div>
                  <div className="w-full bg-zinc-800 rounded-full h-1.5">
                    <div className="h-1.5 rounded-full bg-gradient-to-r from-emerald-500 to-blue-500"
                      style={{ width: `${Math.min(((stats.documents * 2.1 + stats.chunks * 0.5) / 10240) * 100, 100).toFixed(1)}%` }} />
                  </div>
                </div>
              </Section>

              <Section title="Export & Backup">
                <div className="space-y-2">
                  {[
                    { label: 'Export All Settings', desc: 'Download settings as JSON', fn: exportData, icon: Download, color: 'text-blue-400' },
                    { label: 'Export Knowledge Graphs', desc: 'Download all graphs as JSON', fn: exportData, icon: Download, color: 'text-emerald-400' },
                    { label: 'Export Journal Entries', desc: 'Download journal as markdown', fn: exportData, icon: Download, color: 'text-pink-400' },
                  ].map(a => (
                    <button key={a.label} onClick={a.fn}
                      className="w-full flex items-center gap-3 p-3.5 rounded-xl bg-white/[0.02] hover:bg-white/[0.05] border border-white/[0.05] transition-all group text-left">
                      <a.icon className={`w-4 h-4 flex-shrink-0 ${a.color}`} />
                      <div className="flex-1">
                        <div className="text-sm text-white group-hover:text-white">{a.label}</div>
                        <div className="text-[10px] text-zinc-500">{a.desc}</div>
                      </div>
                      <ChevronRight className="w-3.5 h-3.5 text-zinc-600 group-hover:text-zinc-400 flex-shrink-0" />
                    </button>
                  ))}
                </div>
              </Section>

              <Section title="Cache Management">
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <div className="text-sm text-white">Response Cache</div>
                    <div className="text-xs text-zinc-500">Cached LLM responses and embeddings</div>
                  </div>
                  <button onClick={clearCache} disabled={clearing}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-zinc-700 hover:bg-zinc-600 disabled:opacity-50 text-zinc-300 rounded-xl text-xs font-medium transition-colors">
                    {clearing ? <RefreshCw className="w-3 h-3 animate-spin" /> : <Trash2 className="w-3 h-3" />}
                    {clearing ? 'Clearing…' : 'Clear Cache'}
                  </button>
                </div>
              </Section>

              <div className="rounded-2xl p-5 border border-red-500/20 bg-red-500/5">
                <div className="text-sm font-semibold text-red-400 mb-1 flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4" />Danger Zone
                </div>
                <div className="text-xs text-zinc-500 mb-4">These actions are permanent and cannot be undone.</div>
                <div className="space-y-2">
                  <button className="w-full flex items-center gap-2 p-3 rounded-xl border border-red-500/20 hover:border-red-500/40 hover:bg-red-500/10 text-red-400 text-sm transition-all text-left">
                    <Trash2 className="w-4 h-4 flex-shrink-0" />
                    Delete all knowledge graphs
                  </button>
                  <button className="w-full flex items-center gap-2 p-3 rounded-xl border border-red-500/20 hover:border-red-500/40 hover:bg-red-500/10 text-red-400 text-sm transition-all text-left">
                    <Trash2 className="w-4 h-4 flex-shrink-0" />
                    Delete all uploaded documents
                  </button>
                </div>
              </div>
            </>)}
          </div>
        </div>
      </div>
    </div>
  );
}
