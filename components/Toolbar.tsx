"use client";

import { Brush, Square, Text, Undo2, Redo2, Trash2, ScanEye } from "lucide-react";
import { useCanvasStore } from "@/store/canvasStore";
import type { ToolType } from "@/types/canvas";

const buttonBase =
  "flex h-11 min-w-[44px] items-center justify-center rounded-2xl border border-slate-200 bg-white text-slate-900 shadow-sm transition hover:border-slate-300 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60";

const tools: Array<{ id: ToolType; label: string; icon: typeof Brush }> = [
  { id: "brush", label: "Brush", icon: Brush },
  { id: "rectangle", label: "Rect", icon: Square },
  { id: "text", label: "Text", icon: Text },
];

export function Toolbar() {
  const {
    activeTool,
    strokeColor,
    strokeWidth,
    setActiveTool,
    setStrokeColor,
    setStrokeWidth,
    undo,
    redo,
    clearCanvas,
    resetViewport,
  } = useCanvasStore();

  return (
    <div className="flex flex-col gap-4 rounded-[28px] border border-slate-200 bg-white/90 p-4 shadow-xl backdrop-blur-xl">
      <div className="space-y-2">
        <p className="text-xs font-semibold uppercase tracking-[0.28em] text-slate-500">Tooling</p>
        <div className="grid grid-cols-3 gap-3">
          {tools.map((tool) => {
            const Icon = tool.icon;
            const isActive = activeTool === tool.id;
            return (
              <button
                key={tool.id}
                type="button"
                className={`${buttonBase} ${isActive ? "border-slate-900 bg-slate-100" : ""}`}
                onClick={() => setActiveTool(tool.id)}
                aria-label={tool.label}
              >
                <div className="flex items-center gap-2">
                  <Icon size={18} />
                  <span className="text-sm font-medium">{tool.label}</span>
                </div>
              </button>
            );
          })}
          <button type="button" className={buttonBase} onClick={clearCanvas} aria-label="Clear canvas">
            <div className="flex items-center gap-2">
              <Trash2 size={18} />
              <span className="text-sm font-medium">Clear</span>
            </div>
          </button>
        </div>
      </div>

      <div className="grid gap-3 rounded-[24px] border border-slate-200 bg-slate-50 p-3 sm:grid-cols-[1fr_auto]">
        <label className="flex items-center gap-2 text-sm font-medium text-slate-700">
          <span>Color</span>
          <input
            type="color"
            className="h-10 w-12 cursor-pointer rounded-xl border border-slate-200 bg-white p-0"
            value={strokeColor}
            onChange={(event) => setStrokeColor(event.target.value)}
          />
        </label>
        <label className="flex items-center gap-2 text-sm font-medium text-slate-700">
          <span>Width</span>
          <input
            type="range"
            min="1"
            max="12"
            value={strokeWidth}
            onChange={(event) => setStrokeWidth(Number(event.target.value))}
            className="h-10 w-full cursor-pointer"
          />
        </label>
      </div>

      <div className="flex flex-wrap gap-3">
        <button type="button" className={buttonBase} onClick={undo} aria-label="Undo">
          <div className="flex items-center gap-2">
            <Undo2 size={18} />
            <span className="text-sm font-medium">Undo</span>
          </div>
        </button>
        <button type="button" className={buttonBase} onClick={redo} aria-label="Redo">
          <div className="flex items-center gap-2">
            <Redo2 size={18} />
            <span className="text-sm font-medium">Redo</span>
          </div>
        </button>
        <button type="button" className={buttonBase} onClick={resetViewport} aria-label="Reset view">
          <div className="flex items-center gap-2">
            <ScanEye size={18} />
            <span className="text-sm font-medium">Reset</span>
          </div>
        </button>
      </div>

      <p className="text-sm text-slate-500">
        Tip: middle-click and drag to pan, and use the wheel to zoom in and out.
      </p>
    </div>
  );
}
