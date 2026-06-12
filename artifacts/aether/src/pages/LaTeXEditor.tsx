import { useState } from 'react';
// @ts-ignore
import MonacoEditor from '@monaco-editor/react';
import { Play, Download, Code2, BookOpen, Table2, ImageIcon, Hash, List, ChevronDown, CheckCircle, AlertTriangle, X } from 'lucide-react';

const snippets = [
  { label: 'Equation', icon: Hash, code: '\\begin{equation}\n  f(x) = \\sum_{i=0}^{n} a_i x^i\n\\end{equation}' },
  { label: 'Table', icon: Table2, code: '\\begin{table}[h]\n\\centering\n\\begin{tabular}{|c|c|c|}\n\\hline\nCol1 & Col2 & Col3 \\\\\n\\hline\na & b & c \\\\\n\\hline\n\\end{tabular}\n\\caption{Table caption}\n\\end{table}' },
  { label: 'Figure', icon: ImageIcon, code: '\\begin{figure}[h]\n\\centering\n\\includegraphics[width=0.8\\textwidth]{figure}\n\\caption{Figure caption}\n\\label{fig:label}\n\\end{figure}' },
  { label: 'Algorithm', icon: Code2, code: '\\begin{algorithm}\n\\caption{Algorithm name}\n\\begin{algorithmic}[1]\n\\State Initialize $x = 0$\n\\For{$i = 1$ to $n$}\n  \\State Update $x$\n\\EndFor\n\\end{algorithmic}\n\\end{algorithm}' },
  { label: 'Theorem', icon: BookOpen, code: '\\begin{theorem}\n  \\label{thm:main}\n  Statement of the theorem here.\n\\end{theorem}\n\\begin{proof}\n  Proof goes here.\n\\end{proof}' },
  { label: 'List', icon: List, code: '\\begin{itemize}\n  \\item First item\n  \\item Second item\n  \\item Third item\n\\end{itemize}' },
];

const defaultDoc = `\\documentclass[12pt]{article}
\\usepackage{amsmath, amssymb, graphicx, booktabs}
\\usepackage[margin=1in]{geometry}
\\usepackage{hyperref}

\\title{\\textbf{Aether: Unified Research Platform}\\\\
  \\large Integrating Mood, Graph Intelligence, and XAI}
\\author{K. Kuppireddy\\\\
  \\textit{Aether Research Labs}}
\\date{\\today}

\\begin{document}

\\maketitle

\\begin{abstract}
  This paper presents Aether, a benchmark AI-native platform that unifies
  knowledge graph intelligence, explainable AI, mood-aware journaling, and
  collaborative research authoring. Aether achieves state-of-the-art
  performance across seven integrated research modules.
\\end{abstract}

\\section{Introduction}
Aether integrates seven repositories into a cohesive research platform.
The system combines graph attention networks (GAT), RAG-based retrieval,
explainability methods, and mood analytics.

\\section{Methodology}
\\begin{equation}
  \\text{Centrality}(v) = \\sum_{s \\neq v \\neq t} \\frac{\\sigma_{st}(v)}{\\sigma_{st}}
\\end{equation}

Our mood-conditioned GAT architecture uses the following attention mechanism:
\\begin{equation}
  \\alpha_{ij} = \\frac{\\exp(\\text{LeakyReLU}(\\mathbf{a}^T [\\mathbf{W}h_i \\| \\mathbf{W}h_j]))}
  {\\sum_{k \\in \\mathcal{N}(i)} \\exp(\\text{LeakyReLU}(\\mathbf{a}^T [\\mathbf{W}h_i \\| \\mathbf{W}h_k]))}
\\end{equation}

\\section{Results}
Table~\\ref{tab:results} shows the performance comparison.

\\begin{table}[h]
\\centering
\\begin{tabular}{lccc}
\\toprule
\\textbf{Model} & \\textbf{Accuracy} & \\textbf{F1} & \\textbf{AUC} \\\\
\\midrule
GAT Baseline & 0.812 & 0.798 & 0.841 \\\\
Aether-GAT & \\textbf{0.943} & \\textbf{0.931} & \\textbf{0.967} \\\\
\\bottomrule
\\end{tabular}
\\caption{Performance comparison on benchmark datasets.}
\\label{tab:results}
\\end{table}

\\section{Conclusion}
Aether demonstrates a 31\\% improvement over baselines, confirming the
value of mood-conditioned graph intelligence for research productivity.

\\bibliographystyle{ieeetr}
\\bibliography{references}

\\end{document}`;

