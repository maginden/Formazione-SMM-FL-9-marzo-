'use client';

import dynamic from 'next/dynamic';

const Presentation = dynamic(() => import('@/components/Presentation'), {
  ssr: false,
  loading: () => (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 border-4 border-emerald-600/20 border-t-emerald-600 rounded-full animate-spin" />
        <p className="text-slate-500 font-medium animate-pulse">Caricamento Masterclass...</p>
      </div>
    </div>
  ),
});

export default function Home() {
  return (
    <main>
      <Presentation />
    </main>
  );
}
