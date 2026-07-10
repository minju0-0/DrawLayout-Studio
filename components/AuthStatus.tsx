"use client";

import { authClient } from "@/lib/auth-client";

export function AuthStatus() {
  const { data: session, isPending } = authClient.useSession();

  const onSignIn = () => {
    window.location.href = "/login";
  };

  const onSignOut = async () => {
    await authClient.signOut();
    window.location.reload();
  };

  if (isPending) {
    return <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-500">Checking auth status…</div>;
  }

  if (!session?.user) {
    return (
      <div className="space-y-3 rounded-[28px] border border-slate-200 bg-slate-50 p-5 text-slate-700 shadow-sm">
        <p className="text-sm font-semibold uppercase tracking-[0.28em] text-slate-500">Not signed in</p>
        <p className="text-sm text-slate-600">Sign in to save layouts and access your vault from anywhere.</p>
        <button
          type="button"
          onClick={onSignIn}
          className="inline-flex items-center justify-center rounded-full bg-slate-950 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-800"
        >
          Sign in
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-3 rounded-[28px] border border-slate-200 bg-slate-50 p-5 text-slate-700 shadow-sm">
      <div>
        <p className="text-sm font-semibold uppercase tracking-[0.28em] text-slate-500">Signed in as</p>
        <p className="mt-1 text-base font-semibold text-slate-950">{session.user.name ?? session.user.email}</p>
      </div>
      <button
        type="button"
        onClick={onSignOut}
        className="inline-flex items-center justify-center rounded-full bg-white px-4 py-2 text-sm font-semibold text-slate-900 ring-1 ring-slate-200 transition hover:bg-slate-100"
      >
        Sign out
      </button>
    </div>
  );
}
