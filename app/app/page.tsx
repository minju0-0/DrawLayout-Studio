"use client";

import { Sparkles } from "lucide-react";
import { useEffect, useState } from "react";
import { Toolbar } from "@/components/Toolbar";
import { DrawingCanvas } from "@/components/DrawingCanvas";
import { LivePreview } from "@/components/LivePreview";
import { CodeInspector } from "@/components/CodeInspector";
import { AuthStatus } from "@/components/AuthStatus";
import { LayoutVault } from "@/components/LayoutVault";
import { useCompilerStore } from "@/store/compilerStore";
import { useCanvasStore } from "@/store/canvasStore";

export default function AppPage() {
  const [showSuccess, setShowSuccess] = useState(false);

  const {
    setIsCompiling,
    setGeneratedCode,
    setCompileError,
    setCompileWarning,
    compileError,
    compileWarning,
    isCompiling,
  } = useCompilerStore();
  const { canvasElements } = useCanvasStore();

  useEffect(() => {
    setCompileError("");
    setCompileWarning("");
  }, [setCompileError, setCompileWarning]);

  const handleCompile = async () => {
    setIsCompiling(true);
    setCompileError("");
    setCompileWarning("");
    setShowSuccess(false);

    try {
      const response = await fetch("/api/compile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ canvasElements }),
      });

      const result = await response.json();
      if (!response.ok || result.error) {
        setGeneratedCode("");
        setCompileError(result.error || "Failed to compile layout.");
        return;
      }

      setGeneratedCode(result.code || "");
      setCompileWarning(result.warning || "");

      if (result.code) {
        setShowSuccess(true);
        setTimeout(() => setShowSuccess(false), 3000);
      }
    } catch (error) {
      setGeneratedCode("");
      setCompileError(error instanceof Error ? error.message : "Unexpected compile error.");
    } finally {
      setIsCompiling(false);
    }
  };

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto grid max-w-[1750px] gap-6 xl:grid-cols-[420px_minmax(700px,1fr)_420px] xl:gap-8">
        <div className="space-y-6">
          <div className="rounded-[32px] border border-slate-200 bg-white p-6 shadow-[var(--shadow)]">
            <div className="flex flex-col gap-3">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm font-semibold uppercase tracking-[0.28em] text-slate-500">Workspace</p>
                  <h1 className="mt-3 text-2xl font-semibold text-slate-950">Draw, compile, and ship layouts.</h1>
                </div>
                <span className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.3em] text-slate-700">
                  <Sparkles className="h-3.5 w-3.5" /> Live
                </span>
              </div>
              <p className="text-sm leading-6 text-slate-600">Use the canvas controls to sketch wireframes, then compile them to Tailwind with live preview and reusable layout saving.</p>
            </div>
          </div>

          <Toolbar />

          <div className="rounded-[32px] border border-slate-200 bg-white p-6 shadow-[var(--shadow)]">
            <button
              type="button"
              onClick={handleCompile}
              disabled={isCompiling}
              className="inline-flex h-12 w-full items-center justify-center rounded-3xl bg-slate-950 px-6 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-400"
            >
              {isCompiling ? "Compiling..." : "Compile Layout"}
            </button>
            <p className="mt-3 text-sm text-slate-600">Compile your current sketch into Tailwind markup and review the generated code instantly.</p>

            {showSuccess && (
              <div className="mt-5 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-900">
                ✓ Layout compiled successfully.
              </div>
            )}

            {compileWarning ? (
              <p className="mt-5 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">{compileWarning}</p>
            ) : null}
            {compileError ? (
              <p className="mt-5 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-900">{compileError}</p>
            ) : null}
          </div>

          <AuthStatus />
        </div>

        <div className="flex min-h-[740px] flex-col overflow-hidden rounded-[32px] border border-slate-200 bg-white shadow-[var(--shadow)]">
          <div className="border-b border-slate-200 bg-slate-50 px-6 py-4">
            <div className="text-sm font-semibold uppercase tracking-[0.28em] text-slate-500">Canvas</div>
          </div>
          <div className="flex-1 overflow-hidden p-4">
            <DrawingCanvas />
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-[32px] border border-slate-200 bg-white p-4 shadow-[var(--shadow)]">
            <LivePreview />
          </div>
          <div className="rounded-[32px] border border-slate-200 bg-white p-4 shadow-[var(--shadow)]">
            <CodeInspector />
          </div>
          <div className="rounded-[32px] border border-slate-200 bg-white p-4 shadow-[var(--shadow)]">
            <LayoutVault />
          </div>
        </div>
      </div>
    </main>
  );
}
