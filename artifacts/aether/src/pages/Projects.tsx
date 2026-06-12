import { useState, useEffect } from 'react';
import { FolderOpen, Plus, RefreshCw, Trash2, CheckCircle, Archive } from 'lucide-react';
import { api } from '@/lib/api';

interface Project { id: number; name: string; description?: string; status: string; tags: string[]; createdAt: string; updatedAt: string; }

export default function Projects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [name, setName] = useState('');
  const [desc, setDesc] = useState('');
  const [showNew, setShowNew] = useState(false);
  const [saving, setSaving] = useState(false);

  const load = async () => {
    setLoading(true);
    try { const data = await api.get<Project[]>('/projects'); setProjects(data); }
    catch { } finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  const create = async () => {
    if (!name.trim()) return;
    setSaving(true);
    try {
      const p = await api.post<Project>('/projects', { name, description: desc || undefined, tags: [] });
      setProjects(prev => [p, ...prev]);
      setName(''); setDesc(''); setShowNew(false);
    } catch { } finally { setSaving(false); }
  };

  const remove = async (id: number) => {
    try { await api.delete(`/projects/${id}`); setProjects(prev => prev.filter(p => p.id !== id)); }
    catch { }
  };

  const archive = async (id: number) => {
    try {
      await api.patch(`/projects/${id}`, { status: 'archived' });
      setProjects(prev => prev.map(p => p.id === id ? { ...p, status: 'archived' } : p));
    } catch { }
  };

  const statusColor: Record<string, string> = { active: 'bg-emerald-400', archived: 'bg-zinc-500', paused: 'bg-amber-400' };

  return (
    <div className="h-screen flex flex-col bg-zinc-950">
      <div className="border-b border-zinc-800 bg-zinc-900/50 px-6 py-4 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-white flex items-center gap-2"><FolderOpen className="w-5 h-5 text-orange-400" />Projects</h1>
          <p className="text-xs text-zinc-500 mt-0.5">Organize your research into focused projects</p>
        </div>
        <div className="flex gap-2">
          <button onClick={load} className="p-2 text-zinc-500 hover:text-white hover:bg-zinc-800 rounded-lg transition-colors">
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
          <button onClick={() => setShowNew(true)} className="flex items-center gap-1.5 px-4 py-2 bg-orange-600 hover:bg-orange-500 text-white rounded-xl text-xs font-medium transition-colors">
            <Plus className="w-3.5 h-3.5" />New Project
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-auto p-6">
        <div className="max-w-3xl mx-auto space-y-4">
          {showNew && (
            <div className="bg-zinc-900 border border-orange-500/30 rounded-2xl p-5">
              <div className="text-sm font-semibold text-white mb-4">New Project</div>
              <div className="space-y-3">
                <div>
                  <label className="text-xs text-zinc-500 block mb-1">Project Name *</label>
                  <input value={name} onChange={e => setName(e.target.value)} placeholder="e.g. Knowledge Graph Study"
                    className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-orange-500/50" />
                </div>
                <div>
                  <label className="text-xs text-zinc-500 block mb-1">Description</label>
                  <textarea value={desc} onChange={e => setDesc(e.target.value)} placeholder="Brief description..."
                    className="w-full h-16 bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-2.5 text-sm text-white resize-none focus:outline-none focus:border-orange-500/50" />
                </div>
                <div className="flex gap-2">
                  <button onClick={create} disabled={saving || !name.trim()}
                    className="flex items-center gap-1.5 px-5 py-2 bg-orange-600 hover:bg-orange-500 disabled:opacity-50 text-white rounded-xl text-xs font-medium transition-colors">
                    {saving ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Plus className="w-3.5 h-3.5" />}
                    {saving ? 'Creating...' : 'Create Project'}
                  </button>
                  <button onClick={() => { setShowNew(false); setName(''); setDesc(''); }} className="px-4 py-2 text-zinc-500 hover:text-white text-xs transition-colors">Cancel</button>
                </div>
              </div>
            </div>
          )}

          {loading ? (
            <div className="text-center py-16 text-zinc-500 text-sm">Loading projects...</div>
          ) : projects.length === 0 && !showNew ? (
            <div className="text-center py-16 text-zinc-600">
              <FolderOpen className="w-12 h-12 mx-auto mb-3 text-zinc-700" />
              <div className="text-sm">No projects yet — create your first project to organize your research</div>
              <button onClick={() => setShowNew(true)} className="mt-4 flex items-center gap-1.5 px-5 py-2.5 bg-orange-600 hover:bg-orange-500 text-white rounded-xl text-sm font-medium transition-colors mx-auto">
                <Plus className="w-4 h-4" />Create First Project
              </button>
            </div>
          ) : (
            projects.map(p => (
              <div key={p.id} className={`bg-zinc-900 border rounded-2xl p-5 transition-all ${p.status === 'archived' ? 'border-zinc-800 opacity-60' : 'border-zinc-800 hover:border-zinc-700'}`}>
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <FolderOpen className="w-5 h-5 text-orange-400 flex-shrink-0" />
                    <div>
                      <div className="font-semibold text-sm text-white">{p.name}</div>
                      {p.description && <div className="text-xs text-zinc-500 mt-0.5">{p.description}</div>}
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 flex-shrink-0">
                    <div className="flex items-center gap-1 text-[10px] text-zinc-500">
                      <span className={`w-2 h-2 rounded-full ${statusColor[p.status] ?? 'bg-zinc-500'}`} />{p.status}
                    </div>
                    {p.status === 'active' && (
                      <button onClick={() => archive(p.id)} title="Archive" className="p-1.5 text-zinc-600 hover:text-amber-400 transition-colors"><Archive className="w-3.5 h-3.5" /></button>
                    )}
                    <button onClick={() => remove(p.id)} title="Delete" className="p-1.5 text-zinc-600 hover:text-red-400 transition-colors"><Trash2 className="w-3.5 h-3.5" /></button>
                  </div>
                </div>
                <div className="flex items-center gap-4 mt-3 text-[10px] text-zinc-600">
                  <span>Created {new Date(p.createdAt).toLocaleDateString()}</span>
                  <span>Updated {new Date(p.updatedAt).toLocaleDateString()}</span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
