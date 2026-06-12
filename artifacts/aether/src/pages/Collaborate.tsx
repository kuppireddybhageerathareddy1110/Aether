import { useState } from 'react';

const rooms = [
  { id: 1, name: 'Graph Theory Discussion', participants: 3, active: true },
  { id: 2, name: 'XAI Methods Review', participants: 2, active: true },
  { id: 3, name: 'Mood Analytics Brainstorm', participants: 1, active: false },
];

export default function Collaborate() {
  const [joined, setJoined] = useState<number | null>(null);

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <div className="flex justify-between items-end mb-8">
        <div>
          <h1 className="text-5xl font-semibold tracking-tighter">Collaborate</h1>
          <p className="text-zinc-400 mt-2">Real-time collaborative research rooms</p>
        </div>
        <button className="px-6 py-3 bg-white text-black rounded-2xl text-sm font-medium">New Room</button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {rooms.map(room => (
          <div
            key={room.id}
            onClick={() => setJoined(room.id)}
            className={`glass rounded-3xl p-7 cursor-pointer hover:border-zinc-700 transition-all ${joined === room.id ? 'ring-1 ring-white' : ''}`}
          >
            <div className="flex items-center justify-between mb-3">
              <div className={`w-2 h-2 rounded-full ${room.active ? 'bg-emerald-400' : 'bg-zinc-600'}`} />
              <div className="text-xs text-zinc-500">{room.participants} participants</div>
            </div>
            <div className="font-semibold">{room.name}</div>
            <button className="mt-5 px-4 py-2 bg-white/[0.06] rounded-xl text-xs">
              {joined === room.id ? 'Joined ✓' : 'Join Room'}
            </button>
          </div>
        ))}
      </div>

      {joined && (
        <div className="glass rounded-3xl p-8">
          <div className="text-emerald-400 text-xs mb-2">LIVE COLLABORATION</div>
          <div className="text-xl mb-6">{rooms.find(r => r.id === joined)?.name}</div>
          <div className="bg-zinc-950 rounded-2xl p-6 h-48 text-sm text-zinc-500">
            Shared workspace — real-time edits appear here...
          </div>
        </div>
      )}
    </div>
  );
}
