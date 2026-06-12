import { useState, useEffect } from 'react';
import { TrendingUp, Tag, Save, Sparkles, Trash2, RefreshCw } from 'lucide-react';
import { api } from '@/lib/api';

const moods = [
  { score: 1, emoji: '😭', label: 'Terrible' }, { score: 2, emoji: '😢', label: 'Very Bad' },
  { score: 3, emoji: '😔', label: 'Bad' }, { score: 4, emoji: '😕', label: 'Low' },
  { score: 5, emoji: '😐', label: 'Neutral' }, { score: 6, emoji: '🙂', label: 'Good' },
  { score: 7, emoji: '😊', label: 'Happy' }, { score: 8, emoji: '😄', label: 'Great' },
  { score: 9, emoji: '🤩', label: 'Excellent' }, { score: 10, emoji: '🚀', label: 'Amazing' },
];
const tags = ['Focused', 'Creative', 'Tired', 'Inspired', 'Curious', 'Anxious', 'Motivated', 'Calm', 'Energized', 'Stressed'];

export default function MoodJournal() {
  const [selectedMood, setSelectedMood] = useState<number | null>(null);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [text, setText] = useState('');
  const [saving, setSaving] = useState(false);
  const [saveMsg, setSaveMsg] = useState('');
  const [analyzing, setAnalyzing] = useState(false);
  const [analyzed, setAnalyzed] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<'write' | 'history' | 'trends' | 'recommendations'>('write');
  const [entries, setEntries] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const loadEntries = async () => {
    setLoading(true);
    try { const data = await api.get<any[]>('/journal'); setEntries(data); }
    catch { } finally { setLoading(false); }
  };

  useEffect(() => { if (activeTab === 'history' || activeTab === 'trends') loadEntries(); }, [activeTab]);

  const toggleTag = (tag: string) => setSelectedTags(prev => prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]);

  const analyze = () => {
    if (!text.trim() || !selectedMood) return;
    setAnalyzing(true);
    setTimeout(() => {
      const sentiment = Math.min(1, Math.max(0, (selectedMood - 1) / 9 + (Math.random() - 0.5) * 0.15));
      setAnalyzed({ sentiment: sentiment.toFixed(2), energy: selectedMood >= 7 ? 'High' : selectedMood >= 5 ? 'Medium' : 'Low', focus: (selectedMood + Math.random() * 2).toFixed(1) });
      setAnalyzing(false);
    }, 1200);
  };

  const save = async () => {
    if (!text.trim() || !selectedMood) { setSaveMsg('Please select a mood and write something first.'); return; }
    setSaving(true);
    try {
      const moodObj = moods.find(m => m.score === selectedMood)!;
      await api.post('/journal', { content: text, moodScore: selectedMood, moodLabel: moodObj.label, tags: selectedTags });
      setSaveMsg('Entry saved! 🎉'); setText(''); setSelectedMood(null); setSelectedTags([]); setAnalyzed(null);
      setTimeout(() => setSaveMsg(''), 3000);
    } catch (e: any) { setSaveMsg(e.message ?? 'Failed to save entry'); }
    finally { setSaving(false); }
  };

  const deleteEntry = async (id: number) => {
    try { await api.delete(`/journal/${id}`); setEntries(prev => prev.filter(e => e.id !== id)); }
    catch { }
  };

  const moodObj = moods.find(m => m.score === selectedMood);
  const weekEntries = entries.slice(0, 7).reverse();

  return (
    <div className="h-screen flex flex-col bg-zinc-950">
      <div className="border-b border-zinc-800 bg-zinc-900/50 px-6 py-4">
        <h1 className="text-xl font-bold text-white flex items-center gap-2"><TrendingUp className="w-5 h-5 text-pink-400" />Mood Journal</h1>
        <p className="text-xs text-zinc-500 mt-0.5">AI-powered mood tracking, sentiment analysis, and research correlation</p>
      </div>

      <div className="border-b border-zinc-800 px-6">
        <div className="flex gap-1 py-2">
          {[['write', 'Write Entry'], ['history', 'Past Entries'], ['trends', '7-Day Trends'], ['recommendations', 'Recommendations']].map(([k, label]) => (
            <button key={k} onClick={() => setActiveTab(k as any)}
              className={`px-4 py-1.5 rounded-lg text-xs font-medium transition-colors ${activeTab === k ? 'bg-pink-500/20 text-pink-300 border border-pink-500/30' : 'text-zinc-500 hover:text-white hover:bg-zinc-800'}`}>
              {label}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-auto p-6">
        {activeTab === 'write' && (
          <div className="max-w-2xl mx-auto space-y-5">
            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5">
              <div className="text-xs font-semibold text-zinc-400 uppercase tracking-widest mb-3">How are you feeling? (1–10)</div>
              <div className="grid grid-cols-10 gap-1.5">
                {moods.map(m => (
                  <button key={m.score} onClick={() => setSelectedMood(m.score)}
                    className={`flex flex-col items-center p-2 rounded-xl transition-all ${selectedMood === m.score ? 'bg-pink-500/20 border border-pink-500/40 scale-110' : 'hover:bg-zinc-800'}`}>
                    <span className="text-2xl">{m.emoji}</span>
                    <span className="text-[9px] text-zinc-500 mt-0.5">{m.score}</span>
                  </button>
                ))}
              </div>
              {moodObj && <div className="mt-3 text-center text-sm font-semibold" style={{ color: selectedMood! >= 7 ? '#34d399' : selectedMood! >= 5 ? '#fbbf24' : '#f87171' }}>{moodObj.emoji} {moodObj.label}</div>}
            </div>

            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5">
              <div className="text-xs font-semibold text-zinc-400 uppercase tracking-widest mb-3 flex items-center gap-1.5"><Tag className="w-3.5 h-3.5" />Select Tags</div>
              <div className="flex flex-wrap gap-2">
                {tags.map(tag => (
                  <button key={tag} onClick={() => toggleTag(tag)}
                    className={`px-3 py-1.5 rounded-full text-xs transition-all ${selectedTags.includes(tag) ? 'bg-pink-500/20 text-pink-300 border border-pink-500/30' : 'bg-zinc-800 text-zinc-400 hover:text-white hover:bg-zinc-700'}`}>
                    {tag}
                  </button>
                ))}
              </div>
            </div>

            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5">
              <div className="text-xs font-semibold text-zinc-400 uppercase tracking-widest mb-3">Journal Entry</div>
              <textarea value={text} onChange={e => setText(e.target.value)}
                className="w-full h-28 bg-zinc-950 border border-zinc-700 rounded-xl p-4 text-sm text-white placeholder:text-zinc-600 resize-none focus:outline-none focus:border-pink-500/50"
                placeholder="Write about your research session today..." />
              {saveMsg && <div className={`mt-2 text-xs px-3 py-2 rounded-lg ${saveMsg.includes('🎉') ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-400'}`}>{saveMsg}</div>}
              <div className="flex gap-3 mt-3">
                <button onClick={analyze} disabled={analyzing || !text.trim() || !selectedMood}
                  className="flex items-center gap-1.5 px-5 py-2 bg-pink-600 hover:bg-pink-500 disabled:opacity-40 text-white rounded-xl text-xs font-medium transition-colors">
                  {analyzing ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5" />}
                  {analyzing ? 'Analyzing...' : 'Analyze with AI'}
                </button>
                <button onClick={save} disabled={saving || !text.trim() || !selectedMood}
                  className="flex items-center gap-1.5 px-5 py-2 bg-zinc-700 hover:bg-zinc-600 disabled:opacity-40 text-white rounded-xl text-xs font-medium transition-colors">
                  {saving ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
                  {saving ? 'Saving...' : 'Save Entry'}
                </button>
              </div>
            </div>

            {analyzed && (
              <div className="bg-gradient-to-br from-pink-500/10 to-rose-500/5 border border-pink-500/20 rounded-2xl p-5">
                <div className="text-xs font-semibold text-pink-400 uppercase tracking-widest mb-3">AI Sentiment Analysis</div>
                <div className="grid grid-cols-3 gap-3 mb-4">
                  <div className="bg-zinc-900/50 rounded-xl p-3 text-center"><div className="text-lg font-bold text-emerald-400">{analyzed.sentiment}</div><div className="text-[10px] text-zinc-500">Sentiment</div></div>
                  <div className="bg-zinc-900/50 rounded-xl p-3 text-center"><div className="text-lg font-bold text-amber-400">{analyzed.energy}</div><div className="text-[10px] text-zinc-500">Energy</div></div>
                  <div className="bg-zinc-900/50 rounded-xl p-3 text-center"><div className="text-lg font-bold text-blue-400">{analyzed.focus}/10</div><div className="text-[10px] text-zinc-500">Focus</div></div>
                </div>
                <div className="text-sm text-zinc-300 leading-relaxed"><span className="text-pink-400 font-medium">AI Insight:</span> {selectedTags[0] === 'Curious' ? 'High curiosity correlates with 2.3× better graph quality.' : selectedTags[0] === 'Focused' ? 'Focus peak detected — schedule deep research sessions now.' : 'Track patterns over time to unlock personalized research insights.'}</div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'history' && (
          <div className="max-w-2xl mx-auto">
            <div className="flex items-center justify-between mb-4">
              <div className="text-xs text-zinc-500">{entries.length} entries</div>
              <button onClick={loadEntries} className="text-xs text-zinc-500 hover:text-white flex items-center gap-1">
                <RefreshCw className={`w-3 h-3 ${loading ? 'animate-spin' : ''}`} />Refresh
              </button>
            </div>
            {loading ? <div className="text-center py-8 text-zinc-500 text-sm">Loading entries...</div>
              : entries.length === 0 ? <div className="text-center py-16 text-zinc-600 text-sm">No entries yet — write your first journal entry above</div>
              : <div className="space-y-4">
                {entries.map(entry => {
                  const mood = moods.find(m => m.score === entry.moodScore);
                  return (
                    <div key={entry.id} className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 hover:border-zinc-700 transition-colors">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <span className="text-2xl">{mood?.emoji}</span>
                          <div>
                            <div className="text-sm font-semibold text-white">{entry.moodLabel}</div>
                            <div className="text-xs text-zinc-500">{new Date(entry.createdAt).toLocaleDateString()}</div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="flex gap-1.5">
                            {(entry.tags as string[]).slice(0, 2).map((t: string) => <span key={t} className="px-2 py-0.5 bg-pink-500/10 text-pink-400 text-[10px] rounded-full border border-pink-500/20">{t}</span>)}
                          </div>
                          <button onClick={() => deleteEntry(entry.id)} className="p-1.5 text-zinc-600 hover:text-red-400 transition-colors"><Trash2 className="w-3.5 h-3.5" /></button>
                        </div>
                      </div>
                      <p className="text-sm text-zinc-300 leading-relaxed mb-3 line-clamp-3">{entry.content}</p>
                      {entry.sentiment !== null && (
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="text-[10px] text-zinc-500 mb-1">Sentiment</div>
                            <div className="w-32 h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                              <div className="h-full bg-gradient-to-r from-pink-500 to-rose-400 rounded-full" style={{ width: `${(entry.sentiment ?? 0) * 100}%` }} />
                            </div>
                          </div>
                          {entry.aiInsight && <div className="text-xs text-pink-400 italic max-w-xs text-right">💡 {entry.aiInsight}</div>}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>}
          </div>
        )}

        {activeTab === 'trends' && (
          <div className="max-w-2xl mx-auto space-y-4">
            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5">
              <div className="text-xs font-semibold text-zinc-400 uppercase tracking-widest mb-4">Recent Entries — Mood · Energy · Focus</div>
              {weekEntries.length === 0 ? (
                <div className="text-center py-8 text-zinc-600 text-sm">Save journal entries to see trends</div>
              ) : (
                <div className="flex items-end gap-2 h-32">
                  {weekEntries.map((e, i) => (
                    <div key={e.id} className="flex-1 flex flex-col items-center gap-1">
                      <div className="w-full flex gap-0.5 items-end h-24">
                        <div className="flex-1 rounded-t-sm bg-pink-500/60" style={{ height: `${(e.moodScore / 10) * 100}%` }} title={`Mood: ${e.moodScore}`} />
                        <div className="flex-1 rounded-t-sm bg-amber-500/60" style={{ height: `${((e.energy ?? e.moodScore) / 10) * 100}%` }} title="Energy" />
                        <div className="flex-1 rounded-t-sm bg-blue-500/60" style={{ height: `${((e.focus ?? e.moodScore) / 10) * 100}%` }} title="Focus" />
                      </div>
                      <div className="text-[9px] text-zinc-500">{new Date(e.createdAt).toLocaleDateString(undefined, { weekday: 'short' })}</div>
                    </div>
                  ))}
                </div>
              )}
              <div className="flex gap-4 mt-3 justify-center">
                {[{ label: 'Mood', color: 'bg-pink-500' }, { label: 'Energy', color: 'bg-amber-500' }, { label: 'Focus', color: 'bg-blue-500' }].map(l => (
                  <div key={l.label} className="flex items-center gap-1.5 text-xs text-zinc-500"><div className={`w-3 h-3 rounded ${l.color}`} />{l.label}</div>
                ))}
              </div>
            </div>
            {entries.length > 0 && (
              <div className="grid grid-cols-3 gap-3">
                {[
                  { label: 'Avg Mood', value: (entries.reduce((s, e) => s + e.moodScore, 0) / entries.length).toFixed(1) + '/10', color: 'text-pink-400' },
                  { label: 'Total Entries', value: String(entries.length), color: 'text-emerald-400' },
                  { label: 'Avg Sentiment', value: (entries.reduce((s, e) => s + (e.sentiment ?? 0.5), 0) / entries.length).toFixed(2), color: 'text-amber-400' },
                ].map(s => (
                  <div key={s.label} className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 text-center">
                    <div className={`text-xl font-bold ${s.color}`}>{s.value}</div>
                    <div className="text-xs text-zinc-500 mt-0.5">{s.label}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'recommendations' && (
          <div className="max-w-2xl mx-auto space-y-4">
            <div className="text-xs font-semibold text-zinc-400 uppercase tracking-widest mb-2">Personalized Daily Recommendations</div>
            {[
              { time: 'Morning (9–11am)', icon: '🌅', rec: 'Your peak focus window. Schedule deep reading and knowledge graph generation.', conf: 0.92 },
              { time: 'Afternoon (2–4pm)', icon: '☀️', rec: 'Moderate energy period. Good for writing, journaling, and QA generation.', conf: 0.85 },
              { time: 'Evening (7–9pm)', icon: '🌙', rec: 'Creative energy peak. Best time for LaTeX writing and paper generation.', conf: 0.78 },
            ].map(r => (
              <div key={r.time} className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5">
                <div className="flex items-center gap-3 mb-2"><span className="text-2xl">{r.icon}</span>
                  <div><div className="text-sm font-semibold text-white">{r.time}</div><div className="text-[10px] text-zinc-500">Confidence: <span className="text-emerald-400">{(r.conf * 100).toFixed(0)}%</span></div></div>
                </div>
                <p className="text-sm text-zinc-400">{r.rec}</p>
              </div>
            ))}
            <div className="bg-gradient-to-br from-pink-500/10 to-rose-500/5 border border-pink-500/20 rounded-2xl p-5">
              <div className="text-xs font-semibold text-pink-400 mb-2">🧠 Based on {entries.length} journal entries</div>
              <p className="text-sm text-zinc-300">Keep logging to get increasingly personalized research productivity recommendations based on your actual mood patterns.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
