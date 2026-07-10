"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";

export default function SignupPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const { error } = await authClient.signUp.email({ email, password, name });
      if (error) {
        setError(error.message || "Sign-up failed.");
        return;
      }
      router.push("/");
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-slate-50 p-6">
      <form onSubmit={handleSubmit} className="w-full max-w-md rounded-2xl bg-white p-8 shadow">
        <h1 className="text-xl font-semibold mb-4">Create account</h1>
        {error && <div className="mb-2 text-sm text-rose-500">{error}</div>}
        <label className="block mb-3">
          <div className="text-sm mb-1">Full name</div>
          <input value={name} onChange={(e) => setName(e.target.value)} type="text" required className="w-full rounded-lg border px-3 py-2" />
        </label>
        <label className="block mb-3">
          <div className="text-sm mb-1">Email</div>
          <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" required className="w-full rounded-lg border px-3 py-2" />
        </label>
        <label className="block mb-4">
          <div className="text-sm mb-1">Password</div>
          <input value={password} onChange={(e) => setPassword(e.target.value)} type="password" required className="w-full rounded-lg border px-3 py-2" />
        </label>
        <button type="submit" disabled={loading} className="w-full rounded-lg bg-slate-900 text-white px-4 py-2">
          {loading ? "Creating…" : "Create account"}
        </button>
      </form>
    </main>
  );
}
