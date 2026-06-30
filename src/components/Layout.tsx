import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import { useListStore } from "@/store/useListStore";

interface LayoutProps {
  children: ReactNode;
  title?: string;
}

export function Layout({ children, title }: LayoutProps) {
  const listCount = useListStore((state) => state.selectedProfiles.length);

  return (
    <div className="min-h-screen bg-paper">
      <header className="bg-ink sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link
            to="/"
            className="font-display text-lg font-semibold text-paper tracking-tight"
          >
            Wobb<span className="text-teal">.</span>
          </Link>
          <Link
            to="/shortlist"
            className="flex items-center gap-2 bg-teal text-paper text-sm font-medium px-3 py-1.5 rounded-full hover:bg-teal/90 transition-colors"
          >
            Shortlist
            <span className="bg-paper text-ink rounded-full w-5 h-5 flex items-center justify-center text-xs font-mono font-semibold">
              {listCount}
            </span>
          </Link>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8">
        {title && (
          <h1 className="font-display text-2xl font-semibold text-ink mb-1">
            {title}
          </h1>
        )}
        {children}
      </main>
    </div>
  );
}