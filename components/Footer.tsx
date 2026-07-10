import Link from "next/link";

export function Footer() {
  return (
    <footer className="w-full border-t border-slate-200 bg-paper-50">
      <div className="mx-auto flex max-w-[1200px] items-center justify-between px-4 py-6 text-sm text-slate-600">
        <div>© {new Date().getFullYear()} DrawLayout Studio</div>
        <div className="flex items-center gap-4">
          <Link href="/privacy">Privacy</Link>
          <Link href="/terms">Terms</Link>
        </div>
      </div>
    </footer>
  );
}
