"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { authClient } from "@/lib/auth-client";
import { useCanvasStore } from "@/store/canvasStore";
import type { CanvasElement } from "@/types/canvas";

type LayoutRecord = {
  id: string;
  name: string;
  data?: CanvasElement[];
  canvasElements?: CanvasElement[];
  createdAt: string;
};

type VaultLayout = {
  id: string;
  name: string;
  data: CanvasElement[];
  createdAt: string;
};

export function LayoutVault() {
  const { canvasElements, updateCanvasElements } = useCanvasStore();
  const { data: session, isPending: sessionPending } = authClient.useSession();
  const signedIn = Boolean(session?.user);
  const [savedLayouts, setSavedLayouts] = useState<VaultLayout[]>([]);
  const [saving, setSaving] = useState(false);
  const [name, setName] = useState("My layout");
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [sessionError, setSessionError] = useState<string | null>(null);

  const layoutCount = savedLayouts.length;

  const fetchSavedLayouts = useCallback(async () => {
    if (!signedIn) {
      setSavedLayouts([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    setSessionError(null);

    try {
      const response = await fetch("/api/vault");
      if (!response.ok) {
        throw new Error("Unable to fetch saved layouts.");
      }

      const data = await response.json();
      const layouts = Array.isArray(data.layouts) ? data.layouts : [];
      setSavedLayouts(
        layouts.map((layout: LayoutRecord) => ({
          id: layout.id,
          name: layout.name,
          data: Array.isArray(layout.data)
            ? layout.data
            : Array.isArray(layout.canvasElements)
            ? layout.canvasElements
            : [],
          createdAt: layout.createdAt,
        }))
      );
    } catch (error) {
      setSessionError(error instanceof Error ? error.message : "Unable to load vault data.");
      setSavedLayouts([]);
    } finally {
      setLoading(false);
    }
  }, [signedIn]);

  useEffect(() => {
    (async () => {
      await fetchSavedLayouts();
    })();
  }, [fetchSavedLayouts]);

  const saveLayout = async () => {
    const trimmedName = name.trim();
    if (!trimmedName) {
      setMessage("Enter a name before saving.");
      return;
    }

    if (!signedIn) {
      setMessage("Sign in to save layouts.");
      return;
    }

    setSaving(true);
    setMessage(null);

    try {
      const response = await fetch("/api/vault", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: trimmedName, data: canvasElements }),
      });

      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.error || "Unable to save layout.");
      }

      setMessage(`Saved “${trimmedName}” to your vault.`);
      setName("My layout");
      await fetchSavedLayouts();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Save failed.");
    } finally {
      setSaving(false);
    }
  };

  const loadLayout = (layout: VaultLayout) => {
    updateCanvasElements(layout.data);
    setMessage(`Loaded “${layout.name}”.`);
  };

  const summaryText = useMemo(() => {
    if (sessionPending) return "Checking session…";
    if (loading) return "Loading vault…";
    if (sessionError) return `Vault error: ${sessionError}`;
    if (!signedIn) return "Sign in to save and load layouts.";
    return `${layoutCount} saved layout${layoutCount === 1 ? "" : "s"}.`;
  }, [layoutCount, loading, sessionError, sessionPending, signedIn]);

  return (
    <div className="flex h-full flex-col rounded-[32px] border border-slate-200 bg-white shadow-xl">
      <div className="border-b border-slate-200 px-5 py-4 text-sm font-semibold text-slate-800">Layout Vault</div>
      <div className="flex-1 overflow-y-auto p-5">
        <p className="mb-4 text-sm text-slate-600">{summaryText}</p>

        <div className="mb-4 grid gap-3 sm:grid-cols-[1fr_auto]">
          <label className="space-y-2 text-sm text-slate-700">
            <span>Layout name</span>
            <input
              value={name}
              onChange={(event) => setName(event.target.value)}
              className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-slate-900"
              placeholder="Give it a name"
            />
          </label>
          <button
            type="button"
            onClick={saveLayout}
            disabled={saving || !signedIn}
            className="inline-flex h-12 items-center justify-center rounded-3xl bg-slate-950 px-4 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-300"
          >
            {saving ? "Saving…" : "Save layout"}
          </button>
        </div>

        {message ? (
          <div className="mb-4 rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700">{message}</div>
        ) : null}

        <div className="space-y-3">
          {savedLayouts.length > 0 ? (
            savedLayouts.map((layout) => (
              <div key={layout.id} className="rounded-3xl border border-slate-200 bg-slate-50 p-4">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="font-semibold text-slate-900">{layout.name}</p>
                    <p className="text-xs text-slate-500">Saved {new Date(layout.createdAt).toLocaleString()}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => loadLayout(layout)}
                    className="rounded-2xl bg-slate-950 px-3 py-2 text-xs font-semibold text-white transition hover:bg-slate-800"
                  >
                    Load
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="rounded-3xl border border-dashed border-slate-200 bg-slate-50 p-6 text-sm text-slate-500">
              No saved layouts yet. Draw, compile, and save your first design to build the vault.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
