"use client";

import { Clipboard, Code2 } from "lucide-react";
import { useMemo, useState } from "react";
import { useCompilerStore } from "@/store/compilerStore";

export function CodeInspector() {
  const { activeTab, generatedCode, setActiveTab } = useCompilerStore();
  const [copied, setCopied] = useState(false);

  function htmlToJsxAttrs(html: string) {
    if (!html) return html;

    const convertedStyle = html.replace(/style="([^\"]*)"/g, (_match, styleValue) => {
      const styleEntries = styleValue
        .split(";")
        .map((decl: string) => decl.trim())
        .filter(Boolean)
        .map((decl: string) => {
          const [key, value] = decl.split(":").map((part) => part.trim());
          if (!key || !value) return "";
          const camelKey = key.replace(/-([a-z])/g, (_m, c) => c.toUpperCase());
          return `${camelKey}: \"${value}\"`;
        })
        .filter(Boolean);

      return `style={{ ${styleEntries.join(", ")} }}`;
    });

    return convertedStyle
      .replace(/class=\"/g, 'className="')
      .replace(/\bfor=\"/g, 'htmlFor="')
      .replace(/<!--([\s\S]*?)-->/g, '{/*$1*/}');
  }

  const displayCode = useMemo(() => {
    if (!generatedCode) {
      return "No code generated yet. Click compile to render the layout.";
    }

    if (activeTab === "react") {
      const jsx = htmlToJsxAttrs(generatedCode || "");
      return `import React from "react";

export function Layout() {
  return (
    <>
${(jsx || "").split("\n").map((line) => `      ${line}`).join("\n")}
    </>
  );
}
`;
    }

    if (activeTab === "vue") {
      return `<template>
${generatedCode
  .split("\n")
  .map((line) => `  ${line}`)
  .join("\n")}
</template>

<script setup>
</script>
`;
    }

    return generatedCode;
  }, [activeTab, generatedCode]);

  const copyCode = async () => {
    await navigator.clipboard.writeText(displayCode || "");
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1800);
  };

  return (
    <div className="flex h-full flex-col rounded-[32px] border border-slate-200 bg-white shadow-xl">
      <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
        <div className="flex items-center gap-2 text-sm font-semibold text-slate-800">
          <Code2 size={16} />
          <span>Code Inspector</span>
        </div>
        <button
          type="button"
          onClick={copyCode}
          className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100"
        >
          <Clipboard size={16} />
          {copied ? "Copied" : "Copy"}
        </button>
      </div>
      <div className="flex gap-2 border-b border-slate-200 px-5 py-3">
        {(["html", "react", "vue"] as const).map((tab) => (
          <button
            key={tab}
            type="button"
            className={`rounded-2xl px-4 py-2 text-sm font-medium ${activeTab === tab ? "bg-slate-900 text-white" : "bg-slate-50 text-slate-700"}`}
            onClick={() => setActiveTab(tab)}
          >
            {tab.toUpperCase()}
          </button>
        ))}
      </div>
      <div className="flex-1 overflow-auto p-5 text-sm text-slate-700">
        <pre className="whitespace-pre-wrap break-words rounded-3xl bg-slate-50 p-4 font-mono text-xs leading-6 text-slate-800">
          {displayCode}
        </pre>
      </div>
    </div>
  );
}
