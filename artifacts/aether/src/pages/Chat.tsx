import { useState, useRef, useEffect } from 'react';
import { MessageCircle, Send, RefreshCw, Bot, User, Sparkles } from 'lucide-react';
import { api } from '@/lib/api';

interface Message { role: 'user' | 'assistant'; content: string; timestamp: string; confidence?: number; }

const WELCOME = 'Hi! I\'m Aether, your AI research assistant. Ask me anything about your documents, knowledge graphs, or research topics.';

export default function RAGChat() {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: WELCOME, timestamp: new Date().toISOString() },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages]);

  const send = async () => {
    if (!input.trim() || loading) return;
    const userMsg: Message = { role: 'user', content: input, timestamp: new Date().toISOString() };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);
    try {
      const data = await api.post<any>('/chat/message', { message: input });
      setMessages(prev => [...prev, { role: 'assistant', content: data.reply, timestamp: data.timestamp, confidence: data.confidence }]);
    } catch {
      setMessages(prev => [...prev, { role: 'assistant', content: 'Sorry, I couldn\'t process your message. Please try again.', timestamp: new Date().toISOString() }]);
    } finally { setLoading(false); }
  };

  return (
    <div className="h-screen flex flex-col bg-transparent">
      <div className="border-b border-white/[0.07] bg-zinc-900/50 px-6 py-4 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-white flex items-center gap-2"><MessageCircle className="w-5 h-5 text-teal-400" />RAG Chat</h1>
          <p className="text-xs text-zinc-500 mt-0.5">Semantic search over all your research data</p>
        </div>
        <div className="flex items-center gap-1.5 text-xs text-emerald-400"><span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />Aether Online</div>
      </div>

      <div className="flex-1 overflow-auto p-4 space-y-4">
        {messages.map((msg, i) => (
          <div key={i} className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            {msg.role === 'assistant' && (
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-teal-500 to-emerald-600 flex items-center justify-center flex-shrink-0 mt-1">
                <Bot className="w-4 h-4 text-white" />
              </div>
            )}
            <div className={`max-w-xl rounded-2xl px-4 py-3 ${msg.role === 'user' ? 'bg-zinc-800 border border-zinc-700' : 'glass'}`}>
              <div className="text-sm text-zinc-200 leading-relaxed whitespace-pre-wrap">{msg.content}</div>
              <div className="flex items-center justify-between mt-2 gap-2">
                <div className="text-[10px] text-zinc-600">{new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
                {msg.confidence && <div className="text-[10px] text-emerald-400">Confidence: {(msg.confidence * 100).toFixed(0)}%</div>}
              </div>
            </div>
            {msg.role === 'user' && (
              <div className="w-8 h-8 rounded-xl bg-zinc-700 flex items-center justify-center flex-shrink-0 mt-1">
                <User className="w-4 h-4 text-zinc-300" />
              </div>
            )}
          </div>
        ))}
        {loading && (
          <div className="flex gap-3 justify-start">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-teal-500 to-emerald-600 flex items-center justify-center flex-shrink-0">
              <Bot className="w-4 h-4 text-white" />
            </div>
            <div className="glass rounded-2xl px-4 py-3">
              <div className="flex items-center gap-1.5 text-zinc-500 text-sm"><Sparkles className="w-4 h-4 animate-pulse" />Thinking...</div>
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      <div className="border-t border-white/[0.07] p-4">
        <div className="max-w-3xl mx-auto flex gap-3">
          <input value={input} onChange={e => setInput(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(); } }}
            className="flex-1 glass border border-zinc-700 rounded-2xl px-5 py-3 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:border-teal-500/50"
            placeholder="Ask about your research data... (Enter to send)" disabled={loading} />
          <button onClick={send} disabled={loading || !input.trim()}
            className="p-3 bg-teal-600 hover:bg-teal-500 disabled:opacity-40 text-white rounded-2xl transition-colors">
            {loading ? <RefreshCw className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
          </button>
        </div>
        <div className="text-center text-[10px] text-zinc-600 mt-2">Powered by Aether RAG Pipeline · Real-time answers from your knowledge base</div>
      </div>
    </div>
  );
}
