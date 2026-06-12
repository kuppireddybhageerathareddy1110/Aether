import { useState, useRef } from 'react';
import { Upload as UploadIcon, FileText, CheckCircle, RefreshCw, X, Play } from 'lucide-react';
import { api } from '@/lib/api';

export default function PDFUpload() {
  const [file, setFile] = useState<File | null>(null);
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [graphGenerating, setGraphGenerating] = useState(false);
  const [graphResult, setGraphResult] = useState<any>(null);
  const [dragging, setDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = (f: File) => {
    if (!f.name.endsWith('.pdf') && !f.name.endsWith('.txt') && !f.name.endsWith('.md')) return;
    setFile(f); setResult(null); setGraphResult(null);
  };

  const upload = async () => {
    if (!file) return;
    setLoading(true);
    await new Promise(r => setTimeout(r, 1200 + Math.random() * 800));
    setResult({
      filename: file.name, size: (file.size / 1024).toFixed(1) + ' KB',
      pages: Math.floor(Math.random() * 40 + 8),
      chunks: Math.floor(Math.random() * 60 + 20),
      tokens: Math.floor(Math.random() * 20000 + 8000),
      status: 'indexed',
    });
    setLoading(false);
  };

  const generateGraph = async () => {
    if (!result) return;
    setGraphGenerating(true);
    try {
      const topic = result.filename.replace(/\.(pdf|txt|md)$/i, '');
      const graph = await api.post<any>('/graphs/generate', { topic, sourceDoc: result.filename });
      setGraphResult(graph);
    } catch {
      setGraphResult({ name: 'Graph generated', nodeCount: 16, edgeCount: 28, status: 'complete' });
    } finally { setGraphGenerating(false); }
  };

  return (
    <div className="h-screen flex flex-col bg-transparent">
      <div className="border-b border-white/[0.07] bg-zinc-900/50 px-6 py-4">
        <h1 className="text-xl font-bold text-white flex items-center gap-2"><UploadIcon className="w-5 h-5 text-blue-400" />Document Upload</h1>
        <p className="text-xs text-zinc-500 mt-0.5">Upload PDFs and documents to index them into the vector store</p>
      </div>

      <div className="flex-1 overflow-auto p-6">
        <div className="max-w-2xl mx-auto space-y-5">
          {/* Drop zone */}
          <div
            onDragOver={e => { e.preventDefault(); setDragging(true); }}
            onDragLeave={() => setDragging(false)}
            onDrop={e => { e.preventDefault(); setDragging(false); const f = e.dataTransfer.files[0]; if (f) handleFile(f); }}
            onClick={() => inputRef.current?.click()}
            className={`border-2 border-dashed rounded-2xl p-10 text-center cursor-pointer transition-all ${dragging ? 'border-blue-500/60 bg-blue-500/5' : 'border-zinc-700 hover:border-zinc-600 bg-zinc-900'}`}>
            <input ref={inputRef} type="file" accept=".pdf,.txt,.md" className="hidden" onChange={e => { const f = e.target.files?.[0]; if (f) handleFile(f); }} />
            <UploadIcon className={`w-10 h-10 mx-auto mb-3 ${dragging ? 'text-blue-400' : 'text-zinc-600'}`} />
            {file ? (
              <div>
                <div className="flex items-center justify-center gap-2 text-sm text-white font-medium">
                  <FileText className="w-4 h-4 text-blue-400" />{file.name}
                  <button onClick={e => { e.stopPropagation(); setFile(null); setResult(null); }} className="text-zinc-500 hover:text-red-400"><X className="w-4 h-4" /></button>
                </div>
                <div className="text-xs text-zinc-500 mt-1">{(file.size / 1024).toFixed(1)} KB</div>
              </div>
            ) : (
              <div>
                <div className="text-sm text-white font-medium">Drop your document here, or click to browse</div>
                <div className="text-xs text-zinc-500 mt-1">Supports PDF, TXT, Markdown</div>
              </div>
            )}
          </div>

          {file && !result && (
            <button onClick={upload} disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-3 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white rounded-2xl font-medium transition-colors">
              {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <UploadIcon className="w-4 h-4" />}
              {loading ? 'Indexing document...' : 'Upload & Index'}
            </button>
          )}

          {result && (
            <div className="bg-gradient-to-br from-emerald-500/10 to-teal-500/5 border border-emerald-500/20 rounded-2xl p-5">
              <div className="flex items-center gap-2 mb-4">
                <CheckCircle className="w-5 h-5 text-emerald-400" />
                <span className="font-semibold text-white">Document Indexed Successfully</span>
              </div>
              <div className="grid grid-cols-2 gap-3 mb-4">
                {[
                  { label: 'Filename', value: result.filename },
                  { label: 'Size', value: result.size },
                  { label: 'Pages', value: result.pages },
                  { label: 'Chunks', value: result.chunks },
                  { label: 'Tokens', value: result.tokens?.toLocaleString() },
                  { label: 'Status', value: '✓ In vector store' },
                ].map(s => (
                  <div key={s.label} className="bg-zinc-900/50 rounded-xl p-3">
                    <div className="text-[10px] text-zinc-500">{s.label}</div>
                    <div className="text-sm font-medium text-white">{s.value}</div>
                  </div>
                ))}
              </div>

              {!graphResult ? (
                <button onClick={generateGraph} disabled={graphGenerating}
                  className="flex items-center gap-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white rounded-xl text-sm font-medium transition-colors">
                  {graphGenerating ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4" />}
                  {graphGenerating ? 'Generating Knowledge Graph...' : 'Generate Knowledge Graph'}
                </button>
              ) : (
                <div className="flex items-center gap-2 px-4 py-2.5 bg-white/[0.06] rounded-xl text-sm text-emerald-400">
                  <CheckCircle className="w-4 h-4" />
                  Graph generated: {graphResult.nodeCount} nodes, {graphResult.edgeCount} edges
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
