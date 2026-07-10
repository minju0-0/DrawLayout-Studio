"use client";

import { useState } from "react";
import { authClient } from "@/lib/auth-client";

type ResetFn = (opts: { email: string; redirectTo?: string }) => Promise<unknown>;

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);
    try {
      // Try common client API name; fallback to a message if unavailable
      const clientAny = authClient as unknown as Record<string, unknown>;
      if (typeof clientAny.forgotPassword === "function") {
        const fn = clientAny.forgotPassword as ResetFn;
        const res = await fn({ email, redirectTo: `${window.location.origin}/reset-password` });
        if (typeof res === "object" && res !== null && "error" in res) {
          const err = (res as Record<string, unknown>).error;
          if (typeof err === "string") {
            setMessage(err);
            return;
          }
          setMessage("Failed to send reset email.");
        }
        setMessage("Password reset email sent. Check your inbox.");
      } else if (typeof clientAny.forgetPassword === "function") {
        const fn = clientAny.forgetPassword as ResetFn;
        const res = await fn({ email, redirectTo: `${window.location.origin}/reset-password` });
        if (typeof res === "object" && res !== null && "error" in res) {
          const err = (res as Record<string, unknown>).error;
          if (typeof err === "string") {
            setMessage(err);
            return;
          }
          setMessage("Failed to send reset email.");
        }
        setMessage("Password reset email sent. Check your inbox.");
      } else {
        // As a fallback, tell the user to check signup or contact support
        setMessage("If an account exists, you'll receive reset instructions. If not, sign up or contact support.");
      }
    } catch (err) {
      setMessage(err instanceof Error ? err.message : String(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-slate-50 p-6">
      <form onSubmit={handleSubmit} className="w-full max-w-md rounded-2xl bg-white p-8 shadow">
        <h1 className="text-xl font-semibold mb-4">Reset password</h1>
        {message && <div className="mb-2 text-sm text-slate-700">{message}</div>}
        <label className="block mb-3">
          <div className="text-sm mb-1">Email</div>
          <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" required className="w-full rounded-lg border px-3 py-2" />
        </label>
        <button type="submit" disabled={loading} className="w-full rounded-lg bg-slate-900 text-white px-4 py-2">
          {loading ? "Sending…" : "Send reset email"}
        </button>
      </form>
    </main>
  );
}
