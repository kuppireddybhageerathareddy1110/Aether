import { useState } from 'react';

export default function AIAssistant() {
  const [messages, setMessages] = useState<any[]>([
    { role: 'assistant', content: 'Hi! I\'m your Aether AI assistant. I can help you analyze your research, generate insights, and coordinate with all platform features.' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const send = async () => {
    if (!input.trim()) return;
    const userMsg = { role: 'user', content: input };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    setTimeout(() => {
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: `I've analyzed your request about "${userMsg.content}". Based on your research data: your knowledge graphs show strong clustering in this area, your recent journal entries express curiosity about related topics, and I recommend exploring the Mood × Graph correlation feature for deeper insights.`
      }]);
      setLoading(false);
    }, 1000);
  };

  return (
    <div className="flex flex-col h-screen max-w-4xl mx-auto p-8">
      <div className="mb-6">
        <h1 className="text-4xl font-semibold tracking-tight">AI Assistant</h1>
        <p className="text-zinc-400">Your intelligent research companion</p>
      </div>

      <div className="flex-1 overflow-auto glass rounded-3xl p-8 space-y-6">
        {messages.map((m, i) => (
          <div key={i} className={m.role === 'user' ? 'text-right' : ''}>
            <div className={`inline-block max-w-[80%] px-6 py-4 rounded-3xl text-sm leading-relaxed ${
              m.role === 'user' ? 'bg-white text-black' : 'bg-zinc-800'
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
          onKeyDown={(e) => e.key === 'Enter' && send()}
          className="flex-1 glass rounded-2xl px-6 py-4"
          placeholder="Ask your AI assistant..."
        />
        <button onClick={send} className="px-8 py-4 bg-white text-black rounded-2xl font-medium">Send</button>
      </div>
    </div>
  );
}
