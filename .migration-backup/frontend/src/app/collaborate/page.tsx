'use client';

import { useState } from 'react';

export default function CollaborativeWorkspace() {
  const [room, setRoom] = useState('');
  const [joined, setJoined] = useState(false);
  const [messages, setMessages] = useState<any[]>([
    { user: "Maya", text: "Just uploaded the new GAT paper" },
    { user: "Alex", text: "Mood correlation looks strong on page 7" },
  ]);

  const joinRoom = () => {
    if (room.trim()) setJoined(true);
  };

  const sendMessage = (text: string) => {
    setMessages(prev => [...prev, { user: "You", text }]);
  };

  return (
    <div className="p-8 max-w-5xl mx-auto">
      <h1 className="text-5xl font-semibold tracking-tighter mb-2">Collaborative Workspace</h1>
      <p className="text-xl text-zinc-400 mb-8">Real-time research rooms with shared graphs, journals &amp; AI</p>

      {!joined ? (
        <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-12 text-center">
          <input 
            value={room} 
            onChange={e => setRoom(e.target.value)}
            className="bg-zinc-950 border border-zinc-800 px-6 py-4 rounded-2xl w-80 text-center"
            placeholder="Room name (e.g. mood-graphs-2026)"
          />
          <button onClick={joinRoom} className="ml-4 px-8 py-4 bg-white text-black rounded-2xl font-medium">Join Room</button>
        </div>
      ) : (
        <div>
          <div className="flex items-center gap-3 mb-6">
            <div className="px-4 py-1 bg-emerald-500/10 text-emerald-400 rounded-full text-xs">LIVE • {room}</div>
            <div className="text-xs text-zinc-500">3 researchers online</div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
            <div className="lg:col-span-3 bg-zinc-900 border border-zinc-800 rounded-3xl p-8 h-[420px] overflow-auto">
              <div className="text-xs text-zinc-500 mb-4">LIVE CHAT + ACTIVITY</div>
              {messages.map((m, i) => (
                <div key={i} className="mb-4"><span className="font-medium">{m.user}:</span> {m.text}</div>
              ))}
              <input 
                className="mt-6 w-full bg-zinc-950 border border-zinc-800 rounded-2xl px-4 py-3 text-sm" 
                placeholder="Share insight or ask AI..."
                onKeyDown={e => e.key === 'Enter' && sendMessage((e.target as HTMLInputElement).value)}
              />
            </div>

            <div className="lg:col-span-2 space-y-6">
              <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-7">
                <div className="text-xs text-zinc-500 mb-4">SHARED GRAPH</div>
                <div className="text-sm">Knowledge Graph • 64 nodes • Last updated 2m ago</div>
              </div>
              <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-7">
                <div className="text-xs text-zinc-500 mb-4">LIVE JOURNAL ENTRIES</div>
                <div className="text-sm">3 new entries today from team members</div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}