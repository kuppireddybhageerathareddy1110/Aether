'use client';

export default function Settings() {
  return (
    <div className="p-8 max-w-3xl mx-auto">
      <h1 className="text-4xl font-semibold tracking-tight mb-2">Settings</h1>
      <p className="text-zinc-400 mb-8">Configure your Aether experience</p>

      <div className="space-y-8">
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-8">
          <h3 className="font-medium mb-4">Account</h3>
          <div className="space-y-4 text-sm">
            <div className="flex justify-between"><span>Name</span> <span className="text-zinc-400">Alex Rivera</span></div>
            <div className="flex justify-between"><span>Email</span> <span className="text-zinc-400">alex@research.dev</span></div>
            <div className="flex justify-between"><span>Plan</span> <span className="text-emerald-400">Pro</span></div>
          </div>
        </div>

        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-8">
          <h3 className="font-medium mb-4">AI Preferences</h3>
          <div className="space-y-3 text-sm">
            <div>Default LLM: <span className="text-zinc-400">Groq Mixtral</span></div>
            <div>Mood Detection: <span className="text-emerald-400">Enabled</span></div>
            <div>XAI Explanations: <span className="text-emerald-400">Always show</span></div>
          </div>
        </div>

        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-8">
          <h3 className="font-medium mb-4">Data</h3>
          <button className="text-sm px-5 py-2 border border-zinc-700 rounded-xl hover:bg-zinc-800">
            Export All Data
          </button>
        </div>
      </div>
    </div>
  );
}