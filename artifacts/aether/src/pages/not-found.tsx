import { AlertCircle } from "lucide-react";
import { Link } from "wouter";

export default function NotFound() {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-zinc-950">
      <div className="text-center">
        <div className="flex items-center justify-center gap-2 mb-4">
          <AlertCircle className="h-8 w-8 text-red-500" />
          <h1 className="text-2xl font-bold text-white">404 Page Not Found</h1>
        </div>
        <p className="mt-2 text-sm text-zinc-400 mb-6">
          This page doesn't exist in Aether.
        </p>
        <Link href="/" className="px-6 py-2.5 bg-white text-black rounded-xl text-sm font-medium">
          Back to Dashboard
        </Link>
      </div>
    </div>
  );
}
