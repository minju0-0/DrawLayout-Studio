export type ToolType = "brush" | "rectangle" | "text";

export type Point = {
  x: number;
  y: number;
};

export type BrushStroke = {
  id: string;
  tool: "brush";
  color: string;
  width: number;
  points: Point[];
};

export type RectangleShape = {
  id: string;
  tool: "rectangle";
  x: number;
  y: number;
  width: number;
  height: number;
  color: string;
  strokeWidth: number;
};

export type TextBlock = {
  id: string;
  tool: "text";
  x: number;
  y: number;
  text: string;
  color: string;
};

export type CanvasElement = BrushStroke | RectangleShape | TextBlock;

export type CanvasExportElement =
  | {
      type: "brush";
      color: string;
      width: number;
      points: Point[];
    }
  | {
      type: "rectangle";
      x: number;
      y: number;
      width: number;
      height: number;
      color: string;
    }
  | {
      type: "text";
      x: number;
      y: number;
      text: string;
      color: string;
    };

export type CanvasExportPayload = {
  layout: CanvasExportElement[];
};
