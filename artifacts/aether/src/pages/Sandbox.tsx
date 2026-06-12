import { useState } from 'react';

export default function Sandbox() {
  const [code, setCode] = useState('# Try out Aether APIs here\nimport requests\n\n# Analyze a PDF\nresult = requests.post("http://localhost:8000/graph/analyze", json={"pdf_name": "test.pdf"})\nprint(result.json())');
  const [output, setOutput] = useState('');

  const run = () => {
    setOutput('Sandbox execution simulated.\nNote: Connect to the Aether backend to run real API calls.\n\n[Output would appear here]');
  };

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <h1 className="text-5xl font-semibold tracking-tighter mb-2">Developer Sandbox</h1>
      <p className="text-xl text-zinc-400 mb-8">Test Aether APIs interactively</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-zinc-900 border border-zinc-800 rounded-3xl overflow-hidden">
          <div className="flex items-center justify-between p-4 border-b border-zinc-800">
            <div className="text-sm font-medium">Code</div>
            <button onClick={run} className="px-5 py-1.5 bg-white text-black rounded-lg text-xs font-medium">Run</button>
          </div>
          <textarea
            value={code}
            onChange={(e) => setCode(e.target.value)}
            className="w-full h-64 bg-zinc-950 p-6 font-mono text-sm text-zinc-300 resize-none focus:outline-none"
          />
        </div>

        <div className="bg-zinc-900 border border-zinc-800 rounded-3xl overflow-hidden">
          <div className="p-4 border-b border-zinc-800">
            <div className="text-sm font-medium">Output</div>
          </div>
          <div className="p-6 h-64 font-mono text-sm text-zinc-400 overflow-auto">
            {output || 'Output will appear here after running...'}
          </div>
        </div>
      </div>
    </div>
  );
}
