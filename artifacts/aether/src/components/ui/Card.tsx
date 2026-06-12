import { Link } from 'wouter';

interface CardProps {
  title: string;
  description: string;
  href: string;
}

export function Card({ title, description, href }: CardProps) {
  return (
    <Link
      href={href}
      className="group block p-6 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 hover:border-zinc-700 rounded-2xl transition-all active:scale-[0.985]"
    >
      <h3 className="font-semibold text-lg group-hover:text-white transition-colors">{title}</h3>
      <p className="text-sm text-zinc-400 mt-3 leading-relaxed">{description}</p>
      <div className="mt-5 text-xs text-zinc-500 group-hover:text-zinc-400 flex items-center gap-1">
        Open <span className="transition-transform group-hover:translate-x-0.5">→</span>
      </div>
    </Link>
  );
}
