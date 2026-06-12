import { useState } from 'react';

export default function Settings() {
  const [backendUrl, setBackendUrl] = useState('http://localhost:8000');
  const [saved, setSaved] = useState(false);

  const save = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="p-8 max-w-3xl mx-auto">
      <h1 className="text-4xl font-semibold tracking-tight mb-2">Settings</h1>
      <p className="text-zinc-400 mb-8">Configure your Aether platform</p>

      <div className="space-y-6">
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-8">
          <h3 className="font-semibold mb-4">Backend Connection</h3>
          <div className="space-y-3">
            <label className="text-sm text-zinc-400">Backend URL</label>
            <input
              type="text"
              value={backendUrl}
              onChange={(e) => setBackendUrl(e.target.value)}
              className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-sm"
            />
          </div>
        </div>

        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-8">
          <h3 className="font-semibold mb-4">Platform Info</h3>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between"><span className="text-zinc-500">Version</span><span>v1.0.0</span></div>
            <div className="flex justify-between"><span className="text-zinc-500">Integrated Repos</span><span>7</span></div>
            <div className="flex justify-between"><span className="text-zinc-500">Stack</span><span>Next.js → Vite + React</span></div>
          </div>
        </div>

        <button
          onClick={save}
          className="px-8 py-3 bg-white text-black rounded-2xl font-medium"
        >
          {saved ? 'Saved ✓' : 'Save Settings'}
        </button>
      </div>
    </div>
  );
}
