import { create } from "zustand";
import type { CanvasElement, Point, ToolType } from "@/types/canvas";

const clamp = (value: number, min: number, max: number) => Math.min(Math.max(value, min), max);

export type CanvasState = {
  activeTool: ToolType;
  strokeColor: string;
  strokeWidth: number;
  canvasElements: CanvasElement[];
  isPanning: boolean;
  panOffset: Point;
  zoomScale: number;
  history: CanvasElement[][];
  future: CanvasElement[][];
  setActiveTool: (tool: ToolType) => void;
  setStrokeColor: (color: string) => void;
  setStrokeWidth: (width: number) => void;
  addCanvasElement: (element: CanvasElement) => void;
  updateCanvasElements: (elements: CanvasElement[]) => void;
  clearCanvas: () => void;
  undo: () => void;
  redo: () => void;
  resetViewport: () => void;
  setPanOffset: (offset: Point | ((current: Point) => Point)) => void;
  setZoomScale: (scale: number | ((prev: number) => number)) => void;
  setIsPanning: (active: boolean) => void;
};

export const useCanvasStore = create<CanvasState>((set, get) => ({
  activeTool: "brush",
  strokeColor: "#111827",
  strokeWidth: 3,
  canvasElements: [],
  isPanning: false,
  panOffset: { x: 0, y: 0 },
  zoomScale: 1,
  history: [],
  future: [],
  setActiveTool: (tool) => set({ activeTool: tool }),
  setStrokeColor: (color) => set({ strokeColor: color }),
  setStrokeWidth: (width) => set({ strokeWidth: width }),
  addCanvasElement: (element) => {
    const { canvasElements, history } = get();
    set({
      canvasElements: [...canvasElements, element],
      history: [...history, canvasElements],
      future: [],
    });
  },
  updateCanvasElements: (elements) => {
    const { canvasElements, history } = get();
    set({
      canvasElements: elements,
      history: [...history, canvasElements],
      future: [],
    });
  },
  clearCanvas: () => {
    const { canvasElements, history } = get();
    set({
      canvasElements: [],
      history: [...history, canvasElements],
      future: [],
    });
  },
  undo: () => {
    const { history, canvasElements, future } = get();
    if (history.length === 0) return;
    const previous = history[history.length - 1];
    set({
      canvasElements: previous,
      history: history.slice(0, -1),
      future: [canvasElements, ...future],
    });
  },
  redo: () => {
    const { history, canvasElements, future } = get();
    if (future.length === 0) return;
    const next = future[0];
    set({
      canvasElements: next,
      history: [...history, canvasElements],
      future: future.slice(1),
    });
  },
  resetViewport: () => set({ panOffset: { x: 0, y: 0 }, zoomScale: 1, isPanning: false }),
  setPanOffset: (offset) =>
    set({
      panOffset:
        typeof offset === "function"
          ? offset(get().panOffset)
          : offset,
    }),
  setZoomScale: (scale) =>
    set({
      zoomScale:
        typeof scale === "function" ? clamp(scale(get().zoomScale), 0.5, 3) : clamp(scale, 0.5, 3),
    }),
  setIsPanning: (active) => set({ isPanning: active }),
}));