const compilerLog = [
  { type: 'info', msg: 'This is pdfTeX, Version 3.141592653-2.6-1.40.26 (TeX Live 2024)' },
  { type: 'success', msg: 'LaTeX2e <2024-11-01>' },
  { type: 'success', msg: 'Document class: article 2024/02/08 v1.4n Standard LaTeX document class' },
  { type: 'warning', msg: 'Package hyperref Warning: No driver specified' },
  { type: 'success', msg: 'LaTeX Font Info: External font `cmex10\' loaded for size' },
  { type: 'success', msg: '[1] [2] [3]' },
  { type: 'success', msg: '(./main.aux)' },
  { type: 'success', msg: 'Output written on main.pdf (3 pages, 87432 bytes).' },
];

export default function LaTeXEditorPage() {
  const [content, setContent] = useState(defaultDoc);
  const [compiled, setCompiled] = useState(false);
  const [compiling, setCompiling] = useState(false);
  const [logOpen, setLogOpen] = useState(false);
  const [insertSnippet, setInsertSnippet] = useState<string | null>(null);

  const compile = () => {
    setCompiling(true);
    setTimeout(() => {
      setCompiling(false);
      setCompiled(true);
      setLogOpen(true);
    }, 1800);
  };

  return (
    <div className="h-screen flex flex-col bg-zinc-950">
      {/* Toolbar */}
      <div className="border-b border-zinc-800 bg-zinc-900 px-4 py-2.5 flex items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <Code2 className="w-5 h-5 text-blue-400" />
          <span className="text-sm font-semibold text-white">LaTeX Studio</span>
          <span className="text-xs text-zinc-500">main.tex</span>
        </div>

        {/* Snippet toolbar */}
        <div className="flex items-center gap-1">
          {snippets.map(s => (
            <button
              key={s.label}
              title={`Insert ${s.label}`}
              onClick={() => setContent(prev => prev + '\n\n' + s.code)}
              className="flex items-center gap-1 px-2.5 py-1 rounded-md text-xs text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
            >
              <s.icon className="w-3.5 h-3.5" />{s.label}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <button onClick={compile} disabled={compiling}
            className="flex items-center gap-1.5 px-4 py-1.5 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white rounded-lg text-xs font-medium transition-colors">
            <Play className={`w-3.5 h-3.5 ${compiling ? 'animate-spin' : ''}`} />
            {compiling ? 'Compiling...' : 'Compile PDF'}
          </button>
          <button className="flex items-center gap-1.5 px-4 py-1.5 bg-zinc-700 hover:bg-zinc-600 text-white rounded-lg text-xs font-medium transition-colors">
            <Download className="w-3.5 h-3.5" />Export
          </button>
        </div>
      </div>

      {/* Editor + Preview */}
      <div className="flex flex-1 overflow-hidden">
        {/* Editor pane */}
        <div className="w-1/2 border-r border-zinc-800 flex flex-col">
          <div className="px-3 py-1.5 bg-zinc-900 border-b border-zinc-800 text-[10px] text-zinc-500">EDITOR</div>
          <div className="flex-1">
            <MonacoEditor
              height="100%"
              defaultLanguage="latex"
              value={content}
              onChange={(v: string | undefined) => setContent(v || '')}
              theme="vs-dark"
              options={{ fontSize: 13, minimap: { enabled: false }, wordWrap: 'on', lineNumbers: 'on', scrollBeyondLastLine: false }}
            />
          </div>
        </div>

        {/* Preview pane */}
        <div className="w-1/2 flex flex-col overflow-hidden">
          <div className="px-3 py-1.5 bg-zinc-900 border-b border-zinc-800 text-[10px] text-zinc-500 flex items-center justify-between">
            <span>PDF PREVIEW</span>
            {compiled && <span className="text-emerald-400 flex items-center gap-1"><CheckCircle className="w-3 h-3" />Compiled</span>}
          </div>
          <div className="flex-1 bg-white overflow-auto p-8">
            {compiled ? (
              <div className="max-w-2xl mx-auto font-serif text-gray-900 text-sm leading-relaxed">
                <div className="text-center mb-8">
                  <h1 className="text-2xl font-bold mb-1">Aether: Unified Research Platform</h1>
                  <p className="text-lg italic text-gray-600">Integrating Mood, Graph Intelligence, and XAI</p>
                  <p className="mt-2 text-sm">K. Kuppireddy <span className="italic">· Aether Research Labs</span></p>
                </div>
                <div className="border border-gray-200 p-4 mb-6 rounded">
                  <h2 className="font-bold text-sm mb-2">Abstract</h2>
                  <p className="text-sm text-gray-700">This paper presents Aether, a benchmark AI-native platform that unifies knowledge graph intelligence, explainable AI, mood-aware journaling, and collaborative research authoring. Aether achieves state-of-the-art performance across seven integrated research modules.</p>
                </div>
                <h2 className="text-lg font-bold mb-2">1. Introduction</h2>
                <p className="mb-4 text-sm">Aether integrates seven repositories into a cohesive research platform. The system combines graph attention networks (GAT), RAG-based retrieval, explainability methods, and mood analytics.</p>
                <h2 className="text-lg font-bold mb-2">2. Methodology</h2>
                <div className="bg-gray-50 border border-gray-100 p-4 my-4 rounded font-mono text-sm text-center">
                  α_ij = softmax(LeakyReLU(a^T [Wh_i ‖ Wh_j]))
                </div>
                <h2 className="text-lg font-bold mb-2">3. Results</h2>
                <table className="w-full border-collapse text-sm mb-4">
                  <thead><tr className="border-b-2 border-gray-900"><th className="text-left py-1 pr-4">Model</th><th className="py-1 pr-4">Accuracy</th><th className="py-1 pr-4">F1</th><th className="py-1">AUC</th></tr></thead>
                  <tbody>
                    <tr className="border-b border-gray-300"><td className="py-1 pr-4">GAT Baseline</td><td className="text-center py-1 pr-4">0.812</td><td className="text-center py-1 pr-4">0.798</td><td className="text-center py-1">0.841</td></tr>
                    <tr><td className="py-1 pr-4 font-bold">Aether-GAT</td><td className="text-center py-1 pr-4 font-bold">0.943</td><td className="text-center py-1 pr-4 font-bold">0.931</td><td className="text-center py-1 font-bold">0.967</td></tr>
                  </tbody>
                </table>
                <h2 className="text-lg font-bold mb-2">4. Conclusion</h2>
                <p className="text-sm">Aether demonstrates a 31% improvement over baselines, confirming the value of mood-conditioned graph intelligence for research productivity.</p>
              </div>
            ) : (
              <div className="flex items-center justify-center h-full text-gray-400 text-sm">
                Click <strong className="mx-1 text-blue-500">Compile PDF</strong> to render preview
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Compiler log */}
      {logOpen && (
        <div className="border-t border-zinc-800 bg-zinc-900 max-h-40 overflow-auto">
          <div className="flex items-center justify-between px-4 py-1.5 border-b border-zinc-800">
            <span className="text-[10px] font-semibold text-zinc-400 uppercase tracking-widest">Compiler Log</span>
            <button onClick={() => setLogOpen(false)}><X className="w-3.5 h-3.5 text-zinc-500" /></button>
          </div>
          <div className="p-3 font-mono text-[10px] space-y-0.5">
            {compilerLog.map((line, i) => (
              <div key={i} className={`flex items-start gap-2 ${line.type === 'success' ? 'text-zinc-400' : line.type === 'warning' ? 'text-amber-400' : 'text-zinc-500'}`}>
                {line.type === 'warning' && <AlertTriangle className="w-3 h-3 flex-shrink-0 mt-0.5" />}
                {line.type === 'success' && <CheckCircle className="w-3 h-3 flex-shrink-0 mt-0.5 text-emerald-400" />}
                {line.type === 'info' && <span className="w-3 h-3 flex-shrink-0" />}
                <span>{line.msg}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
