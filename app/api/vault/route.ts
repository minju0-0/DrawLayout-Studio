import { NextResponse } from "next/server";
import { randomUUID } from "crypto";
import { db } from "@/lib/db";
import { auth } from "@/lib/auth";
import { layouts } from "@/db/schema";
import { desc, eq } from "drizzle-orm";

async function getAuthenticatedUser(request: Request) {
  const session = await auth.api.getSession({
    headers: request.headers,
    query: { disableCookieCache: true },
  });

  return session?.user ?? null;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function sanitizePayload(payload: unknown) {
  if (!isRecord(payload)) {
    return null;
  }

  const name = typeof payload.name === "string" ? payload.name.trim() : "";
  const layoutData = Array.isArray(payload.data)
    ? payload.data
    : Array.isArray(payload.canvasElements)
      ? payload.canvasElements
      : null;

  return {
    name,
    layoutData,
  };
}

export async function GET(request: Request) {
  try {
    const user = await getAuthenticatedUser(request);
    if (!user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const rows = await db
      .select()
      .from(layouts)
      .where(eq(layouts.userId, user.id))
      .orderBy(desc(layouts.createdAt));

    return NextResponse.json({ layouts: rows });
  } catch (error) {
    console.error("[vault:GET]", error);
    return NextResponse.json(
      { error: "Unable to fetch layouts." },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const user = await getAuthenticatedUser(request);
    if (!user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const payload = await request.json();
    const sanitized = sanitizePayload(payload);

    if (!sanitized || !sanitized.name || !Array.isArray(sanitized.layoutData)) {
      return NextResponse.json(
        { error: "Invalid vault payload. Expected { name: string, data: any[] } or { name: string, canvasElements: any[] }." },
        { status: 400 }
      );
    }

    // enforce reasonable limits to avoid huge payloads
    const MAX_ELEMENTS = 500;
    const MAX_PAYLOAD_BYTES = 500_000; // ~500KB
    if (sanitized.layoutData.length > MAX_ELEMENTS) {
      return NextResponse.json({ error: "Layout payload too large." }, { status: 400 });
    }
    if (JSON.stringify(sanitized.layoutData).length > MAX_PAYLOAD_BYTES) {
      return NextResponse.json({ error: "Layout payload exceeds allowed size." }, { status: 400 });
    }

    const now = new Date();
    const newLayout = {
      id: randomUUID(),
      userId: user.id,
      name: sanitized.name,
      data: sanitized.layoutData,
      createdAt: now,
      updatedAt: now,
    };

    await db.insert(layouts).values(newLayout);

    return NextResponse.json({ layout: newLayout }, { status: 201 });
  } catch (error) {
    console.error("[vault:POST]", error);
    return NextResponse.json(
      { error: "Unable to save layout." },
      { status: 500 }
    );
  }
}
