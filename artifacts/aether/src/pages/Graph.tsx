import { useState, useEffect, useRef, useCallback } from 'react';
import { GitBranch, Play, Trash2, RefreshCw, ZoomIn, ZoomOut, Maximize2, Tag, Download, MessageCircle, ChevronRight, X } from 'lucide-react';
import { api } from '@/lib/api';
import { useLocation } from 'wouter';

interface RawNode { id: string; label: string; x: number; y: number; size: number; }
interface RawEdge { id: string; source: string; target: string; weight?: number; label?: string; }
interface GraphRecord { id: number; name: string; sourceDoc: string; nodeCount: number; edgeCount: number; nodes: RawNode[]; edges: RawEdge[]; status: string; createdAt: string; }

interface SimNode extends RawNode { vx: number; vy: number; fx: number; fy: number; degree: number; colorIdx: number; }

const PALETTES = [
  { fill: '#fbbf24', stroke: '#f59e0b', glow: '#fbbf2466' },  // gold — highest degree
  { fill: '#a78bfa', stroke: '#8b5cf6', glow: '#a78bfa55' },  // violet
  { fill: '#60a5fa', stroke: '#3b82f6', glow: '#60a5fa55' },  // blue
  { fill: '#34d399', stroke: '#10b981', glow: '#34d39955' },  // emerald
  { fill: '#f472b6', stroke: '#ec4899', glow: '#f472b655' },  // pink
  { fill: '#2dd4bf', stroke: '#14b8a6', glow: '#2dd4bf55' },  // teal
  { fill: '#fb923c', stroke: '#f97316', glow: '#fb923c55' },  // orange
  { fill: '#818cf8', stroke: '#6366f1', glow: '#818cf855' },  // indigo
];

function buildSimNodes(nodes: RawNode[], edges: RawEdge[]): SimNode[] {
  const deg: Record<string, number> = {};
  for (const e of edges) {
    deg[e.source] = (deg[e.source] ?? 0) + 1;
    deg[e.target] = (deg[e.target] ?? 0) + 1;
  }
  const sorted = [...nodes].sort((a, b) => (deg[b.id] ?? 0) - (deg[a.id] ?? 0));
  const rank: Record<string, number> = {};
  sorted.forEach((n, i) => { rank[n.id] = i; });
  return nodes.map(n => ({
    ...n, vx: 0, vy: 0, fx: 0, fy: 0,
    degree: deg[n.id] ?? 0,
    colorIdx: Math.min(rank[n.id] ?? 0, PALETTES.length - 1),
  }));
}

function runForce(nodes: SimNode[], edges: RawEdge[], W: number, H: number) {
  const area = W * H;
  const k = Math.sqrt(area / Math.max(nodes.length, 1)) * 0.9;
  for (let iter = 0; iter < 400; iter++) {
    const temp = 60 * (1 - iter / 400);
    for (const n of nodes) { n.fx = 0; n.fy = 0; }
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const dx = nodes[j].x - nodes[i].x + 0.01;
        const dy = nodes[j].y - nodes[i].y + 0.01;
        const d = Math.sqrt(dx * dx + dy * dy) + 0.01;
        const f = (k * k) / d;
        nodes[i].fx -= (f * dx) / d;
        nodes[i].fy -= (f * dy) / d;
        nodes[j].fx += (f * dx) / d;
        nodes[j].fy += (f * dy) / d;
      }
    }
    for (const e of edges) {
      const s = nodes.find(n => n.id === e.source);
      const t = nodes.find(n => n.id === e.target);
      if (!s || !t) continue;
      const dx = t.x - s.x;
      const dy = t.y - s.y;
      const d = Math.sqrt(dx * dx + dy * dy) + 0.01;
      const f = (d * d) / k;
      s.fx += (f * dx) / d;
      s.fy += (f * dy) / d;
      t.fx -= (f * dx) / d;
      t.fy -= (f * dy) / d;
    }
    for (const n of nodes) {
      n.fx += (W / 2 - n.x) * 0.03;
      n.fy += (H / 2 - n.y) * 0.03;
      const d = Math.sqrt(n.fx * n.fx + n.fy * n.fy) + 0.01;
      n.x += (n.fx / d) * Math.min(d, temp);
      n.y += (n.fy / d) * Math.min(d, temp);
      n.x = Math.max(40, Math.min(W - 40, n.x));
      n.y = Math.max(40, Math.min(H - 40, n.y));
    }
  }
  return nodes;
}

