import type { CanvasElement } from "@/types/canvas";

export type CompileRequestPayload = {
  canvasElements: CanvasElement[];
};

export type CompileResponsePayload = {
  code: string;
  warning?: string;
};
