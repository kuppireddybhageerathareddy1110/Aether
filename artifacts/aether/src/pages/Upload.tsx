import { useState, useRef, useEffect } from 'react';
import { Upload as UploadIcon, FileText, CheckCircle, RefreshCw, X, Play, GitBranch, ChevronDown, ChevronRight, Trash2, FileSearch, Layers, Hash, Clock } from 'lucide-react';
import { Link } from 'wouter';

const glassPanel: React.CSSProperties = {
  background: 'rgba(255,255,255,0.04)',
  backdropFilter: 'blur(20px)',
  WebkitBackdropFilter: 'blur(20px)',
  border: '1px solid rgba(255,255,255,0.08)',
};

const glassInput: React.CSSProperties = {
  background: 'rgba(255,255,255,0.04)',
  backdropFilter: 'blur(12px)',
  WebkitBackdropFilter: 'blur(12px)',
  border: '1px solid rgba(255,255,255,0.08)',
  color: 'white',
  outline: 'none',
};

interface UploadResult {
  document: { id: number; filename: string; sizeBytes: number; pageCount: number; chunkCount: number; totalTokens: number; status: string; createdAt: string };
  chunkCount: number;
  totalTokens: number;
  pages: number;
  textPreview: string;
  graph: { id: number; name: string; nodeCount: number; edgeCount: number } | null;
}

interface StoredDoc {
  id: number;
  filename: string;
  originalName: string;
  sizeBytes: number;
  pageCount: number;
  chunkCount: number;
  totalTokens: number;
  status: string;
  createdAt: string;
}

