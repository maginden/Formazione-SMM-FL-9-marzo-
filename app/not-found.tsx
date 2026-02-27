import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 p-6 text-center">
      <h2 className="text-4xl font-bold text-slate-900 mb-4">404 - Pagina non trovata</h2>
      <p className="text-slate-600 mb-8">La pagina che stai cercando non esiste o è stata spostata.</p>
      <Link 
        href="/"
        className="px-6 py-3 bg-emerald-600 text-white rounded-xl font-medium hover:bg-emerald-700 transition-colors"
      >
        Torna alla Home
      </Link>
    </div>
  );
}
