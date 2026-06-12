import { useState } from 'react';
import { TrendingUp, Tag, Save, Sparkles } from 'lucide-react';

const moods = [
  { score: 1, emoji: '😭', label: 'Terrible' },
  { score: 2, emoji: '😢', label: 'Very Bad' },
  { score: 3, emoji: '😔', label: 'Bad' },
  { score: 4, emoji: '😕', label: 'Low' },
  { score: 5, emoji: '😐', label: 'Neutral' },
  { score: 6, emoji: '🙂', label: 'Good' },
  { score: 7, emoji: '😊', label: 'Happy' },
  { score: 8, emoji: '😄', label: 'Great' },
  { score: 9, emoji: '🤩', label: 'Excellent' },
  { score: 10, emoji: '🚀', label: 'Amazing' },
];

const tags = ['Focused', 'Creative', 'Tired', 'Inspired', 'Curious', 'Anxious', 'Motivated', 'Calm', 'Energized', 'Stressed'];

const pastEntries = [
  { date: 'Jun 12', mood: 9, moodLabel: 'Excellent', tags: ['Curious', 'Focused'], content: 'Discovered a breakthrough connection between mood patterns and graph centrality scores.', sentiment: 0.89, insight: 'High curiosity correlates with 2.3× better graph quality' },
  { date: 'Jun 11', mood: 7, moodLabel: 'Happy', tags: ['Motivated', 'Creative'], content: 'Generated 3 new knowledge graphs and ran XAI analysis on all of them.', sentiment: 0.72, insight: 'Creative sessions produce more dense knowledge graphs' },
  { date: 'Jun 10', mood: 5, moodLabel: 'Neutral', tags: ['Tired', 'Stressed'], content: 'Long debugging session. Made progress but felt drained by the end.', sentiment: 0.31, insight: 'Tired states reduce coding productivity by ~47%' },
  { date: 'Jun 9', mood: 8, moodLabel: 'Great', tags: ['Inspired', 'Energized'], content: 'Read 4 papers on GNNs. Feeling very inspired about mood-aware approaches.', sentiment: 0.84, insight: 'Paper reading on high-energy days retains 3× more concepts' },
];

const weekData = [
  { day: 'Mon', mood: 6, energy: 7, focus: 5 },
  { day: 'Tue', mood: 8, energy: 8, focus: 9 },
  { day: 'Wed', mood: 5, energy: 4, focus: 4 },
  { day: 'Thu', mood: 7, energy: 7, focus: 8 },
  { day: 'Fri', mood: 9, energy: 9, focus: 9 },
  { day: 'Sat', mood: 7, energy: 6, focus: 6 },
  { day: 'Sun', mood: 8, energy: 8, focus: 7 },
];

