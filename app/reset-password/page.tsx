"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";

export default function ResetPasswordPage() {
  const router = useRouter();
  const [token, setToken] = useState<string | undefined>(undefined);

  // Read token from query string on the client to avoid prerender issues
  useEffect(() => {
    const init = () => {
      try {
        const params = new URLSearchParams(window.location.search);
        const t = params.get("token") || undefined;
        setToken(t);
      } catch {
        // ignore malformed URL params
      }
    };
    init();
  }, []);
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);
    try {
      if (!token) {
        setMessage("Missing reset token.");
        return;
      }
      type ResetPasswordFn = (opts: { token: string; newPassword: string }) => Promise<unknown>;
      const res = await (((authClient as unknown as Record<string, unknown>).resetPassword as ResetPasswordFn | undefined)?.({ token, newPassword: password }));
      if (typeof res === "object" && res !== null && "error" in res) {
        const err = (res as Record<string, unknown>).error;
        if (typeof err === "string") {
          setMessage(err);
          return;
        }
        setMessage("Failed to reset password.");
      }
      setMessage("Password updated. You can now sign in.");
      setTimeout(() => router.push("/login"), 1200);
    } catch (err) {
      setMessage(err instanceof Error ? err.message : String(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-slate-50 p-6">
      <form onSubmit={handleSubmit} className="w-full max-w-md rounded-2xl bg-white p-8 shadow">
        <h1 className="text-xl font-semibold mb-4">Choose a new password</h1>
        {message && <div className="mb-2 text-sm text-slate-700">{message}</div>}
        <label className="block mb-3">
          <div className="text-sm mb-1">New password</div>
          <input value={password} onChange={(e) => setPassword(e.target.value)} type="password" required minLength={8} className="w-full rounded-lg border px-3 py-2" />
        </label>
        <button type="submit" disabled={loading} className="w-full rounded-lg bg-slate-900 text-white px-4 py-2">
          {loading ? "Updating…" : "Update password"}
        </button>
      </form>
    </main>
  );
}
