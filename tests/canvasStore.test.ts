import { describe, it, expect, beforeEach } from 'vitest';
import { useCanvasStore } from '@/store/canvasStore';

// Note: zustand store is global; reset between tests by replacing state
import type { CanvasState } from '@/store/canvasStore';

beforeEach(() => {
  useCanvasStore.setState({
    canvasElements: [],
    history: [],
    future: [],
    panOffset: { x: 0, y: 0 },
    zoomScale: 1,
  } as unknown as Partial<CanvasState>);
});

describe('canvas store basic operations', () => {
  it('adds elements and supports undo/redo', () => {
    const element = { id: 'a', tool: 'text', x: 0, y: 0, text: 'hi', color: '#000' } as const;
    useCanvasStore.getState().addCanvasElement(element);
    expect(useCanvasStore.getState().canvasElements.length).toBe(1);

    useCanvasStore.getState().undo();
    expect(useCanvasStore.getState().canvasElements.length).toBe(0);

    useCanvasStore.getState().redo();
    expect(useCanvasStore.getState().canvasElements.length).toBe(1);
  });

  it('clamps zoomScale between 0.5 and 3', () => {
    useCanvasStore.getState().setZoomScale(10);
    expect(useCanvasStore.getState().zoomScale).toBeLessThanOrEqual(3);

    useCanvasStore.getState().setZoomScale(0.1);
    expect(useCanvasStore.getState().zoomScale).toBeGreaterThanOrEqual(0.5);
  });
});