export default function MoodJournal() {
  const [selectedMood, setSelectedMood] = useState<number | null>(null);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [text, setText] = useState('');
  const [analyzed, setAnalyzed] = useState(false);
  const [activeTab, setActiveTab] = useState<'write' | 'history' | 'trends' | 'recommendations'>('write');

  const toggleTag = (tag: string) => {
    setSelectedTags(prev => prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]);
  };

  const analyze = () => {
    if (text.trim()) setAnalyzed(true);
  };

  const moodObj = moods.find(m => m.score === selectedMood);

  const maxH = 10;

  return (
    <div className="h-screen flex flex-col bg-zinc-950">
      <div className="border-b border-zinc-800 bg-zinc-900/50 px-6 py-4">
        <h1 className="text-xl font-bold text-white flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-pink-400" />Mood Journal
        </h1>
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
            {/* Mood picker */}
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
              {moodObj && (
                <div className="mt-3 text-center text-sm font-semibold" style={{ color: selectedMood! >= 7 ? '#34d399' : selectedMood! >= 5 ? '#fbbf24' : '#f87171' }}>
                  {moodObj.emoji} {moodObj.label}
                </div>
              )}
            </div>

            {/* Tags */}
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

            {/* Text */}
            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5">
              <div className="text-xs font-semibold text-zinc-400 uppercase tracking-widest mb-3">Journal Entry</div>
              <textarea value={text} onChange={e => setText(e.target.value)}
                className="w-full h-28 bg-zinc-950 border border-zinc-700 rounded-xl p-4 text-sm text-white placeholder:text-zinc-600 resize-none focus:outline-none focus:border-pink-500/50"
                placeholder="Write about your research session today..." />
              <div className="flex gap-3 mt-3">
                <button onClick={analyze} className="flex items-center gap-1.5 px-5 py-2 bg-pink-600 hover:bg-pink-500 text-white rounded-xl text-xs font-medium transition-colors">
                  <Sparkles className="w-3.5 h-3.5" />Analyze with AI
                </button>
                <button className="flex items-center gap-1.5 px-5 py-2 bg-zinc-700 hover:bg-zinc-600 text-white rounded-xl text-xs font-medium transition-colors">
                  <Save className="w-3.5 h-3.5" />Save Entry
                </button>
              </div>
            </div>

            {analyzed && (
              <div className="bg-gradient-to-br from-pink-500/10 to-rose-500/5 border border-pink-500/20 rounded-2xl p-5">
                <div className="text-xs font-semibold text-pink-400 uppercase tracking-widest mb-3">AI Sentiment Analysis</div>
                <div className="grid grid-cols-3 gap-3 mb-4">
                  {[{ label: 'Sentiment', value: '0.78', color: 'text-emerald-400' }, { label: 'Energy', value: 'High', color: 'text-amber-400' }, { label: 'Focus', value: '8.2/10', color: 'text-blue-400' }].map(m => (
                    <div key={m.label} className="bg-zinc-900/50 rounded-xl p-3 text-center">
                      <div className={`text-lg font-bold ${m.color}`}>{m.value}</div>
                      <div className="text-[10px] text-zinc-500 mt-0.5">{m.label}</div>
                    </div>
                  ))}
                </div>
                <div className="text-sm text-zinc-300 leading-relaxed">
                  <span className="text-pink-400 font-medium">AI Insight:</span> Your entry shows high curiosity and intellectual engagement. This mood profile historically correlates with 2.3× higher graph centrality scores in your knowledge graphs. Schedule deep research sessions while in this state.
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'history' && (
          <div className="max-w-2xl mx-auto space-y-4">
            {pastEntries.map((entry, i) => (
              <div key={i} className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 hover:border-zinc-700 transition-colors">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{moods.find(m => m.score === entry.mood)?.emoji}</span>
                    <div>
                      <div className="text-sm font-semibold text-white">{entry.moodLabel}</div>
                      <div className="text-xs text-zinc-500">{entry.date}</div>
                    </div>
                  </div>
                  <div className="flex gap-1.5">
                    {entry.tags.map(t => <span key={t} className="px-2 py-0.5 bg-pink-500/10 text-pink-400 text-[10px] rounded-full border border-pink-500/20">{t}</span>)}
                  </div>
                </div>
                <p className="text-sm text-zinc-300 leading-relaxed mb-3">{entry.content}</p>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-[10px] text-zinc-500 mb-1">Sentiment Score</div>
                    <div className="w-32 h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-pink-500 to-rose-400 rounded-full" style={{ width: `${entry.sentiment * 100}%` }} />
                    </div>
                  </div>
                  <div className="text-xs text-pink-400 italic max-w-xs text-right">💡 {entry.insight}</div>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'trends' && (
          <div className="max-w-2xl mx-auto space-y-4">
            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5">
              <div className="text-xs font-semibold text-zinc-400 uppercase tracking-widest mb-4">7-Day Mood · Energy · Focus</div>
              <div className="flex items-end gap-2 h-32">
                {weekData.map(d => (
                  <div key={d.day} className="flex-1 flex flex-col items-center gap-1">
                    <div className="w-full flex gap-0.5 items-end h-24">
                      <div className="flex-1 rounded-t-sm bg-pink-500/60 transition-all" style={{ height: `${d.mood / maxH * 100}%` }} title={`Mood: ${d.mood}`} />
                      <div className="flex-1 rounded-t-sm bg-amber-500/60 transition-all" style={{ height: `${d.energy / maxH * 100}%` }} title={`Energy: ${d.energy}`} />
                      <div className="flex-1 rounded-t-sm bg-blue-500/60 transition-all" style={{ height: `${d.focus / maxH * 100}%` }} title={`Focus: ${d.focus}`} />
                    </div>
                    <div className="text-[10px] text-zinc-500">{d.day}</div>
                  </div>
                ))}
              </div>
              <div className="flex gap-4 mt-3 justify-center">
                {[{ label: 'Mood', color: 'bg-pink-500' }, { label: 'Energy', color: 'bg-amber-500' }, { label: 'Focus', color: 'bg-blue-500' }].map(l => (
                  <div key={l.label} className="flex items-center gap-1.5 text-xs text-zinc-500">
                    <div className={`w-3 h-3 rounded ${l.color}`} />{l.label}
                  </div>
                ))}
              </div>
            </div>
            <div className="grid grid-cols-3 gap-3">
              {[{ label: 'Avg Mood', value: '7.1/10', trend: '+0.8', color: 'text-pink-400' }, { label: 'Avg Energy', value: '7.0/10', trend: '+0.5', color: 'text-amber-400' }, { label: 'Avg Focus', value: '6.9/10', trend: '+1.2', color: 'text-blue-400' }].map(s => (
                <div key={s.label} className="bg-zinc-900 border border-zinc-800 rounded-xl p-4">
                  <div className={`text-xl font-bold ${s.color}`}>{s.value}</div>
                  <div className="text-xs text-zinc-500 mt-0.5">{s.label}</div>
                  <div className="text-xs text-emerald-400 mt-1">{s.trend} vs last week</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'recommendations' && (
          <div className="max-w-2xl mx-auto space-y-4">
            <div className="text-xs font-semibold text-zinc-400 uppercase tracking-widest mb-2">Personalized Daily Recommendations</div>
            {[
              { time: 'Morning (9–11am)', icon: '🌅', rec: 'Your peak focus window. Schedule deep reading and knowledge graph generation.', confidence: 0.92 },
              { time: 'Afternoon (2–4pm)', icon: '☀️', rec: 'Moderate energy period. Good for writing, journaling, and QA generation.', confidence: 0.85 },
              { time: 'Evening (7–9pm)', icon: '🌙', rec: 'Creative energy peak. Best time for LaTeX writing and paper generation.', confidence: 0.78 },
            ].map(r => (
              <div key={r.time} className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5">
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-2xl">{r.icon}</span>
                  <div>
                    <div className="text-sm font-semibold text-white">{r.time}</div>
                    <div className="text-[10px] text-zinc-500">Confidence: <span className="text-emerald-400">{(r.confidence * 100).toFixed(0)}%</span></div>
                  </div>
                </div>
                <p className="text-sm text-zinc-400 leading-relaxed">{r.rec}</p>
              </div>
            ))}
            <div className="bg-gradient-to-br from-pink-500/10 to-rose-500/5 border border-pink-500/20 rounded-2xl p-5">
              <div className="text-xs font-semibold text-pink-400 mb-2">🧠 Weekly Insight</div>
              <p className="text-sm text-zinc-300">Your "Curious" mood state produces graphs with <span className="text-emerald-400 font-semibold">2.3× higher centrality</span>. You were Curious for 3 days this week. Consider scheduling knowledge graph work during mornings when curiosity tends to peak.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
