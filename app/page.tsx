import Link from "next/link";
import { ArrowRight, Code2, Layout, Sparkles } from "lucide-react";

const features = [
  {
    title: "Draw fast wireframes",
    description: "Sketch page layouts with brush, rectangle, and text tools in a smooth canvas editor.",
    icon: Layout,
  },
  {
    title: "Compile Tailwind code",
    description: "Generate copy/paste-ready Tailwind markup with instant preview and export support.",
    icon: Code2,
  },
  {
    title: "Save reusable layouts",
    description: "Store designs in your vault and reload them anytime when you sign in.",
    icon: Sparkles,
  },
];

export default function Home() {
  return (
    <main className="min-h-screen px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto flex max-w-7xl flex-col gap-10">
        <section className="rounded-[32px] border border-slate-200 bg-white/95 p-10 shadow-[var(--shadow)] backdrop-blur-xl">
          <div className="grid gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
            <div className="space-y-6">
              <p className="text-sm font-semibold uppercase tracking-[0.3em] text-slate-500">DrawLayout Studio</p>
              <h1 className="text-5xl font-semibold tracking-tight text-slate-950 sm:text-6xl">Sketch layouts and ship Tailwind faster.</h1>
              <p className="max-w-2xl text-lg leading-8 text-slate-600">
                Draw structure, compile it to clean Tailwind markup, and save repeatable layouts in a unified workflow built for product design and frontend development.
              </p>
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                <Link href="/app" className="inline-flex items-center justify-center rounded-full bg-slate-950 px-6 py-3 text-sm font-semibold text-white transition hover:bg-slate-800">
                  Open editor
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
                <Link href="/signup" className="inline-flex items-center justify-center rounded-full border border-slate-200 bg-white px-6 py-3 text-sm font-semibold text-slate-950 transition hover:bg-slate-50">
                  Create account
                </Link>
              </div>
            </div>
            <div className="rounded-[28px] border border-slate-200 bg-slate-50 p-6 shadow-sm">
              <div className="rounded-[24px] bg-white p-5 shadow-sm">
                <p className="text-xs uppercase tracking-[0.28em] text-slate-500">Live preview</p>
                <div className="mt-4 grid gap-3">
                  <div className="h-12 rounded-2xl bg-gradient-to-r from-slate-950 to-violet-600" />
                  <div className="h-8 rounded-2xl bg-slate-200" />
                  <div className="h-8 rounded-2xl bg-slate-200" />
                  <div className="h-8 rounded-2xl bg-slate-200/80" />
                </div>
              </div>
              <div className="mt-6 rounded-[24px] bg-slate-950 p-6 text-white shadow-sm">
                <p className="text-xs uppercase tracking-[0.28em] text-slate-400">Workflow</p>
                <p className="mt-3 text-lg font-semibold">Draw, compile, and export without switching tools.</p>
              </div>
            </div>
          </div>
        </section>

        <section className="grid gap-6 sm:grid-cols-3">
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <div key={feature.title} className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
                <div className="inline-flex h-12 w-12 items-center justify-center rounded-3xl bg-slate-950 text-white">
                  <Icon className="h-6 w-6" />
                </div>
                <h2 className="mt-4 text-lg font-semibold text-slate-950">{feature.title}</h2>
                <p className="mt-3 text-sm leading-6 text-slate-600">{feature.description}</p>
              </div>
            );
          })}
        </section>

        <section className="rounded-[32px] border border-slate-200 bg-white p-10 shadow-[var(--shadow)]">
          <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
            <div className="space-y-4">
              <p className="text-sm font-semibold uppercase tracking-[0.28em] text-slate-500">Why choose DrawLayout</p>
              <h2 className="text-3xl font-semibold tracking-tight text-slate-950">A fast workflow for layout-first product design.</h2>
              <p className="max-w-2xl text-sm leading-7 text-slate-600">
                Use an intuitive canvas to sketch your interface, compile it into Tailwind markup instantly, and keep reusable layouts in your personal vault.
              </p>
            </div>
            <div className="grid gap-4">
              <div className="rounded-[28px] border border-slate-200 bg-slate-50 p-6">
                <p className="text-sm font-semibold text-slate-900">Clean code export</p>
                <p className="mt-2 text-sm leading-6 text-slate-600">Copy HTML, React, or Vue-ready code with just one click.</p>
              </div>
              <div className="rounded-[28px] border border-slate-200 bg-slate-50 p-6">
                <p className="text-sm font-semibold text-slate-900">Auth-backed storage</p>
                <p className="mt-2 text-sm leading-6 text-slate-600">Save and restore layouts securely when you sign in.</p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