export default function PDFUpload() {
  const [file, setFile] = useState<File | null>(null);
  const [result, setResult] = useState<UploadResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [progressLabel, setProgressLabel] = useState('');
  const [dragging, setDragging] = useState(false);
  const [error, setError] = useState('');
  const [docs, setDocs] = useState<StoredDoc[]>([]);
  const [loadingDocs, setLoadingDocs] = useState(true);
  const [expandedDoc, setExpandedDoc] = useState<number | null>(null);
  const [chunks, setChunks] = useState<Record<number, any[]>>({});
  const [loadingChunks, setLoadingChunks] = useState<number | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [autoGraph, setAutoGraph] = useState(true);
  const inputRef = useRef<HTMLInputElement>(null);

  const BASE = import.meta.env.BASE_URL?.replace(/\/$/, '') || '';

  const loadDocs = async () => {
    setLoadingDocs(true);
    try {
      const r = await fetch(`${BASE}/api/upload/documents`);
      if (r.ok) setDocs(await r.json());
    } catch { } finally { setLoadingDocs(false); }
  };

  useEffect(() => { loadDocs(); }, []);

  const handleFile = (f: File) => {
    if (!f.name.match(/\.(pdf|txt|md)$/i)) { setError('Only PDF, TXT, and Markdown files are supported.'); return; }
    setFile(f); setResult(null); setError('');
  };

  const upload = async () => {
    if (!file) return;
    setLoading(true);
    setProgress(0);
    setError('');

    const steps = [
      { pct: 15, label: 'Reading file...' },
      { pct: 40, label: 'Extracting text...' },
      { pct: 65, label: 'Chunking & tokenizing...' },
      { pct: 85, label: 'Indexing into vector store...' },
      { pct: autoGraph ? 92 : 100, label: autoGraph ? 'Building knowledge graph...' : 'Storing to database...' },
    ];
    if (autoGraph) steps.push({ pct: 100, label: 'All done!' });

    let stepIdx = 0;
    const tick = setInterval(() => {
      if (stepIdx < steps.length) {
        setProgress(steps[stepIdx].pct);
        setProgressLabel(steps[stepIdx].label);
        stepIdx++;
      }
    }, 600);

    try {
      const form = new FormData();
      form.append('file', file);
      form.append('autoGraph', String(autoGraph));

      const res = await fetch(`${BASE}/api/upload`, { method: 'POST', body: form });
      clearInterval(tick);

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error ?? `Upload failed (${res.status})`);
      }

      setProgress(100);
      setProgressLabel('Complete!');
      const data: UploadResult = await res.json();
      setResult(data);
      await loadDocs();
    } catch (e: any) {
      clearInterval(tick);
      setError(e.message ?? 'Upload failed');
      setProgress(0);
      setProgressLabel('');
    } finally {
      setLoading(false);
    }
  };

  const loadChunks = async (docId: number) => {
    if (chunks[docId]) { setExpandedDoc(expandedDoc === docId ? null : docId); return; }
    setLoadingChunks(docId);
    setExpandedDoc(expandedDoc === docId ? null : docId);
    try {
      const r = await fetch(`${BASE}/api/upload/documents/${docId}/chunks`);
      if (r.ok) { const data = await r.json(); setChunks(prev => ({ ...prev, [docId]: data })); }
    } catch { } finally { setLoadingChunks(null); }
  };

  const deleteDoc = async (docId: number) => {
    setDeletingId(docId);
    try {
      await fetch(`${BASE}/api/upload/documents/${docId}`, { method: 'DELETE' });
      setDocs(prev => prev.filter(d => d.id !== docId));
      if (result?.document.id === docId) setResult(null);
    } catch { } finally { setDeletingId(null); }
  };

  const fmtSize = (b: number) => b > 1024 * 1024 ? (b / 1024 / 1024).toFixed(1) + ' MB' : (b / 1024).toFixed(1) + ' KB';
  const fmtDate = (s: string) => new Date(s).toLocaleDateString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });

  return (
    <div className="h-screen flex flex-col" style={{ background: 'transparent' }}>
      {/* Header */}
      <div className="px-6 py-4" style={{ ...glassPanel, borderRadius: 0, borderLeft: 'none', borderRight: 'none', borderTop: 'none' }}>
        <h1 className="text-xl font-bold text-white flex items-center gap-2.5">
          <UploadIcon className="w-5 h-5" style={{ color: '#60a5fa' }} />
          Document Upload
        </h1>
        <p className="text-xs mt-0.5" style={{ color: 'rgba(255,255,255,0.35)' }}>
          Upload PDFs and documents — text is extracted, chunked, and indexed into the vector store
        </p>
      </div>

      <div className="flex-1 overflow-auto p-6">
        <div className="max-w-3xl mx-auto space-y-5">

          {/* Drop zone */}
          <div
            onDragOver={e => { e.preventDefault(); setDragging(true); }}
            onDragLeave={() => setDragging(false)}
            onDrop={e => { e.preventDefault(); setDragging(false); const f = e.dataTransfer.files[0]; if (f) handleFile(f); }}
            onClick={() => !file && inputRef.current?.click()}
            className="border-2 border-dashed rounded-2xl p-10 text-center cursor-pointer transition-all"
            style={{
              borderColor: dragging ? 'rgba(96,165,250,0.6)' : file ? 'rgba(52,211,153,0.4)' : 'rgba(255,255,255,0.12)',
              background: dragging ? 'rgba(96,165,250,0.06)' : file ? 'rgba(52,211,153,0.04)' : 'rgba(255,255,255,0.025)',
            }}>
            <input ref={inputRef} type="file" accept=".pdf,.txt,.md" className="hidden"
              onChange={e => { const f = e.target.files?.[0]; if (f) handleFile(f); }} />
            <div className="w-14 h-14 mx-auto mb-4 rounded-2xl flex items-center justify-center"
              style={{ background: file ? 'rgba(52,211,153,0.12)' : 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}>
              {file
                ? <FileText className="w-7 h-7" style={{ color: '#34d399' }} />
                : <UploadIcon className="w-7 h-7" style={{ color: 'rgba(255,255,255,0.25)' }} />
              }
            </div>
            {file ? (
              <div>
                <div className="flex items-center justify-center gap-2 text-sm font-medium text-white">
                  {file.name}
                  <button onClick={e => { e.stopPropagation(); setFile(null); setResult(null); setError(''); }}
                    className="ml-1 rounded-full p-0.5 transition-colors"
                    style={{ color: 'rgba(255,255,255,0.3)' }}
                    onMouseEnter={e => (e.currentTarget.style.color = '#f87171')}
                    onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.3)')}>
                    <X className="w-4 h-4" />
                  </button>
                </div>
                <div className="text-xs mt-1" style={{ color: 'rgba(255,255,255,0.35)' }}>{fmtSize(file.size)}</div>
              </div>
            ) : (
              <div>
                <div className="text-sm font-medium text-white">Drop your document here, or click to browse</div>
                <div className="text-xs mt-1" style={{ color: 'rgba(255,255,255,0.3)' }}>Supports PDF, TXT, Markdown · Max 20 MB</div>
              </div>
            )}
          </div>

          {/* Options */}
          {file && !result && (
            <div className="flex items-center justify-between rounded-xl px-4 py-3" style={glassPanel}>
              <label className="flex items-center gap-2.5 cursor-pointer select-none">
                <input type="checkbox" checked={autoGraph} onChange={e => setAutoGraph(e.target.checked)}
                  className="w-4 h-4 accent-emerald-400 rounded" />
                <GitBranch className="w-3.5 h-3.5" style={{ color: '#34d399' }} />
                <span className="text-sm text-white">Auto-generate Knowledge Graph from document</span>
              </label>
            </div>
          )}

          {/* Progress bar */}
          {loading && (
            <div className="rounded-2xl p-4" style={glassPanel}>
              <div className="flex items-center justify-between text-xs mb-2">
                <span className="text-white font-medium">{progressLabel}</span>
                <span style={{ color: '#60a5fa' }}>{progress}%</span>
              </div>
              <div className="h-2 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.06)' }}>
                <div className="h-full rounded-full transition-all duration-500"
                  style={{ width: `${progress}%`, background: 'linear-gradient(90deg, #3b82f6, #60a5fa)', boxShadow: '0 0 8px rgba(96,165,250,0.5)' }} />
              </div>
              <div className="flex items-center gap-1.5 mt-2 text-xs" style={{ color: 'rgba(255,255,255,0.35)' }}>
                <RefreshCw className="w-3 h-3 animate-spin" />
                Processing {file?.name}…
              </div>
            </div>
          )}

          {/* Upload button */}
          {file && !result && !loading && (
            <button onClick={upload}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-2xl font-medium text-sm text-white transition-all"
              style={{ background: 'linear-gradient(135deg, #2563eb, #3b82f6)', boxShadow: '0 0 20px rgba(59,130,246,0.3)' }}
              onMouseEnter={e => (e.currentTarget.style.boxShadow = '0 0 30px rgba(59,130,246,0.5)')}
              onMouseLeave={e => (e.currentTarget.style.boxShadow = '0 0 20px rgba(59,130,246,0.3)')}>
              <UploadIcon className="w-4 h-4" />Upload & Index Document
            </button>
          )}

          {/* Error */}
          {error && (
            <div className="rounded-xl px-4 py-3 text-sm" style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.25)', color: '#fca5a5' }}>
              {error}
            </div>
          )}

          {/* Success result */}
          {result && (
            <div className="rounded-2xl p-5 space-y-4" style={{
              background: 'linear-gradient(135deg, rgba(52,211,153,0.08), rgba(13,148,136,0.04))',
              backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)',
              border: '1px solid rgba(52,211,153,0.2)',
              boxShadow: '0 0 24px rgba(52,211,153,0.06)',
            }}>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 flex-shrink-0" style={{ color: '#34d399' }} />
                <span className="font-semibold text-white">Document indexed successfully</span>
              </div>

              <div className="grid grid-cols-3 gap-3">
                {[
                  { icon: FileSearch, label: 'Chunks', value: result.chunkCount, color: '#60a5fa' },
                  { icon: Hash, label: 'Tokens', value: result.totalTokens.toLocaleString(), color: '#a78bfa' },
                  { icon: Layers, label: 'Pages', value: result.pages, color: '#34d399' },
                ].map(s => (
                  <div key={s.label} className="rounded-xl p-3 text-center" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.07)' }}>
                    <s.icon className="w-4 h-4 mx-auto mb-1" style={{ color: s.color }} />
                    <div className="text-lg font-bold text-white">{s.value}</div>
                    <div className="text-[10px]" style={{ color: 'rgba(255,255,255,0.4)' }}>{s.label}</div>
                  </div>
                ))}
              </div>

              {/* Text preview */}
              {result.textPreview && (
                <div>
                  <div className="text-[10px] font-semibold uppercase tracking-widest mb-2" style={{ color: 'rgba(255,255,255,0.35)' }}>Extracted Text Preview</div>
                  <div className="rounded-xl p-3 text-xs font-mono leading-relaxed"
                    style={{ background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.07)', color: 'rgba(255,255,255,0.6)', maxHeight: 120, overflow: 'hidden' }}>
                    {result.textPreview}…
                  </div>
                </div>
              )}

              {/* Knowledge graph result */}
              {result.graph ? (
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm" style={{ color: '#34d399' }}>
                    <GitBranch className="w-4 h-4" />
                    Knowledge graph generated — {result.graph.nodeCount} nodes, {result.graph.edgeCount} edges
                  </div>
                  <Link href="/knowledge-graph"
                    className="text-xs px-3 py-1.5 rounded-lg transition-all"
                    style={{ background: 'rgba(52,211,153,0.12)', border: '1px solid rgba(52,211,153,0.25)', color: '#34d399' }}>
                    View Graph →
                  </Link>
                </div>
              ) : (
                <div className="flex items-center gap-2 text-xs" style={{ color: 'rgba(255,255,255,0.35)' }}>
                  <GitBranch className="w-3.5 h-3.5" />
                  Auto-graph was disabled — you can generate it from Knowledge Graph
                </div>
              )}

              <button onClick={() => { setFile(null); setResult(null); }}
                className="w-full py-2.5 rounded-xl text-sm font-medium text-white transition-all"
                style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.1)' }}
                onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.12)')}
                onMouseLeave={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.07)')}>
                Upload Another Document
              </button>
            </div>
          )}

          {/* Document library */}
          <div>
            <div className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: 'rgba(255,255,255,0.3)' }}>
              Document Library · {docs.length} indexed
            </div>
            <div className="rounded-2xl overflow-hidden" style={glassPanel}>
              {loadingDocs ? (
                <div className="p-6 text-center text-sm" style={{ color: 'rgba(255,255,255,0.25)' }}>
                  <RefreshCw className="w-4 h-4 animate-spin mx-auto mb-2" />Loading documents…
                </div>
              ) : docs.length === 0 ? (
                <div className="p-8 text-center" style={{ color: 'rgba(255,255,255,0.2)' }}>
                  <UploadIcon className="w-8 h-8 mx-auto mb-2 opacity-40" />
                  <div className="text-sm">No documents yet — upload your first PDF above</div>
                </div>
              ) : (
                docs.map((doc, i) => (
                  <div key={doc.id}>
                    <div className={`flex items-center gap-3 px-4 py-3 transition-all`}
                      style={{ borderBottom: i < docs.length - 1 || expandedDoc === doc.id ? '1px solid rgba(255,255,255,0.05)' : 'none' }}
                      onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.03)')}
                      onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}>
                      <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                        style={{ background: 'rgba(96,165,250,0.1)', border: '1px solid rgba(96,165,250,0.2)' }}>
                        <FileText className="w-4 h-4" style={{ color: '#60a5fa' }} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-medium text-white truncate">{doc.originalName}</div>
                        <div className="flex items-center gap-3 mt-0.5 text-[10px]" style={{ color: 'rgba(255,255,255,0.3)' }}>
                          <span>{fmtSize(doc.sizeBytes)}</span>
                          <span>{doc.chunkCount} chunks</span>
                          <span>~{doc.totalTokens.toLocaleString()} tokens</span>
                          <span className="flex items-center gap-0.5"><Clock className="w-2.5 h-2.5" />{fmtDate(doc.createdAt)}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-1 flex-shrink-0">
                        <span className="text-[9px] px-2 py-0.5 rounded-full font-medium"
                          style={{ background: 'rgba(52,211,153,0.12)', color: '#34d399', border: '1px solid rgba(52,211,153,0.2)' }}>
                          {doc.status}
                        </span>
                        <button onClick={() => loadChunks(doc.id)}
                          className="p-1.5 rounded-lg transition-all"
                          style={{ color: 'rgba(255,255,255,0.3)' }}
                          onMouseEnter={e => (e.currentTarget.style.color = 'white')}
                          onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.3)')}>
                          {loadingChunks === doc.id
                            ? <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                            : expandedDoc === doc.id
                              ? <ChevronDown className="w-3.5 h-3.5" />
                              : <ChevronRight className="w-3.5 h-3.5" />
                          }
                        </button>
                        <button onClick={() => deleteDoc(doc.id)} disabled={deletingId === doc.id}
                          className="p-1.5 rounded-lg transition-all"
                          style={{ color: 'rgba(255,255,255,0.25)' }}
                          onMouseEnter={e => (e.currentTarget.style.color = '#f87171')}
                          onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.25)')}>
                          {deletingId === doc.id ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Trash2 className="w-3.5 h-3.5" />}
                        </button>
                      </div>
                    </div>

                    {/* Chunks panel */}
                    {expandedDoc === doc.id && (
                      <div className="px-4 pb-3 pt-2" style={{ background: 'rgba(0,0,0,0.2)', borderBottom: i < docs.length - 1 ? '1px solid rgba(255,255,255,0.05)' : 'none' }}>
                        <div className="text-[10px] font-semibold uppercase tracking-widest mb-2" style={{ color: 'rgba(255,255,255,0.25)' }}>
                          {chunks[doc.id]?.length ?? '…'} Indexed Chunks
                        </div>
                        <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                          {(chunks[doc.id] ?? []).map((chunk) => (
                            <div key={chunk.id} className="rounded-lg p-3" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
                              <div className="flex items-center gap-2 mb-1">
                                <span className="text-[9px] font-bold px-1.5 py-0.5 rounded"
                                  style={{ background: 'rgba(96,165,250,0.12)', color: '#60a5fa' }}>
                                  #{chunk.chunkIndex + 1}
                                </span>
                                <span className="text-[9px]" style={{ color: 'rgba(255,255,255,0.25)' }}>~{chunk.tokenCount} tokens</span>
                              </div>
                              <div className="text-xs leading-relaxed" style={{ color: 'rgba(255,255,255,0.5)' }}>
                                {chunk.content.slice(0, 200)}{chunk.content.length > 200 ? '…' : ''}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
