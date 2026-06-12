'use client';

import { useState } from 'react';
import Editor from '@monaco-editor/react';

export default function LaTeXEditor() {
  const [content, setContent] = useState(`\\documentclass{article}
\\usepackage{amsmath}
\\title{Aether: Unified Research Platform}
\\author{Research Team}

\\begin{document}
\\maketitle

\\section{Introduction}
This is a live collaborative LaTeX editor powered by Aether.

\\section{Features}
\\begin{itemize}
    \\item Real-time collaboration
    \\item Pandoc export
    \\item AI-assisted writing
\\end{itemize}

\\end{document}`);

  const [compiled, setCompiled] = useState("PDF preview will appear here after compilation.");

  const compile = () => {
    setCompiled("✓ Compiled successfully.\n\n[Simulated PDF output from Pandoc + LaTeX]");
  };

  return (
    <div className="h-screen flex flex-col">
      <div className="border-b border-zinc-800 p-4 flex items-center justify-between bg-zinc-950">
        <div>
          <h2 className="font-semibold">LaTeX Editor</h2>
          <p className="text-xs text-zinc-500">Real-time collaboration • Pandoc export • AI assistance</p>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={compile}
            className="px-5 py-2 bg-zinc-800 hover:bg-zinc-700 rounded-lg text-sm font-medium transition-colors"
          >
            Compile PDF
          </button>
          <button className="px-5 py-2 bg-white text-black rounded-lg text-sm font-medium hover:bg-zinc-200">
            Export
          </button>
        </div>
      </div>
      
      <div className="flex flex-1 overflow-hidden">
        {/* Editor */}
        <div className="w-1/2 border-r border-zinc-800">
          <Editor
            height="100%"
            defaultLanguage="latex"
            value={content}
            onChange={(value) => setContent(value || '')}
            theme="vs-dark"
            options={{
              fontSize: 14,
              minimap: { enabled: false },
              wordWrap: "on",
              lineNumbers: "on",
            }}
          />
        </div>

        {/* Preview */}
        <div className="w-1/2 p-8 bg-zinc-950 overflow-auto font-mono text-sm">
          <div className="text-emerald-400 mb-4 text-xs tracking-widest">COMPILED OUTPUT</div>
          <pre className="whitespace-pre-wrap text-zinc-300">{compiled}</pre>
        </div>
      </div>
    </div>
  );
}