export default function KnowledgeGraph() {
  const [, setLocation] = useLocation();
  const [topic, setTopic] = useState('');
  const [generating, setGenerating] = useState(false);
  const [graphs, setGraphs] = useState<GraphRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<GraphRecord | null>(null);
  const [simNodes, setSimNodes] = useState<SimNode[]>([]);
  const [error, setError] = useState('');
  const [selectedNode, setSelectedNode] = useState<SimNode | null>(null);
  const [selectedEdge, setSelectedEdge] = useState<RawEdge | null>(null);
  const [showLabels, setShowLabels] = useState(true);
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [dragging, setDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);
  const [hoveredEdge, setHoveredEdge] = useState<string | null>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const W = 900, H = 600;

  const loadGraphs = async () => {
    setLoading(true);
    try { const data = await api.get<GraphRecord[]>('/graphs'); setGraphs(data); }
    catch { } finally { setLoading(false); }
  };

  useEffect(() => { loadGraphs(); }, []);

  const selectGraph = useCallback((g: GraphRecord) => {
    setSelected(g);
    setSelectedNode(null);
    setSelectedEdge(null);
    setZoom(1);
    setPan({ x: 0, y: 0 });
    const nodes = buildSimNodes(g.nodes, g.edges);
    const placed = runForce(nodes, g.edges, W, H);
    setSimNodes(placed);
  }, []);

  const generate = async () => {
    if (!topic.trim()) { setError('Please enter a topic'); return; }
    setGenerating(true); setError('');
    try {
      const graph = await api.post<GraphRecord>('/graphs/generate', { topic, sourceDoc: 'manual' });
      setGraphs(prev => [graph, ...prev]);
      selectGraph(graph);
      setTopic('');
    } catch (e: any) { setError(e.message ?? 'Failed to generate graph'); }
    finally { setGenerating(false); }
  };

  const deleteGraph = async (id: number) => {
    try {
      await api.delete(`/graphs/${id}`);
      setGraphs(prev => prev.filter(g => g.id !== id));
      if (selected?.id === id) { setSelected(null); setSimNodes([]); }
    } catch { }
  };

  const exportGraph = () => {
    if (!selected) return;
    const blob = new Blob([JSON.stringify({ name: selected.name, nodes: selected.nodes, edges: selected.edges }, null, 2)], { type: 'application/json' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `${selected.name.replace(/\s+/g, '_')}.json`;
    a.click();
  };

  const handleWheel = useCallback((e: React.WheelEvent) => {
    e.preventDefault();
    setZoom(z => Math.max(0.3, Math.min(3, z - e.deltaY * 0.001)));
  }, []);

  const handleMouseDown = (e: React.MouseEvent) => {
    if ((e.target as SVGElement).closest('.graph-node')) return;
    setDragging(true);
    setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
  };
  const handleMouseMove = (e: React.MouseEvent) => {
    if (!dragging) return;
    setPan({ x: e.clientX - dragStart.x, y: e.clientY - dragStart.y });
  };
  const handleMouseUp = () => setDragging(false);

  const fitView = () => { setZoom(1); setPan({ x: 0, y: 0 }); };

  const getNeighbors = (nodeId: string) => {
    if (!selected) return [];
    return selected.edges
      .filter(e => e.source === nodeId || e.target === nodeId)
      .map(e => {
        const otherId = e.source === nodeId ? e.target : e.source;
        return simNodes.find(n => n.id === otherId);
      })
      .filter(Boolean) as SimNode[];
  };

  const getEdgesBetween = (nodeId: string) =>
    selected?.edges.filter(e => e.source === nodeId || e.target === nodeId) ?? [];

  return (
    <div className="h-screen flex flex-col bg-transparent">
      <div className="border-b border-white/[0.07] bg-zinc-900/50 px-6 py-4">
        <h1 className="text-xl font-bold text-white flex items-center gap-2">
          <GitBranch className="w-5 h-5 text-emerald-400" />Knowledge Graph
        </h1>
        <p className="text-xs text-zinc-500 mt-0.5">Interactive force-directed knowledge graphs — click nodes to explore</p>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Left panel */}
        <div className="w-64 border-r border-white/[0.07] flex flex-col bg-zinc-900/20 flex-shrink-0">
          <div className="p-4 border-b border-white/[0.07]">
            <div className="text-[10px] font-semibold text-zinc-500 uppercase tracking-widest mb-3">Generate Graph</div>
            <input value={topic} onChange={e => setTopic(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && generate()}
              className="w-full bg-white/[0.04] border border-zinc-700 rounded-xl px-3 py-2 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:border-emerald-500/50 mb-2"
              placeholder="e.g. 'Attention Mechanisms'" />
            {error && <div className="text-[10px] text-red-400 mb-2">{error}</div>}
            <button onClick={generate} disabled={generating || !topic.trim()}
              className="w-full flex items-center justify-center gap-2 py-2 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 text-white rounded-xl text-xs font-medium transition-colors">
              {generating ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Play className="w-3.5 h-3.5" />}
              {generating ? 'Generating…' : 'Generate Graph'}
            </button>
          </div>

          <div className="flex-1 overflow-auto p-3">
            <div className="flex items-center justify-between mb-2">
              <div className="text-[10px] text-zinc-500">{graphs.length} graph{graphs.length !== 1 ? 's' : ''}</div>
              <button onClick={loadGraphs} className="text-zinc-600 hover:text-zinc-400">
                <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
              </button>
            </div>
            {loading ? (
              <div className="space-y-2">
                {[1,2,3].map(i => <div key={i} className="h-14 rounded-xl bg-zinc-800/50 animate-pulse" />)}
              </div>
            ) : graphs.length === 0 ? (
              <div className="text-center py-8 text-zinc-600 text-[11px]">No graphs yet</div>
            ) : graphs.map(g => (
              <div key={g.id}
                className={`p-3 rounded-xl mb-2 cursor-pointer transition-all border ${selected?.id === g.id ? 'border-emerald-500/40 bg-emerald-500/5' : 'border-white/[0.05] hover:border-zinc-700 bg-zinc-900/40'}`}
                onClick={() => selectGraph(g)}>
                <div className="flex items-start justify-between gap-1">
                  <div className="flex-1 min-w-0">
                    <div className="text-[11px] font-semibold text-white truncate">{g.name}</div>
                    <div className="text-[10px] text-zinc-500 mt-0.5">{g.nodeCount} nodes · {g.edgeCount} edges</div>
                    <div className="text-[9px] text-zinc-600 mt-0.5">{new Date(g.createdAt).toLocaleDateString()}</div>
                  </div>
                  <button onClick={e => { e.stopPropagation(); deleteGraph(g.id); }}
                    className="p-1 text-zinc-700 hover:text-red-400 transition-colors flex-shrink-0 mt-0.5">
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Graph canvas area */}
        <div className="flex-1 flex flex-col min-w-0 relative">
          {selected ? (
            <>
              {/* Toolbar */}
              <div className="border-b border-white/[0.07] px-4 py-2.5 flex items-center justify-between bg-zinc-900/30">
                <div>
                  <div className="text-sm font-semibold text-white">{selected.name}</div>
                  <div className="text-[10px] text-zinc-500">{selected.nodeCount} nodes · {selected.edgeCount} edges</div>
                </div>
                <div className="flex items-center gap-1.5">
                  <button onClick={() => setShowLabels(l => !l)}
                    className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-[10px] font-medium border transition-all ${showLabels ? 'border-emerald-500/40 bg-emerald-500/10 text-emerald-400' : 'border-zinc-700 text-zinc-500 hover:text-zinc-300'}`}>
                    <Tag className="w-3 h-3" />Labels
                  </button>
                  <button onClick={() => setZoom(z => Math.min(3, z + 0.2))} className="p-1.5 rounded-lg border border-zinc-700 text-zinc-400 hover:text-white hover:border-zinc-600 transition-all">
                    <ZoomIn className="w-3.5 h-3.5" />
                  </button>
                  <button onClick={() => setZoom(z => Math.max(0.3, z - 0.2))} className="p-1.5 rounded-lg border border-zinc-700 text-zinc-400 hover:text-white hover:border-zinc-600 transition-all">
                    <ZoomOut className="w-3.5 h-3.5" />
                  </button>
                  <button onClick={fitView} className="p-1.5 rounded-lg border border-zinc-700 text-zinc-400 hover:text-white hover:border-zinc-600 transition-all">
                    <Maximize2 className="w-3.5 h-3.5" />
                  </button>
                  <button onClick={exportGraph} className="p-1.5 rounded-lg border border-zinc-700 text-zinc-400 hover:text-white hover:border-zinc-600 transition-all">
                    <Download className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              <div className="flex flex-1 overflow-hidden">
                {/* SVG Canvas */}
                <div ref={containerRef} className="flex-1 overflow-hidden relative"
                  style={{ cursor: dragging ? 'grabbing' : 'grab' }}>
                  <svg ref={svgRef} width="100%" height="100%"
                    viewBox={`0 0 ${W} ${H}`}
                    onWheel={handleWheel}
                    onMouseDown={handleMouseDown}
                    onMouseMove={handleMouseMove}
                    onMouseUp={handleMouseUp}
                    onMouseLeave={handleMouseUp}
                    style={{ background: 'transparent' }}>
                    <defs>
                      {/* Glow filter */}
                      <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
                        <feGaussianBlur stdDeviation="4" result="coloredBlur" />
                        <feMerge><feMergeNode in="coloredBlur" /><feMergeNode in="SourceGraphic" /></feMerge>
                      </filter>
                      <filter id="glow-strong" x="-100%" y="-100%" width="300%" height="300%">
                        <feGaussianBlur stdDeviation="8" result="coloredBlur" />
                        <feMerge><feMergeNode in="coloredBlur" /><feMergeNode in="SourceGraphic" /></feMerge>
                      </filter>
                      {/* Node gradients */}
                      {PALETTES.map((p, i) => (
                        <radialGradient key={i} id={`ng${i}`} cx="35%" cy="35%" r="65%">
                          <stop offset="0%" stopColor={p.fill} stopOpacity="1" />
                          <stop offset="100%" stopColor={p.stroke} stopOpacity="0.8" />
                        </radialGradient>
                      ))}
                      {/* Edge gradient */}
                      <linearGradient id="edgeGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#6366f1" stopOpacity="0.4" />
                        <stop offset="100%" stopColor="#34d399" stopOpacity="0.4" />
                      </linearGradient>
                      {/* Arrow marker */}
                      <marker id="arrow" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
                        <path d="M0,0 L6,3 L0,6 Z" fill="#6366f1" fillOpacity="0.5" />
                      </marker>
                    </defs>

                    <g transform={`translate(${pan.x}, ${pan.y}) scale(${zoom})`}>
                      {/* Edges */}
                      {selected.edges.map(edge => {
                        const s = simNodes.find(n => n.id === edge.source);
                        const t = simNodes.find(n => n.id === edge.target);
                        if (!s || !t) return null;
                        const mx = (s.x + t.x) / 2;
                        const my = (s.y + t.y) / 2 - 20;
                        const isHovered = hoveredEdge === edge.id;
                        const isRelated = selectedNode && (edge.source === selectedNode.id || edge.target === selectedNode.id);
                        const w = (edge.weight ?? 0.5) * 2.5;
                        return (
                          <g key={edge.id} className="cursor-pointer"
                            onClick={e => { e.stopPropagation(); setSelectedEdge(edge); setSelectedNode(null); }}
                            onMouseEnter={() => setHoveredEdge(edge.id)}
                            onMouseLeave={() => setHoveredEdge(null)}>
                            <path
                              d={`M${s.x},${s.y} Q${mx},${my} ${t.x},${t.y}`}
                              fill="none"
                              stroke={isRelated ? '#34d399' : isHovered ? '#818cf8' : '#3f3f46'}
                              strokeWidth={isHovered || isRelated ? w + 1 : w}
                              strokeOpacity={isRelated ? 0.9 : isHovered ? 0.8 : 0.45}
                              markerEnd="url(#arrow)"
                            />
                            {isHovered && edge.label && (
                              <text x={mx} y={my - 6} textAnchor="middle" fill="#a1a1aa" fontSize="8" filter="url(#glow)">
                                {edge.label}
                              </text>
                            )}
                          </g>
                        );
                      })}

                      {/* Nodes */}
                      {simNodes.map(node => {
                        const pal = PALETTES[node.colorIdx];
                        const r = Math.max(10, Math.min(22, 8 + node.degree * 3));
                        const isSelected = selectedNode?.id === node.id;
                        const isHov = hoveredNode === node.id;
                        const isRelated = selectedNode && getNeighbors(selectedNode.id).some(n => n.id === node.id);
                        const dimmed = selectedNode && !isSelected && !isRelated;
                        return (
                          <g key={node.id} className="graph-node cursor-pointer"
                            onClick={e => { e.stopPropagation(); setSelectedNode(isSelected ? null : node); setSelectedEdge(null); }}
                            onMouseEnter={() => setHoveredNode(node.id)}
                            onMouseLeave={() => setHoveredNode(null)}>
                            {/* Outer glow ring for selected */}
                            {isSelected && (
                              <circle cx={node.x} cy={node.y} r={r + 10} fill="none"
                                stroke={pal.fill} strokeWidth="1.5" strokeOpacity="0.4"
                                filter="url(#glow-strong)" />
                            )}
                            {/* Pulse ring */}
                            {(isSelected || isHov) && (
                              <circle cx={node.x} cy={node.y} r={r + 6} fill="none"
                                stroke={pal.fill} strokeWidth="1" strokeOpacity="0.5" />
                            )}
                            {/* Main circle */}
                            <circle cx={node.x} cy={node.y} r={r}
                              fill={`url(#ng${node.colorIdx})`}
                              stroke={pal.stroke}
                              strokeWidth={isSelected ? 2.5 : isHov ? 2 : 1.5}
                              filter={isSelected || isHov ? 'url(#glow)' : undefined}
                              opacity={dimmed ? 0.25 : 1}
                            />
                            {/* Label */}
                            {showLabels && !dimmed && (
                              <text x={node.x} y={node.y + r + 13} textAnchor="middle"
                                fill={isSelected || isHov ? '#fff' : '#a1a1aa'}
                                fontSize={isSelected ? 10 : 8.5}
                                fontWeight={isSelected ? 'bold' : 'normal'}
                                style={{ pointerEvents: 'none', userSelect: 'none' }}>
                                {node.label.length > 14 ? node.label.slice(0, 13) + '…' : node.label}
                              </text>
                            )}
                            {/* Degree badge */}
                            {node.degree > 2 && !dimmed && (
                              <g>
                                <circle cx={node.x + r - 2} cy={node.y - r + 2} r={5} fill="#1f2937" stroke={pal.fill} strokeWidth="1" />
                                <text x={node.x + r - 2} y={node.y - r + 6} textAnchor="middle" fill={pal.fill} fontSize="5.5" fontWeight="bold"
                                  style={{ pointerEvents: 'none' }}>{node.degree}</text>
                              </g>
                            )}
                          </g>
                        );
                      })}
                    </g>
                  </svg>

                  {/* Zoom badge */}
                  <div className="absolute bottom-3 right-3 text-[10px] text-zinc-600 bg-zinc-900/80 px-2 py-1 rounded-lg border border-zinc-800">
                    {Math.round(zoom * 100)}%
                  </div>
                </div>

                {/* Node Detail Panel */}
                {selectedNode && (
                  <div className="w-64 border-l border-white/[0.07] bg-zinc-900/80 backdrop-blur flex flex-col flex-shrink-0 overflow-hidden">
                    <div className="p-4 border-b border-white/[0.07] flex items-start justify-between">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: PALETTES[selectedNode.colorIdx].fill }} />
                          <div className="text-xs font-bold text-white truncate">{selectedNode.label}</div>
                        </div>
                        <div className="flex gap-1.5 flex-wrap mt-2">
                          <span className="px-2 py-0.5 rounded-full text-[9px] font-medium border border-emerald-500/30 text-emerald-400 bg-emerald-500/10">
                            Degree {selectedNode.degree}
                          </span>
                          {selectedNode.colorIdx === 0 && (
                            <span className="px-2 py-0.5 rounded-full text-[9px] font-medium border border-amber-500/30 text-amber-400 bg-amber-500/10">
                              Hub
                            </span>
                          )}
                        </div>
                      </div>
                      <button onClick={() => setSelectedNode(null)} className="text-zinc-600 hover:text-zinc-400 p-1 flex-shrink-0">
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="flex-1 overflow-auto p-3 space-y-3">
                      {/* Metrics */}
                      <div className="grid grid-cols-2 gap-2">
                        {[
                          { label: 'Connections', val: selectedNode.degree },
                          { label: 'Centrality', val: (selectedNode.degree / Math.max(simNodes.length - 1, 1)).toFixed(2) },
                          { label: 'Rank', val: `#${selectedNode.colorIdx + 1}` },
                          { label: 'Type', val: selectedNode.degree > 3 ? 'Hub' : 'Leaf' },
                        ].map(m => (
                          <div key={m.label} className="bg-white/[0.03] rounded-xl p-2.5 border border-white/[0.06]">
                            <div className="text-[10px] text-zinc-500">{m.label}</div>
                            <div className="text-sm font-bold text-white mt-0.5">{m.val}</div>
                          </div>
                        ))}
                      </div>

                      {/* Connected nodes */}
                      <div>
                        <div className="text-[10px] text-zinc-500 uppercase tracking-widest mb-2">Connected Nodes</div>
                        <div className="space-y-1">
                          {getNeighbors(selectedNode.id).map(n => (
                            <button key={n.id} onClick={() => setSelectedNode(n)}
                              className="w-full flex items-center gap-2 p-2 rounded-lg bg-white/[0.03] hover:bg-white/[0.06] border border-white/[0.05] transition-all text-left group">
                              <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: PALETTES[n.colorIdx].fill }} />
                              <span className="text-[11px] text-zinc-300 group-hover:text-white truncate flex-1">{n.label}</span>
                              <ChevronRight className="w-3 h-3 text-zinc-600 group-hover:text-zinc-400 flex-shrink-0" />
                            </button>
                          ))}
                          {getNeighbors(selectedNode.id).length === 0 && (
                            <div className="text-[10px] text-zinc-600 text-center py-2">No connections</div>
                          )}
                        </div>
                      </div>

                      {/* Edge details */}
                      {getEdgesBetween(selectedNode.id).length > 0 && (
                        <div>
                          <div className="text-[10px] text-zinc-500 uppercase tracking-widest mb-2">Edges</div>
                          <div className="space-y-1">
                            {getEdgesBetween(selectedNode.id).slice(0, 5).map(e => {
                              const other = e.source === selectedNode.id ? e.target : e.source;
                              const otherNode = simNodes.find(n => n.id === other);
                              return (
                                <div key={e.id} className="flex items-center gap-2 p-1.5 rounded-lg bg-white/[0.02] border border-white/[0.04]">
                                  <div className="w-8 h-1 rounded-full flex-shrink-0" style={{ background: `linear-gradient(90deg, ${PALETTES[selectedNode.colorIdx].fill}, ${PALETTES[otherNode?.colorIdx ?? 0].fill})`, opacity: e.weight ?? 0.5 + 0.5 }} />
                                  <span className="text-[9px] text-zinc-500 truncate">{otherNode?.label ?? other}</span>
                                  <span className="text-[9px] text-zinc-700 flex-shrink-0">{((e.weight ?? 0.5) * 100).toFixed(0)}%</span>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Action buttons */}
                    <div className="p-3 border-t border-white/[0.07] space-y-2">
                      <button
                        onClick={() => setLocation(`/rag-chat?q=${encodeURIComponent(selectedNode.label)}`)}
                        className="w-full flex items-center gap-2 py-2 px-3 bg-teal-600/20 hover:bg-teal-600/30 border border-teal-500/30 text-teal-300 rounded-xl text-xs font-medium transition-all">
                        <MessageCircle className="w-3.5 h-3.5" />
                        Ask RAG Chat about this
                      </button>
                      <button
                        onClick={() => { setTopic(selectedNode.label); setSelectedNode(null); }}
                        className="w-full flex items-center gap-2 py-2 px-3 bg-emerald-600/20 hover:bg-emerald-600/30 border border-emerald-500/30 text-emerald-300 rounded-xl text-xs font-medium transition-all">
                        <GitBranch className="w-3.5 h-3.5" />
                        Generate related graph
                      </button>
                    </div>
                  </div>
                )}

                {/* Edge Detail Panel */}
                {selectedEdge && !selectedNode && (
                  <div className="w-56 border-l border-white/[0.07] bg-zinc-900/80 backdrop-blur p-4 flex-shrink-0">
                    <div className="flex items-center justify-between mb-4">
                      <div className="text-xs font-semibold text-white">Edge Detail</div>
                      <button onClick={() => setSelectedEdge(null)} className="text-zinc-600 hover:text-zinc-400">
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    <div className="space-y-3">
                      <div>
                        <div className="text-[9px] text-zinc-500 uppercase tracking-widest mb-1.5">Source</div>
                        <div className="text-xs text-white font-medium bg-white/[0.04] rounded-lg px-2.5 py-1.5">
                          {simNodes.find(n => n.id === selectedEdge.source)?.label ?? selectedEdge.source}
                        </div>
                      </div>
                      <div className="flex items-center gap-2 px-1">
                        <div className="flex-1 h-px bg-gradient-to-r from-blue-500 to-emerald-500 opacity-50" />
                        <div className="text-[9px] text-zinc-500">→</div>
                        <div className="flex-1 h-px bg-gradient-to-r from-emerald-500 to-blue-500 opacity-50" />
                      </div>
                      <div>
                        <div className="text-[9px] text-zinc-500 uppercase tracking-widest mb-1.5">Target</div>
                        <div className="text-xs text-white font-medium bg-white/[0.04] rounded-lg px-2.5 py-1.5">
                          {simNodes.find(n => n.id === selectedEdge.target)?.label ?? selectedEdge.target}
                        </div>
                      </div>
                      {selectedEdge.label && (
                        <div>
                          <div className="text-[9px] text-zinc-500 uppercase tracking-widest mb-1.5">Relationship</div>
                          <div className="text-xs text-emerald-400 font-medium">{selectedEdge.label}</div>
                        </div>
                      )}
                      <div>
                        <div className="text-[9px] text-zinc-500 uppercase tracking-widest mb-1.5">Weight</div>
                        <div className="flex items-center gap-2">
                          <div className="flex-1 bg-zinc-800 rounded-full h-1.5">
                            <div className="h-1.5 rounded-full bg-gradient-to-r from-blue-500 to-emerald-500"
                              style={{ width: `${((selectedEdge.weight ?? 0.5) * 100).toFixed(0)}%` }} />
                          </div>
                          <span className="text-xs text-white font-medium">{((selectedEdge.weight ?? 0.5) * 100).toFixed(0)}%</span>
                        </div>
                      </div>
                      <button
                        onClick={() => {
                          const src = simNodes.find(n => n.id === selectedEdge.source);
                          const tgt = simNodes.find(n => n.id === selectedEdge.target);
                          setLocation(`/rag-chat?q=${encodeURIComponent(`Relationship between ${src?.label} and ${tgt?.label}`)}`);
                        }}
                        className="w-full flex items-center gap-2 py-2 px-3 bg-teal-600/20 hover:bg-teal-600/30 border border-teal-500/30 text-teal-300 rounded-xl text-xs font-medium transition-all">
                        <MessageCircle className="w-3.5 h-3.5" />
                        Explore in RAG Chat
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Bottom stats */}
              <div className="border-t border-white/[0.07] px-5 py-3 flex items-center gap-6 bg-zinc-900/30">
                {[
                  { label: 'Nodes', value: selected.nodeCount, color: '#34d399' },
                  { label: 'Edges', value: selected.edgeCount, color: '#60a5fa' },
                  { label: 'Density', value: (selected.edgeCount / Math.max(selected.nodeCount * (selected.nodeCount - 1) / 2, 1)).toFixed(3), color: '#a78bfa' },
                  { label: 'Avg Degree', value: ((2 * selected.edgeCount) / Math.max(selected.nodeCount, 1)).toFixed(1), color: '#fbbf24' },
                  { label: 'Max Degree', value: simNodes.length ? Math.max(...simNodes.map(n => n.degree)) : 0, color: '#f472b6' },
                ].map(s => (
                  <div key={s.label} className="text-center">
                    <div className="text-base font-bold" style={{ color: s.color }}>{s.value}</div>
                    <div className="text-[9px] text-zinc-500 uppercase tracking-widest mt-0.5">{s.label}</div>
                  </div>
                ))}
                <div className="ml-auto text-[10px] text-zinc-600 italic">
                  {selectedNode ? `Selected: ${selectedNode.label}` : 'Click a node to explore · Scroll to zoom · Drag to pan'}
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-emerald-500/5 border border-emerald-500/20 flex items-center justify-center">
                  <GitBranch className="w-10 h-10 text-emerald-500/40" />
                </div>
                <div className="text-sm text-zinc-400 mb-2">Generate a graph or select one from the list</div>
                <div className="text-xs text-zinc-600">Force-directed layout · Interactive · Click to explore</div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
