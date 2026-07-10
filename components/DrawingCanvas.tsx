"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useCanvasStore } from "@/store/canvasStore";
import type { CanvasElement, RectangleShape, TextBlock } from "@/types/canvas";

const clamp = (value: number, min: number, max: number) => Math.min(Math.max(value, min), max);

export function DrawingCanvas() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const {
    activeTool,
    strokeColor,
    strokeWidth,
    canvasElements,
    addCanvasElement,
    panOffset,
    zoomScale,
    setPanOffset,
    setZoomScale,
    isPanning,
    setIsPanning,
  } = useCanvasStore();

  const [isDrawing, setIsDrawing] = useState(false);
  const [startPoint, setStartPoint] = useState<{ x: number; y: number } | null>(null);
  const [draftElement, setDraftElement] = useState<CanvasElement | null>(null);
  const [statusMessage, setStatusMessage] = useState("Sketch and compile in one smooth flow.");

  const getCanvasPoint = (event: React.PointerEvent<HTMLCanvasElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const x = (event.clientX - rect.left - panOffset.x) / zoomScale;
    const y = (event.clientY - rect.top - panOffset.y) / zoomScale;
    return { x, y };
  };

  const drawElement = useCallback((ctx: CanvasRenderingContext2D, element: CanvasElement) => {
    if (element.tool === "brush") {
      ctx.strokeStyle = element.color;
      ctx.lineWidth = element.width;
      ctx.beginPath();
      if (element.points.length > 0) {
        ctx.moveTo(element.points[0].x, element.points[0].y);
        for (const point of element.points.slice(1)) {
          ctx.lineTo(point.x, point.y);
        }
        ctx.stroke();
      }
    }

    if (element.tool === "rectangle") {
      ctx.strokeStyle = element.color;
      ctx.lineWidth = Math.max(1, element.strokeWidth ?? strokeWidth);
      ctx.strokeRect(element.x, element.y, element.width, element.height);
    }

    if (element.tool === "text") {
      ctx.fillStyle = element.color;
      ctx.font = "20px Inter, ui-sans-serif, system-ui";
      ctx.fillText(element.text, element.x, element.y);
    }
  }, [strokeWidth]);

  const drawCanvas = useCallback((ctx: CanvasRenderingContext2D) => {
    const container = containerRef.current;
    if (!container) return;

    const { width, height } = container.getBoundingClientRect();
    ctx.clearRect(0, 0, width, height);
    ctx.save();
    ctx.translate(panOffset.x, panOffset.y);
    ctx.scale(zoomScale, zoomScale);
    ctx.lineCap = "round";
    ctx.lineJoin = "round";

    canvasElements.forEach((element) => drawElement(ctx, element));
    if (draftElement) {
      drawElement(ctx, draftElement);
    }
    ctx.restore();
  }, [canvasElements, panOffset, zoomScale, draftElement, drawElement]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const resizeCanvas = () => {
      const { width, height } = container.getBoundingClientRect();
      canvas.width = Math.round(width * window.devicePixelRatio);
      canvas.height = Math.round(height * window.devicePixelRatio);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      ctx.setTransform(window.devicePixelRatio, 0, 0, window.devicePixelRatio, 0, 0);
      drawCanvas(ctx);
    };

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    // Prevent default touch and gesture behaviors on the canvas container so the page doesn't zoom,
    // scroll, or pinch while interacting with the drawing surface.
    container.style.touchAction = "none";
    container.style.overscrollBehavior = "none";
    container.style.userSelect = "none";
    canvas.style.touchAction = "none";
    canvas.style.userSelect = "none";

    const wheelHandler = (e: WheelEvent) => {
      if (!container.contains(e.target as Node) && !canvas.contains(e.target as Node)) return;
      if (e.cancelable) e.preventDefault();
      e.stopPropagation();
      const delta = e.deltaY;
      setZoomScale((prev) => clamp(prev - delta * 0.001, 0.5, 3));
    };

    const preventDefaultEvent = (e: Event) => {
      if (e.cancelable) e.preventDefault();
      e.stopPropagation();
    };

    const captureCanvasGesture = (e: Event) => {
      if (!container.contains(e.target as Node) && !canvas.contains(e.target as Node)) return;
      if (e.cancelable) e.preventDefault();
      e.stopPropagation();
    };

    canvas.addEventListener("wheel", wheelHandler, { passive: false });
    container.addEventListener("wheel", wheelHandler, { passive: false });
    document.addEventListener("wheel", wheelHandler, { passive: false, capture: true });
    canvas.addEventListener("gesturestart", preventDefaultEvent as EventListener, { passive: false });
    canvas.addEventListener("gesturechange", preventDefaultEvent as EventListener, { passive: false });
    canvas.addEventListener("gestureend", preventDefaultEvent as EventListener, { passive: false });
    canvas.addEventListener("touchstart", preventDefaultEvent as EventListener, { passive: false });
    canvas.addEventListener("touchmove", preventDefaultEvent as EventListener, { passive: false });
    container.addEventListener("touchmove", preventDefaultEvent as EventListener, { passive: false });
    document.addEventListener("gesturestart", captureCanvasGesture as EventListener, { passive: false, capture: true });
    document.addEventListener("gesturechange", captureCanvasGesture as EventListener, { passive: false, capture: true });
    document.addEventListener("gestureend", captureCanvasGesture as EventListener, { passive: false, capture: true });
    document.addEventListener("touchstart", captureCanvasGesture as EventListener, { passive: false, capture: true });
    document.addEventListener("touchmove", captureCanvasGesture as EventListener, { passive: false, capture: true });

    return () => {
      window.removeEventListener("resize", resizeCanvas);
      canvas.removeEventListener("wheel", wheelHandler);
      container.removeEventListener("wheel", wheelHandler);
      document.removeEventListener("wheel", wheelHandler, { capture: true });
      canvas.removeEventListener("gesturestart", preventDefaultEvent as EventListener);
      canvas.removeEventListener("gesturechange", preventDefaultEvent as EventListener);
      canvas.removeEventListener("gestureend", preventDefaultEvent as EventListener);
      canvas.removeEventListener("touchstart", preventDefaultEvent as EventListener);
      canvas.removeEventListener("touchmove", preventDefaultEvent as EventListener);
      container.removeEventListener("touchmove", preventDefaultEvent as EventListener);
      document.removeEventListener("gesturestart", captureCanvasGesture as EventListener, { capture: true });
      document.removeEventListener("gesturechange", captureCanvasGesture as EventListener, { capture: true });
      document.removeEventListener("gestureend", captureCanvasGesture as EventListener, { capture: true });
      document.removeEventListener("touchstart", captureCanvasGesture as EventListener, { capture: true });
      document.removeEventListener("touchmove", captureCanvasGesture as EventListener, { capture: true });
    };
  }, [drawCanvas, setZoomScale]);

  useEffect(() => {
    const body = document.body;
    const html = document.documentElement;
    const previousBodyOverflow = body.style.overflow;
    const previousHtmlOverflow = html.style.overflow;
    const previousBodyTouchAction = body.style.touchAction;
    const previousHtmlTouchAction = html.style.touchAction;
    const previousBodyOverscroll = body.style.overscrollBehavior;
    const previousHtmlOverscroll = html.style.overscrollBehavior;

    if (isDrawing || isPanning) {
      body.style.overflow = "hidden";
      html.style.overflow = "hidden";
      body.style.touchAction = "none";
      html.style.touchAction = "none";
      body.style.overscrollBehavior = "none";
      html.style.overscrollBehavior = "none";
    }

    return () => {
      body.style.overflow = previousBodyOverflow;
      html.style.overflow = previousHtmlOverflow;
      body.style.touchAction = previousBodyTouchAction;
      html.style.touchAction = previousHtmlTouchAction;
      body.style.overscrollBehavior = previousBodyOverscroll;
      html.style.overscrollBehavior = previousHtmlOverscroll;
    };
  }, [isDrawing, isPanning]);

  const handlePointerDown = (event: React.PointerEvent<HTMLCanvasElement>) => {
    event.preventDefault();
    event.stopPropagation();
    const point = getCanvasPoint(event);

    if (event.button === 1) {
      event.currentTarget.setPointerCapture(event.pointerId);
      setIsPanning(true);
      setStatusMessage("Panning the canvas.");
      return;
    }

    if (activeTool === "brush") {
      event.currentTarget.setPointerCapture(event.pointerId);
      setIsDrawing(true);
      const base = {
        id: `stroke-${Date.now()}`,
        tool: "brush",
        color: strokeColor,
        width: strokeWidth,
        points: [point],
      } as CanvasElement;
      setDraftElement(base);
      setStatusMessage("Painting on the canvas.");
    }

    if (activeTool === "rectangle") {
      event.currentTarget.setPointerCapture(event.pointerId);
      setIsDrawing(true);
      setStartPoint(point);
      const base: RectangleShape = {
        id: `rect-${Date.now()}`,
        tool: "rectangle",
        x: point.x,
        y: point.y,
        width: 0,
        height: 0,
        color: strokeColor,
        strokeWidth: strokeWidth,
      };
      setDraftElement(base);
      setStatusMessage("Dragging a rectangle.");
    }

    if (activeTool === "text") {
      const text = window.prompt("Enter text placeholder", "Header");
      if (!text) return;
      const id = `${Date.now()}-${Math.random().toString(16).slice(2)}`;
      const element: TextBlock = {
        id,
        tool: "text",
        x: point.x,
        y: point.y,
        text: text.trim(),
        color: strokeColor,
      };
      addCanvasElement(element);
      setStatusMessage("Text block added.");
    }
  };

  const handlePointerMove = (event: React.PointerEvent<HTMLCanvasElement>) => {
    event.preventDefault();
    event.stopPropagation();
    const point = getCanvasPoint(event);

    if (isDrawing && draftElement?.tool === "brush") {
      setDraftElement((current) =>
        current && current.tool === "brush"
          ? { ...current, points: [...current.points, point] }
          : current
      );
    }

    if (isDrawing && draftElement?.tool === "rectangle" && startPoint) {
      setDraftElement((current) =>
        current && current.tool === "rectangle"
          ? {
              ...current,
              width: point.x - startPoint.x,
              height: point.y - startPoint.y,
            }
          : current
      );
    }

    if (isPanning) {
      setPanOffset((current: { x: number; y: number }) => ({
        x: current.x + event.movementX,
        y: current.y + event.movementY,
      }));
    }
  };

  const handlePointerUp = (event?: React.PointerEvent<HTMLCanvasElement>) => {
    event?.preventDefault();
    event?.stopPropagation();
    if (isPanning) {
      setIsPanning(false);
      setStatusMessage("Canvas ready for the next move.");
      return;
    }

    if (!isDrawing) return;

    if (draftElement) {
      addCanvasElement(draftElement);
      setStatusMessage("Element added to the canvas.");
    }

    if (event?.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }

    setIsDrawing(false);
    setStartPoint(null);
    setDraftElement(null);
  };

  const handleWheel = (event: React.WheelEvent<HTMLCanvasElement>) => {
    event.preventDefault();
    event.stopPropagation();
    const nextZoom = clamp(zoomScale - event.deltaY * 0.001, 0.5, 3);
    setZoomScale(nextZoom);
  };

  const toolLabel = activeTool === "brush" ? "Brush" : activeTool === "rectangle" ? "Rectangle" : "Text";

  return (
    <div ref={containerRef} className="relative h-full w-full overflow-hidden rounded-[32px] border border-slate-200 bg-[radial-gradient(circle_at_1px_1px,rgba(15,23,42,0.08)_1px,transparent_0)] bg-[length:24px_24px] shadow-inner touch-none select-none">
      <canvas
        ref={canvasRef}
        className="h-full w-full touch-none select-none"
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        onPointerLeave={(event) => {
          if (event.buttons === 0) {
            handlePointerUp(event);
          }
        }}
        onContextMenu={(event) => event.preventDefault()}
        onWheel={handleWheel}
        onTouchStart={(event) => event.preventDefault()}
        onTouchMove={(event) => event.preventDefault()}
      />
      <div className="pointer-events-none absolute inset-x-0 top-4 flex justify-center px-4">
        <div className="rounded-full border border-slate-200 bg-white/80 px-4 py-2 text-xs font-medium text-slate-700 shadow-sm backdrop-blur">
          {toolLabel} • {Math.round(zoomScale * 100)}% zoom
        </div>
      </div>
      <div className="pointer-events-none absolute left-4 top-16 rounded-2xl border border-slate-200 bg-white/90 px-4 py-3 text-sm text-slate-600 shadow-sm backdrop-blur">
        {statusMessage}
      </div>
      <div className="pointer-events-none absolute inset-x-0 bottom-4 flex justify-center">
        <div className="rounded-full bg-slate-950/75 px-4 py-2 text-xs font-medium text-white backdrop-blur">
          Middle-click and drag to pan • Scroll to zoom
        </div>
      </div>
    </div>
  );
}
