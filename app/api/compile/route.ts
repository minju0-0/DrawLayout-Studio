import { NextResponse } from "next/server";
import { compileSketchToTailwind } from "@/lib/gemini";
import type { CompileRequestPayload } from "@/types/compile";

const FALLBACK_CODE = `import React from 'react';

export function ExampleLayout() {
  return (
    <div className="mx-auto max-w-5xl rounded-3xl bg-white p-8 shadow-lg">
      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-4">
          <div className="h-24 rounded-3xl bg-slate-100"></div>
          <div className="h-40 rounded-3xl bg-slate-100"></div>
        </div>
        <div className="space-y-4">
          <div className="h-20 rounded-3xl bg-slate-100"></div>
          <div className="h-32 rounded-3xl bg-slate-100"></div>
        </div>
      </div>
    </div>
  );
}
`;

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

export async function POST(request: Request) {
  try {
    const payload = await request.json();

    if (!isRecord(payload) || !Array.isArray(payload.canvasElements)) {
      return NextResponse.json(
        { error: "Invalid request payload. Expected { canvasElements: CanvasElement[] }." },
        { status: 400 }
      );
    }

    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json(
        {
          code: FALLBACK_CODE,
          warning: "No GEMINI_API_KEY configured. Returning fallback example code.",
        },
        { status: 200 }
      );
    }

    try {
      const result = await compileSketchToTailwind(payload as CompileRequestPayload);
      if (typeof result === "object" && result !== null && "error" in result && typeof (result as Record<string, unknown>).error === "string") {
        console.error("[compile] AI error:", (result as Record<string, unknown>).error);
        return NextResponse.json({ code: FALLBACK_CODE, warning: "AI returned an unusable response. Showing fallback example." }, { status: 200 });
      }

      return NextResponse.json({
        code: result.code,
        warning: result.warning,
      });
    } catch (err) {
      console.error("[compile]", err);
      return NextResponse.json({ code: FALLBACK_CODE, warning: "AI request failed. Returning fallback example." }, { status: 200 });
    }
  } catch (error) {
    console.error("[compile]", error);
    return NextResponse.json(
      { error: "Unable to compile canvas layout." },
      { status: 500 }
    );
  }
}
