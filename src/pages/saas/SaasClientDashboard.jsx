import { useEffect } from 'react';

const COCKPIT_URL = import.meta.env.VITE_COCKPIT_URL || 'https://cockpit.jsinnovia.com';

export default function SaasClientDashboard() {
  useEffect(() => {
    window.location.replace(COCKPIT_URL);
  }, []);

  return (
    <main className="min-h-[60vh] grid place-items-center px-5 text-center text-white">
      <div>
        <p className="text-sm font-semibold text-amber-300">Espace client sécurisé</p>
        <h1 className="mt-3 text-3xl font-black">Redirection vers le Cockpit JS-Innov.IA…</h1>
        <p className="mt-3 text-sm text-white/50">Votre espace personnel est disponible dans le Cockpit sécurisé.</p>
        <a href={COCKPIT_URL} className="mt-6 inline-flex rounded-full bg-amber-300 px-5 py-3 font-bold text-slate-950">
          Ouvrir mon espace
        </a>
      </div>
    </main>
  );
}
