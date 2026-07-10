"use client";

import { useMemo } from "react";
import { useCompilerStore } from "@/store/compilerStore";

export function LivePreview() {
  const { generatedCode, compileError, compileWarning } = useCompilerStore();

  const srcDoc = useMemo(() => {
    const fallbackMarkup = `<div class="flex min-h-[240px] items-center justify-center rounded-[32px] border border-dashed border-slate-300 bg-white/80 px-6 text-center text-sm text-slate-500">Live preview will appear here after compile.</div>`;
    const content = generatedCode || fallbackMarkup;

    return `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <script src="https://cdn.tailwindcss.com"></script>
    <style>
      body { font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif; }
    </style>
  </head>
  <body class="min-h-screen bg-slate-100 p-6">
    <div class="mx-auto max-w-5xl">
      ${content}
    </div>
  </body>
</html>`;
  }, [generatedCode]);

  return (
    <div className="flex h-full flex-col rounded-[32px] border border-slate-200 bg-white shadow-xl">
      <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4 text-sm font-semibold text-slate-800">
        <span>Live Preview</span>
        {(compileWarning || compileError) && (
          <span className={`rounded-full px-3 py-1 text-xs font-medium ${compileError ? "bg-red-50 text-red-700" : "bg-amber-50 text-amber-700"}`}>
            {compileError ? "Needs attention" : "Warning"}
          </span>
        )}
      </div>
      <div className="flex-1 overflow-hidden rounded-b-[32px] bg-slate-50 p-4">
        <iframe
          title="Live preview"
          className="h-full w-full rounded-[28px] border border-slate-200 bg-white"
          srcDoc={srcDoc}
          sandbox="allow-scripts"
        />
      </div>
    </div>
  );
}
