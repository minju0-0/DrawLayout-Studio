import type { CanvasExportElement, CanvasExportPayload } from "@/types/canvas";
import type { CompileRequestPayload, CompileResponsePayload } from "@/types/compile";

const FALLBACK_HTML = `<!-- Example Tailwind layout generated from sketch -->
<div class="mx-auto max-w-5xl rounded-3xl bg-white p-8 shadow-lg">
  <div class="grid gap-6 md:grid-cols-2">
    <div class="space-y-4">
      <div class="h-24 rounded-3xl bg-slate-100"></div>
      <div class="h-40 rounded-3xl bg-slate-100"></div>
    </div>
    <div class="space-y-4">
      <div class="h-20 rounded-3xl bg-slate-100"></div>
      <div class="h-32 rounded-3xl bg-slate-100"></div>
    </div>
  </div>
</div>`;

function isPoint(value: unknown): value is { x: number; y: number } {
  return (
    typeof value === "object" &&
    value !== null &&
    typeof (value as Record<string, unknown>).x === "number" &&
    typeof (value as Record<string, unknown>).y === "number"
  );
}

function mapCanvasElement(element: unknown): CanvasExportElement | null {
  if (typeof element !== "object" || element === null) return null;

  const typed = element as Record<string, unknown>;
  if (typed.tool === "brush") {
    const points = Array.isArray(typed.points)
      ? typed.points.filter(isPoint).map((point) => ({ x: point.x, y: point.y }))
      : [];
    return {
      type: "brush",
      color: typeof typed.color === "string" ? typed.color : "#111827",
      width: typeof typed.width === "number" ? typed.width : 2,
      points,
    };
  }

  if (typed.tool === "rectangle") {
    return {
      type: "rectangle",
      x: typeof typed.x === "number" ? typed.x : 0,
      y: typeof typed.y === "number" ? typed.y : 0,
      width: typeof typed.width === "number" ? typed.width : 0,
      height: typeof typed.height === "number" ? typed.height : 0,
      color: typeof typed.color === "string" ? typed.color : "#111827",
    };
  }

  if (typed.tool === "text") {
    return {
      type: "text",
      x: typeof typed.x === "number" ? typed.x : 0,
      y: typeof typed.y === "number" ? typed.y : 0,
      text: typeof typed.text === "string" ? typed.text : "",
      color: typeof typed.color === "string" ? typed.color : "#111827",
    };
  }

  return null;
}

export async function compileSketchToTailwind(payload: CompileRequestPayload): Promise<CompileResponsePayload> {
  const apiKey = process.env.GEMINI_API_KEY;
  const layout = Array.isArray(payload.canvasElements)
    ? payload.canvasElements.map(mapCanvasElement).filter((item): item is CanvasExportElement => item !== null)
    : [];

  if (!apiKey) {
    return {
      code: FALLBACK_HTML,
      warning: "No GEMINI_API_KEY configured. Returning fallback example code.",
    };
  }

  const exportPayload: CanvasExportPayload = {
    layout,
  };

  const prompt = `You are an assistant that converts sketch wireframe data into clean, responsive Tailwind CSS markup.

The layout is described as an array of elements. Each element is one of:
- brush: a list of line points
- rectangle: a positioned box
- text: a text placeholder at specific coordinates

Use the position and sizing hints only to infer layout structure, not exact pixel placement.

Input layout:
${JSON.stringify(exportPayload, null, 2)}

Output only the final HTML markup using Tailwind CSS classes. Do not include additional explanation or markdown fences.`;

  // 1. Change the destination to the Gemini API endpoint
  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      // 2. Change the body structure to match Google's API schema
      body: JSON.stringify({
        contents: [
          {
            role: "user",
            parts: [
              { text: prompt }
            ]
          }
        ],
        generationConfig: {
          temperature: 0.2,
          maxOutputTokens: 900,
        }
      }),
    }
  );

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`AI compilation request failed: ${response.status} ${errorText}`);
  }

  // 3. Parse Google's response format correctly
  const body = await response.json();
  let text = body?.candidates?.[0]?.content?.parts?.[0]?.text ?? "";

  // 4. Clean up markdown code blocks if Gemini accidentally wraps the HTML in them
  text = text.replace(/```html|```/gi, "").trim();

  if (!text || text.trim().length === 0) {
    return {
      code: FALLBACK_HTML,
      warning: "The AI didn't return usable output. Showing a fallback example instead.",
    };
  }

  return {
    code: text,
  };
}
