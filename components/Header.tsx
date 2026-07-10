"use client";

import Link from "next/link";
import { AuthStatus } from "@/components/AuthStatus";

export function Header() {
  return (
    <header className="w-full border-b border-slate-200 bg-paper-50">
      <div className="mx-auto flex h-16 max-w-[1200px] items-center justify-between px-4">
        <div className="flex items-center gap-4">
          <Link href="/" className="text-lg font-semibold text-slate-900">DrawLayout</Link>
          <nav className="hidden items-center gap-3 sm:flex">
            <Link href="/" className="text-sm text-slate-700">Home</Link>
            <Link href="/app" className="text-sm text-slate-700">Editor</Link>
            <Link href="/vault" className="text-sm text-slate-700">Vault</Link>
          </nav>
        </div>
        <div>
          <AuthStatus />
        </div>
      </div>
    </header>
  );
}
