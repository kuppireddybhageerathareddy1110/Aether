'use client';

import { useState } from 'react';

export default function RAGChat() {
  const [messages, setMessages] = useState<any[]>([
    { role: 'assistant', content: 'Hello! I can answer questions across all your documents and journal entries.' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMsg = { role: 'user', content: input };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    // Simulate RAG response (in real version this would call /search + LLM)
    setTimeout(() => {
      const reply = {
        role: 'assistant',
        content: `Based on your documents and journal, here's what I found about "${input}":\n\nThis topic appears in 3 journal entries and 2 uploaded papers. Key insight: relevance score was 0.91.`
      };
      setMessages(prev => [...prev, reply]);
      setLoading(false);
    }, 900);
  };

  return (
    <div className="flex flex-col h-screen max-w-4xl mx-auto p-8">
      <div className="mb-6">
        <h1 className="text-4xl font-semibold tracking-tight">RAG Chat</h1>
        <p className="text-zinc-400">Ask anything across your entire knowledge base</p>
      </div>

      <div className="flex-1 overflow-auto bg-zinc-900 border border-zinc-800 rounded-3xl p-8 space-y-6">
        {messages.map((m, i) => (
          <div key={i} className={m.role === 'user' ? 'text-right' : ''}>
            <div className={`inline-block max-w-[80%] px-6 py-4 rounded-3xl text-sm ${
              m.role === 'user' 
                ? 'bg-white text-black' 
                : 'bg-zinc-800'
            }`}>
              {m.content}
            </div>
          </div>
        ))}
        {loading && <div className="text-zinc-500 text-sm">Thinking...</div>}
      </div>

      <div className="flex gap-3 mt-6">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
          className="flex-1 bg-zinc-900 border border-zinc-800 rounded-2xl px-6 py-4"
          placeholder="Ask about your research..."
        />
        <button onClick={sendMessage} className="px-8 py-4 bg-white text-black rounded-2xl font-medium">Send</button>
      </div>
    </div>
  );
}