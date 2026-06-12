'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  BookOpen, 
  FileText, 
  GitBranch, 
  Users, 
  BarChart3, 
  Settings,
  Upload,
  Search,
  MessageCircle
} from 'lucide-react';

const navItems = [
  { href: '/', label: 'Dashboard', icon: BookOpen },
  { href: '/editor', label: 'LaTeX Editor', icon: FileText },
  { href: '/graph', label: 'Knowledge Graph', icon: GitBranch },
  { href: '/qa', label: 'QA Generator', icon: Users },
  { href: '/journal', label: 'Research Journal', icon: BarChart3 },
  { href: '/xai', label: 'Explainability', icon: Settings },
  { href: '/upload', label: 'Upload PDF', icon: Upload },
  { href: '/search', label: 'Universal Search', icon: Search },
  { href: '/chat', label: 'RAG Chat', icon: MessageCircle },
  { href: '/agents', label: 'Agents', icon: Users },
  { href: '/projects', label: 'Projects', icon: BookOpen },
  { href: '/timeline', label: 'Timeline', icon: BarChart3 },
  { href: '/assistant', label: 'AI Assistant', icon: MessageCircle },
  { href: '/generate-paper', label: 'Generate Paper', icon: FileText },
  { href: '/graph-viz', label: 'Graph Viz', icon: GitBranch },
  { href: '/knowledge-map', label: 'Knowledge Map', icon: GitBranch },
  { href: '/mood-graph', label: 'Mood × Graph', icon: BarChart3 },
  { href: '/smart-dashboard', label: 'Smart Dashboard', icon: BookOpen },
  { href: '/insights', label: 'Deep Insights', icon: BarChart3 },
  { href: '/collaborate', label: 'Collaborate', icon: Users },
  { href: '/auto-research', label: 'Auto Research', icon: Users },
  { href: '/research-brain', label: 'Research Brain', icon: BookOpen },
  { href: '/research-os', label: 'Research OS', icon: BookOpen },
  { href: '/aether-core', label: 'Aether Core', icon: Settings },
  { href: '/sandbox', label: 'Sandbox', icon: Settings },
  { href: '/settings', label: 'Settings', icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <div className="w-64 bg-zinc-900 border-r border-zinc-800 flex flex-col">
      <div className="p-6">
        <h1 className="text-2xl font-bold tracking-tight">Aether</h1>
        <p className="text-xs text-zinc-500 mt-1">Benchmark Research Platform</p>
      </div>
      
      <nav className="flex-1 px-3 space-y-1 overflow-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm transition-colors ${
                isActive 
                  ? 'bg-zinc-800 text-white' 
                  : 'text-zinc-400 hover:text-white hover:bg-zinc-800/50'
              }`}
            >
              <Icon className="w-4 h-4" />
              {item.label}
            </Link>
          );
        })}
      </nav>
      
      <div className="p-4 border-t border-zinc-800 text-xs text-zinc-500">
        v1.0 • All ideas integrated
      </div>
    </div>
  );
}