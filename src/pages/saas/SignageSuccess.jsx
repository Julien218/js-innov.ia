import React, { useEffect, useState } from 'react';
import { CheckCircle2, Loader2, ArrowRight, AlertCircle } from 'lucide-react';

export default function SignageSuccess() {
  const [state, setState] = useState({ loading: true, ok: false, message: '' });

  useEffect(() => {
    const sessionId = new URLSearchParams(window.location.search).get('session_id');
    if (!sessionId) {
      setState({ loading: false, ok: false, message: 'Référence de paiement manquante.' });
      return;
    }
    fetch(`/api/signage/session?session_id=${encodeURIComponent(sessionId)}`)
      .then(async (r) => ({ ok: r.ok, data: await r.json().catch(() => ({})) }))
      .then(({ ok, data }) => {
        if (!ok || !data.confirmed) throw new Error(data.error || 'Paiement en cours de confirmation.');
        setState({ loading: false, ok: true, message: data.customerEmail ? `Confirmation envoyée à ${data.customerEmail}.` : 'Votre paiement est confirmé.' });
      })
      .catch((e) => setState({ loading: false, ok: false, message: e.message || 'Confirmation en cours.' }));
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 px-5 py-20 text-white">
      <div className="mx-auto max-w-xl rounded-3xl border border-white/10 bg-white/5 p-8 text-center md:p-12">
        {state.loading ? <Loader2 className="mx-auto h-12 w-12 animate-spin text-cyan-300" /> : state.ok ? <CheckCircle2 className="mx-auto h-14 w-14 text-emerald-400" /> : <AlertCircle className="mx-auto h-14 w-14 text-amber-400" />}
        <h1 className="mt-6 text-3xl font-black">{state.loading ? 'Confirmation du paiement…' : state.ok ? 'Commande confirmée' : 'Confirmation en cours'}</h1>
        <p className="mt-4 text-sm leading-6 text-slate-300">{state.loading ? 'Nous vérifions votre session Stripe.' : state.message}</p>
        {state.ok && <p className="mt-3 text-sm leading-6 text-slate-400">Votre dossier technique et vos réponses ont été transmis au cockpit JS-Innov.IA. L’onboarding de votre installation peut maintenant commencer.</p>}
        <a href="/" className="mt-8 inline-flex items-center gap-2 rounded-xl bg-cyan-600 px-5 py-3 text-sm font-bold text-white">Retour au site <ArrowRight className="h-4 w-4" /></a>
      </div>
    </div>
  );
}
