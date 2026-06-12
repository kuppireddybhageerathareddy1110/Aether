import { useState, useEffect } from 'react';
import { BookOpen, Save, RefreshCw, Trash2 } from 'lucide-react';
import { api } from '@/lib/api';
import { Link } from 'wouter';

export default function ResearchJournal() {
  const [entry, setEntry] = useState('');
  const [entries, setEntries] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  const load = async () => {
    setLoading(true);
    try { const data = await api.get<any[]>('/journal'); setEntries(data); }
    catch { } finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  const save = async () => {
    if (!entry.trim()) return;
    setSaving(true);
    try {
      await api.post('/journal', { content: entry, moodScore: 7, moodLabel: 'Good', tags: [] });
      setEntry(''); load();
    } catch { } finally { setSaving(false); }
  };

  const remove = async (id: number) => {
    try { await api.delete(`/journal/${id}`); setEntries(prev => prev.filter(e => e.id !== id)); }
    catch { }
  };

  return (
    <div className="h-screen flex flex-col bg-zinc-950">
      <div className="border-b border-zinc-800 bg-zinc-900/50 px-6 py-4 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-white flex items-center gap-2"><BookOpen className="w-5 h-5 text-pink-400" />Research Journal</h1>
          <p className="text-xs text-zinc-500 mt-0.5">Quick journal entry — for full mood tracking, use the <Link href="/mood-journal" className="text-pink-400 hover:underline">Mood Journal</Link></p>
        </div>
        <button onClick={load} className="p-2 text-zinc-500 hover:text-white hover:bg-zinc-800 rounded-lg transition-colors">
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      <div className="flex-1 overflow-auto p-6">
        <div className="max-w-2xl mx-auto space-y-5">
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5">
            <div className="text-xs font-semibold text-zinc-400 uppercase tracking-widest mb-3">New Entry</div>
            <textarea value={entry} onChange={e => setEntry(e.target.value)}
              className="w-full h-28 bg-zinc-950 border border-zinc-700 rounded-xl p-4 text-sm text-white placeholder:text-zinc-600 resize-none focus:outline-none focus:border-pink-500/50"
              placeholder="Write your research thoughts here..." />
            <button onClick={save} disabled={saving || !entry.trim()}
              className="mt-3 flex items-center gap-1.5 px-5 py-2.5 bg-pink-600 hover:bg-pink-500 disabled:opacity-40 text-white rounded-xl text-sm font-medium transition-colors">
              {saving ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              {saving ? 'Saving...' : 'Save Entry'}
            </button>
          </div>

          {entries.map(e => (
            <div key={e.id} className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 hover:border-zinc-700 transition-colors">
              <div className="flex items-start justify-between mb-2">
                <div className="text-xs text-zinc-500">{new Date(e.createdAt).toLocaleString()} · Mood: {e.moodLabel}</div>
                <button onClick={() => remove(e.id)} className="p-1 text-zinc-600 hover:text-red-400 transition-colors"><Trash2 className="w-3.5 h-3.5" /></button>
              </div>
              <p className="text-sm text-zinc-300 leading-relaxed">{e.content}</p>
              {e.aiInsight && <div className="mt-3 text-xs text-pink-400 italic">💡 {e.aiInsight}</div>}
            </div>
          ))}

          {entries.length === 0 && !loading && (
            <div className="text-center py-8 text-zinc-600 text-sm">No entries yet — write something above</div>
          )}
        </div>
      </div>
    </div>
  );
}
